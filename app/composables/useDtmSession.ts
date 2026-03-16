import type { Track } from './useDtmTracks'

export interface SessionUser {
  id: string
  name: string
  color: string
  joinedAt: number
}

export interface SessionState {
  tracks: Track[]
  bpm: number
  scale: string
  rootNote: number
  totalSteps: number
}

export interface ChatMessage {
  userId: string
  userName: string
  userColor: string
  text: string
  timestamp: number
}

export interface CursorPosition {
  userId: string
  userName: string
  color: string
  trackId: string
  midi: number
  step: number
}

interface SessionMessage {
  type: 'join' | 'leave' | 'sync-request' | 'sync-response' | 'grid-update' | 'setting-update' | 'heartbeat' | 'cursor' | 'chat'
  sessionId: string
  userId: string
  userName?: string
  userColor?: string
  payload?: any
}

const SESSION_COLORS = [
  '#6366f1', '#ec4899', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#8b5cf6', '#f97316',
]

function generateId() {
  return Math.random().toString(36).substring(2, 8)
}

function generateSessionCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function useDtmSession() {
  const isInSession = useState<boolean>('dtm-session-active', () => false)
  const sessionId = useState<string>('dtm-session-id', () => '')
  const currentUser = useState<SessionUser | null>('dtm-session-user', () => null)
  const participants = useState<SessionUser[]>('dtm-session-participants', () => [])
  const isHost = useState<boolean>('dtm-session-host', () => false)
  const chatMessages = useState<ChatMessage[]>('dtm-chat-messages', () => [])
  const remoteCursors = useState<Record<string, CursorPosition>>('dtm-remote-cursors', () => ({}))
  const unreadChat = useState<number>('dtm-unread-chat', () => 0)

  let channel: BroadcastChannel | null = null
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null
  let cleanupTimer: ReturnType<typeof setInterval> | null = null
  const lastHeartbeats = new Map<string, number>()

  let onGridUpdate: ((trackId: string, midi: number, step: number, active: boolean, userId: string) => void) | null = null
  let onSettingUpdate: ((settings: Partial<SessionState>) => void) | null = null
  let onFullSync: ((state: SessionState) => void) | null = null
  let chatPanelOpen = false

  function setChatPanelOpen(open: boolean) {
    chatPanelOpen = open
    if (open) unreadChat.value = 0
  }

  function setCallbacks(callbacks: {
    onGridUpdate?: typeof onGridUpdate
    onSettingUpdate?: typeof onSettingUpdate
    onFullSync?: typeof onFullSync
  }) {
    onGridUpdate = callbacks.onGridUpdate || null
    onSettingUpdate = callbacks.onSettingUpdate || null
    onFullSync = callbacks.onFullSync || null
  }

  function createSession(userName: string): string {
    const code = generateSessionCode()
    const userId = generateId()
    const user: SessionUser = {
      id: userId,
      name: userName,
      color: SESSION_COLORS[0],
      joinedAt: Date.now(),
    }

    sessionId.value = code
    currentUser.value = user
    isHost.value = true
    isInSession.value = true
    participants.value = [user]
    chatMessages.value = []

    initChannel(code)
    startHeartbeat()
    return code
  }

  function joinSession(code: string, userName: string): boolean {
    const normalizedCode = code.toUpperCase().trim()
    if (!normalizedCode) return false

    const userId = generateId()
    const colorIndex = Math.floor(Math.random() * SESSION_COLORS.length)
    const user: SessionUser = {
      id: userId,
      name: userName,
      color: SESSION_COLORS[colorIndex],
      joinedAt: Date.now(),
    }

    sessionId.value = normalizedCode
    currentUser.value = user
    isHost.value = false
    isInSession.value = true
    participants.value = [user]
    chatMessages.value = []

    initChannel(normalizedCode)
    startHeartbeat()

    sendMessage({
      type: 'join',
      sessionId: normalizedCode,
      userId: user.id,
      userName: user.name,
      userColor: user.color,
    })

    sendMessage({
      type: 'sync-request',
      sessionId: normalizedCode,
      userId: user.id,
    })

    return true
  }

  function leaveSession() {
    if (channel && currentUser.value) {
      sendMessage({
        type: 'leave',
        sessionId: sessionId.value,
        userId: currentUser.value.id,
      })
    }
    cleanup()
  }

  function initChannel(code: string) {
    if (channel) channel.close()
    channel = new BroadcastChannel(`dtm-session-${code}`)
    channel.onmessage = (event: MessageEvent<SessionMessage>) => {
      handleMessage(event.data)
    }
  }

  function handleMessage(msg: SessionMessage) {
    if (!currentUser.value) return
    if (msg.userId === currentUser.value.id) return
    if (msg.sessionId !== sessionId.value) return

    switch (msg.type) {
      case 'join': {
        const newUser: SessionUser = {
          id: msg.userId,
          name: msg.userName || 'Unknown',
          color: msg.userColor || SESSION_COLORS[participants.value.length % SESSION_COLORS.length],
          joinedAt: Date.now(),
        }
        if (!participants.value.find((p) => p.id === msg.userId)) {
          participants.value = [...participants.value, newUser]
        }
        lastHeartbeats.set(msg.userId, Date.now())

        if (isHost.value) {
          sendMessage({
            type: 'join',
            sessionId: sessionId.value,
            userId: currentUser.value!.id,
            userName: currentUser.value!.name,
            userColor: currentUser.value!.color,
          })
        }
        break
      }
      case 'leave': {
        participants.value = participants.value.filter((p) => p.id !== msg.userId)
        lastHeartbeats.delete(msg.userId)
        const cursors = { ...remoteCursors.value }
        delete cursors[msg.userId]
        remoteCursors.value = cursors
        break
      }
      case 'sync-request': {
        if (isHost.value) {
          const event = new CustomEvent('dtm-sync-request', { detail: { requesterId: msg.userId } })
          if (import.meta.client) window.dispatchEvent(event)
        }
        break
      }
      case 'sync-response': {
        if (msg.payload && onFullSync) {
          onFullSync(msg.payload)
        }
        break
      }
      case 'grid-update': {
        if (msg.payload && onGridUpdate) {
          onGridUpdate(msg.payload.trackId, msg.payload.midi, msg.payload.step, msg.payload.active, msg.userId)
        }
        break
      }
      case 'setting-update': {
        if (msg.payload && onSettingUpdate) {
          onSettingUpdate(msg.payload)
        }
        break
      }
      case 'cursor': {
        if (msg.payload) {
          if (msg.payload.midi === null) {
            const cursors = { ...remoteCursors.value }
            delete cursors[msg.userId]
            remoteCursors.value = cursors
          } else {
            remoteCursors.value = {
              ...remoteCursors.value,
              [msg.userId]: {
                userId: msg.userId,
                userName: msg.userName || '',
                color: msg.userColor || '#888',
                trackId: msg.payload.trackId,
                midi: msg.payload.midi,
                step: msg.payload.step,
              },
            }
          }
        }
        break
      }
      case 'chat': {
        if (msg.payload) {
          chatMessages.value = [...chatMessages.value, {
            userId: msg.userId,
            userName: msg.payload.userName || msg.userName || 'Unknown',
            userColor: msg.payload.userColor || msg.userColor || '#888',
            text: msg.payload.text,
            timestamp: msg.payload.timestamp || Date.now(),
          }]
          if (!chatPanelOpen) {
            unreadChat.value++
          }
        }
        break
      }
      case 'heartbeat': {
        lastHeartbeats.set(msg.userId, Date.now())
        if (!participants.value.find((p) => p.id === msg.userId)) {
          participants.value = [...participants.value, {
            id: msg.userId,
            name: msg.userName || 'Unknown',
            color: msg.userColor || SESSION_COLORS[participants.value.length % SESSION_COLORS.length],
            joinedAt: Date.now(),
          }]
        }
        break
      }
    }
  }

  function sendMessage(msg: SessionMessage) {
    if (channel) channel.postMessage(msg)
  }

  function broadcastGridUpdate(trackId: string, midi: number, step: number, active: boolean) {
    if (!isInSession.value || !currentUser.value) return
    sendMessage({
      type: 'grid-update',
      sessionId: sessionId.value,
      userId: currentUser.value.id,
      payload: { trackId, midi, step, active },
    })
  }

  function broadcastSettingUpdate(settings: Partial<SessionState>) {
    if (!isInSession.value || !currentUser.value) return
    sendMessage({
      type: 'setting-update',
      sessionId: sessionId.value,
      userId: currentUser.value.id,
      payload: settings,
    })
  }

  function sendSyncResponse(state: SessionState) {
    if (!currentUser.value) return
    sendMessage({
      type: 'sync-response',
      sessionId: sessionId.value,
      userId: currentUser.value.id,
      payload: state,
    })
  }

  let lastCursorBroadcast = 0
  function broadcastCursor(trackId: string, midi: number | null, step: number | null) {
    if (!isInSession.value || !currentUser.value) return
    const now = Date.now()
    if (now - lastCursorBroadcast < 50) return // throttle
    lastCursorBroadcast = now
    sendMessage({
      type: 'cursor',
      sessionId: sessionId.value,
      userId: currentUser.value.id,
      userName: currentUser.value.name,
      userColor: currentUser.value.color,
      payload: { trackId, midi, step },
    })
  }

  function broadcastChat(text: string) {
    if (!isInSession.value || !currentUser.value || !text.trim()) return
    const msg: ChatMessage = {
      userId: currentUser.value.id,
      userName: currentUser.value.name,
      userColor: currentUser.value.color,
      text: text.trim(),
      timestamp: Date.now(),
    }
    chatMessages.value = [...chatMessages.value, msg]
    sendMessage({
      type: 'chat',
      sessionId: sessionId.value,
      userId: currentUser.value.id,
      userName: currentUser.value.name,
      userColor: currentUser.value.color,
      payload: { text: msg.text, userName: msg.userName, userColor: msg.userColor, timestamp: msg.timestamp },
    })
  }

  function startHeartbeat() {
    heartbeatTimer = setInterval(() => {
      if (currentUser.value) {
        sendMessage({
          type: 'heartbeat',
          sessionId: sessionId.value,
          userId: currentUser.value.id,
          userName: currentUser.value.name,
          userColor: currentUser.value.color,
        })
      }
    }, 3000)

    cleanupTimer = setInterval(() => {
      const now = Date.now()
      const timeout = 10000
      const disconnected: string[] = []
      lastHeartbeats.forEach((lastSeen, userId) => {
        if (now - lastSeen > timeout) disconnected.push(userId)
      })
      if (disconnected.length > 0) {
        disconnected.forEach((id) => lastHeartbeats.delete(id))
        participants.value = participants.value.filter(
          (p) => p.id === currentUser.value?.id || !disconnected.includes(p.id)
        )
        const cursors = { ...remoteCursors.value }
        disconnected.forEach((id) => delete cursors[id])
        remoteCursors.value = cursors
      }
    }, 5000)
  }

  function cleanup() {
    if (heartbeatTimer) clearInterval(heartbeatTimer)
    if (cleanupTimer) clearInterval(cleanupTimer)
    if (channel) channel.close()
    heartbeatTimer = null
    cleanupTimer = null
    channel = null
    isInSession.value = false
    sessionId.value = ''
    currentUser.value = null
    participants.value = []
    isHost.value = false
    chatMessages.value = []
    remoteCursors.value = {}
    unreadChat.value = 0
    lastHeartbeats.clear()
    onGridUpdate = null
    onSettingUpdate = null
    onFullSync = null
  }

  return {
    isInSession,
    sessionId,
    currentUser,
    participants,
    isHost,
    chatMessages,
    remoteCursors,
    unreadChat,
    createSession,
    joinSession,
    leaveSession,
    setCallbacks,
    setChatPanelOpen,
    broadcastGridUpdate,
    broadcastSettingUpdate,
    sendSyncResponse,
    broadcastCursor,
    broadcastChat,
  }
}
