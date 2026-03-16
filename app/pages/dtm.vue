<template>
  <div class="dtm-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">🎛️ DTMステップシーケンサー</h1>
        <p class="page-desc">マルチトラックで作曲。セッション機能で共同制作も可能</p>
      </div>
      <div class="header-actions">
        <button class="header-btn post-btn" @click="showPostModal = true">📤 投稿</button>
        <button class="header-btn session-btn" @click="showSessionPanel = !showSessionPanel">
          <span v-if="isInSession" class="live-dot"></span>
          {{ isInSession ? `セッション (${participants.length})` : '🎵 セッション' }}
        </button>
      </div>
    </div>

    <!-- Session Panel -->
    <div v-if="showSessionPanel" class="session-panel">
      <template v-if="!isInSession">
        <div class="session-tabs">
          <button class="s-tab" :class="{ active: sessionTab === 'create' }" @click="sessionTab = 'create'">作成</button>
          <button class="s-tab" :class="{ active: sessionTab === 'join' }" @click="sessionTab = 'join'">参加</button>
        </div>
        <div class="session-form">
          <input v-model="sessionUserName" type="text" class="s-input" placeholder="あなたの名前" maxlength="12" />
          <input v-if="sessionTab === 'join'" v-model="joinCode" type="text" class="s-input code-input" placeholder="コード" maxlength="6" @input="joinCode = joinCode.toUpperCase()" />
          <button class="s-action-btn" :disabled="!sessionUserName.trim() || (sessionTab === 'join' && joinCode.length < 4)" @click="sessionTab === 'create' ? handleCreateSession() : handleJoinSession()">
            {{ sessionTab === 'create' ? 'セッション作成' : '参加する' }}
          </button>
          <p class="s-note">同じブラウザの別タブで同じコードを入力すると共同作曲できます</p>
        </div>
      </template>
      <template v-else>
        <div class="session-active">
          <div class="session-top-row">
            <div>
              <span class="s-code-label">コード</span>
              <span class="s-code" @click="copyCode">{{ sessionId }} <small>{{ copied ? '✓' : 'コピー' }}</small></span>
            </div>
            <button class="s-leave" @click="handleLeaveSession">退出</button>
          </div>
          <div class="participants-row">
            <div v-for="p in participants" :key="p.id" class="p-chip" :style="{ borderColor: p.color }">
              <span class="p-dot" :style="{ background: p.color }"></span>
              {{ p.name }}
              <small v-if="p.id === currentUser?.id">あなた</small>
            </div>
          </div>
        </div>
        <!-- Chat -->
        <div class="chat-section">
          <button class="chat-toggle" @click="showChat = !showChat; if(showChat) onOpenChat()">
            💬 チャット
            <span v-if="unreadChat > 0" class="chat-badge">{{ unreadChat }}</span>
          </button>
          <div v-if="showChat" class="chat-body">
            <div ref="chatScrollRef" class="chat-messages">
              <div v-for="(msg, i) in chatMessages" :key="i" class="chat-msg" :class="{ own: msg.userId === currentUser?.id }">
                <span class="chat-author" :style="{ color: msg.userColor }">{{ msg.userName }}</span>
                <span class="chat-text">{{ msg.text }}</span>
              </div>
              <p v-if="chatMessages.length === 0" class="chat-empty">メッセージはまだありません</p>
            </div>
            <form class="chat-input-row" @submit.prevent="sendChat">
              <input v-model="chatInput" type="text" class="chat-input" placeholder="メッセージ..." maxlength="200" />
              <button type="submit" class="chat-send" :disabled="!chatInput.trim()">送信</button>
            </form>
          </div>
        </div>
      </template>
    </div>

    <!-- Controls -->
    <div class="controls">
      <div class="ctrl">
        <label>BPM</label>
        <input v-model.number="bpm" type="range" min="60" max="200" class="range" @change="syncSettings" />
        <span class="ctrl-val">{{ bpm }}</span>
      </div>
      <div class="ctrl">
        <label>長さ</label>
        <select v-model.number="totalSteps" class="sel" @change="syncSettings">
          <option :value="4">1小節</option>
          <option :value="8">2小節</option>
          <option :value="16">4小節</option>
          <option :value="32">8小節</option>
          <option :value="64">16小節</option>
        </select>
      </div>
      <div class="ctrl">
        <label>スケール</label>
        <select v-model="selectedScale" class="sel" @change="syncSettings">
          <option value="chromatic">クロマチック</option>
          <option value="major">メジャー</option>
          <option value="minor">マイナー</option>
          <option value="pentatonic">ペンタトニック</option>
          <option value="blues">ブルース</option>
          <option value="dorian">ドリアン</option>
        </select>
      </div>
      <div class="ctrl">
        <label>キー</label>
        <select v-model.number="rootNote" class="sel" @change="syncSettings">
          <option v-for="n in noteNames" :key="n.midi" :value="n.midi">{{ n.name }}</option>
        </select>
      </div>
      <div class="ctrl-btns">
        <button class="play-btn" :class="{ playing }" @click="togglePlay">
          {{ playing ? '⏹ 停止' : '▶ 再生' }}
        </button>
        <button class="clear-btn" @click="clearCurrentTrack">🗑</button>
      </div>
    </div>

    <!-- Track List -->
    <div class="track-list">
      <div
        v-for="track in tracks"
        :key="track.id"
        class="track-item"
        :class="{ active: track.id === activeTrackId, muted: track.muted }"
        :style="{ '--trk-color': track.color }"
        @click="setActiveTrack(track.id)"
      >
        <span class="trk-color-bar" :style="{ background: track.color }"></span>
        <div class="trk-info">
          <span class="trk-name">{{ track.name }}</span>
          <span class="trk-inst">{{ instrumentLabel(track.instrument) }}</span>
        </div>
        <div class="trk-controls" @click.stop>
          <select v-model="track.instrument" class="trk-sel" @change="syncSettings">
            <option value="piano">🎹</option>
            <option value="lead">🎵</option>
            <option value="bass">🎸</option>
            <option value="pad">🎻</option>
            <option value="strings">🎻弦</option>
            <option value="organ">⛪</option>
            <option value="marimba">🥁</option>
            <option value="synth">🎛️</option>
          </select>
          <button class="trk-btn" :class="{ on: track.muted }" title="ミュート" @click="toggleMute(track.id)">M</button>
          <button class="trk-btn" :class="{ on: track.solo }" title="ソロ" @click="toggleSolo(track.id)">S</button>
          <input v-model.number="track.volume" type="range" min="0" max="1" step="0.05" class="vol-range" title="ボリューム" />
          <button v-if="tracks.length > 1" class="trk-del" title="削除" @click="removeTrack(track.id)">✕</button>
        </div>
      </div>
      <button class="add-track-btn" @click="showAddTrack = !showAddTrack">＋ トラック追加</button>
      <div v-if="showAddTrack" class="add-track-menu">
        <button v-for="r in roleOptions" :key="r.role" class="add-role-btn" @click="handleAddTrack(r.role, r.name)">{{ r.icon }} {{ r.name }}</button>
      </div>
    </div>

    <!-- Sequencer Grid -->
    <div class="seq-wrapper">
      <div class="seq">
        <div class="row-labels">
          <div v-for="row in displayRows" :key="row.midi" class="row-label" :class="{ root: row.isRoot }">{{ row.name }}</div>
        </div>
        <div class="grid-scroll">
          <div class="grid">
            <div v-for="row in displayRows" :key="row.midi" class="grid-row">
              <div
                v-for="col in totalSteps"
                :key="col"
                class="cell"
                :class="{
                  active: activeTrack?.grid[row.midi]?.[col - 1],
                  beat: (col - 1) % 4 === 0,
                  playing: playing && currentStep === col - 1,
                  'root-row': row.isRoot,
                  cursor: hasCursorAt(row.midi, col - 1),
                }"
                :style="getCellStyle(row.midi, col - 1)"
                @click="toggleCell(row.midi, col - 1)"
                @mouseenter="onCellHover(row.midi, col - 1)"
                @mouseleave="onCellLeave"
              >
                <span v-if="hasCursorAt(row.midi, col - 1)" class="cursor-dot" :style="{ background: getCursorColor(row.midi, col - 1) }"></span>
              </div>
            </div>
            <div class="step-inds">
              <div v-for="col in totalSteps" :key="col" class="step-ind" :class="{ current: playing && currentStep === col - 1, beat: (col - 1) % 4 === 0 }">
                {{ col }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Presets -->
    <div class="presets">
      <h3 class="presets-title">プリセット</h3>
      <div class="preset-categories">
        <button
          v-for="cat in presetCategories"
          :key="cat.id"
          class="preset-cat-btn"
          :class="{ active: activePresetCat === cat.id }"
          @click="activePresetCat = cat.id"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>
      <div class="presets-grid">
        <button
          v-for="preset in filteredPresets"
          :key="preset.name"
          class="preset-btn"
          @click="loadPreset(preset)"
        >
          <span class="preset-icon">{{ preset.icon }}</span>
          <span class="preset-name">{{ preset.name }}</span>
          <span class="preset-desc">{{ preset.desc }}</span>
          <span class="preset-tags">
            <span v-for="tag in preset.tags" :key="tag" class="preset-tag">{{ tag }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Post Modal -->
    <div v-if="showPostModal" class="modal-overlay" @click.self="showPostModal = false">
      <div class="modal">
        <h3 class="modal-title">作品をコミュニティに投稿</h3>
        <div class="modal-body">
          <input v-model="postTitle" type="text" class="s-input" placeholder="タイトル" maxlength="100" />
          <textarea v-model="postBody" class="s-textarea" placeholder="説明（任意）" rows="3" maxlength="500"></textarea>
          <p v-if="!user" class="modal-note">投稿にはログインが必要です</p>
        </div>
        <div class="modal-actions">
          <button class="s-leave" @click="showPostModal = false">キャンセル</button>
          <NuxtLink v-if="!user" to="/login" class="s-action-btn" style="text-decoration:none;text-align:center">ログイン</NuxtLink>
          <button v-else class="s-action-btn" :disabled="!postTitle.trim()" @click="handlePost">投稿する</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SessionState } from '~/composables/useDtmSession'
import type { Track } from '~/composables/useDtmTracks'

const { playNote } = useAudio()
const { user } = useAuth()
const { addPost: communityAddPost } = useCommunity()
const {
  isInSession, sessionId, currentUser, participants, isHost,
  chatMessages, remoteCursors, unreadChat,
  createSession, joinSession, leaveSession,
  setCallbacks, setChatPanelOpen,
  broadcastGridUpdate, broadcastSettingUpdate, sendSyncResponse,
  broadcastCursor, broadcastChat,
} = useDtmSession()
const {
  tracks, activeTrackId, activeTrack, hasSolo,
  initTracks, addTrack, removeTrack, setActiveTrack,
  toggleMute, toggleSolo, setTrackInstrument,
  clearTrackGrid, clearAllGrids,
  getAudibleTracks, exportTracksData, importTracksData,
} = useDtmTracks()

// Core state
const bpm = ref(120)
const selectedScale = ref('major')
const rootNote = ref(60)
const totalSteps = ref(16)
const playing = ref(false)
const currentStep = ref(-1)

// UI state
const showSessionPanel = ref(false)
const sessionTab = ref<'create' | 'join'>('create')
const sessionUserName = ref('')
const joinCode = ref('')
const copied = ref(false)
const showChat = ref(false)
const chatInput = ref('')
const chatScrollRef = ref<HTMLElement | null>(null)
const showAddTrack = ref(false)
const showPostModal = ref(false)
const postTitle = ref('')
const postBody = ref('')

const noteNames = [
  { midi: 60, name: 'C' }, { midi: 61, name: 'C#' },
  { midi: 62, name: 'D' }, { midi: 63, name: 'D#' },
  { midi: 64, name: 'E' }, { midi: 65, name: 'F' },
  { midi: 66, name: 'F#' }, { midi: 67, name: 'G' },
  { midi: 68, name: 'G#' }, { midi: 69, name: 'A' },
  { midi: 70, name: 'A#' }, { midi: 71, name: 'B' },
]

const scaleIntervals: Record<string, number[]> = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
}

const allNoteLabels = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const roleOptions = [
  { role: 'melody' as const, name: 'メロディ', icon: '🎵' },
  { role: 'chords' as const, name: 'コード', icon: '🎹' },
  { role: 'bass' as const, name: 'ベース', icon: '🎸' },
  { role: 'rhythm' as const, name: 'リズム', icon: '🥁' },
  { role: 'custom' as const, name: 'カスタム', icon: '✨' },
]

const instrumentLabels: Record<string, string> = {
  piano: '🎹', lead: '🎵', bass: '🎸', pad: '🎻',
}

function instrumentLabel(inst: string) { return instrumentLabels[inst] || inst }

const displayRows = computed(() => {
  const intervals = scaleIntervals[selectedScale.value] || scaleIntervals.major
  const rows: { midi: number; name: string; isRoot: boolean }[] = []
  for (let oct = 1; oct >= 0; oct--) {
    for (let i = intervals.length - 1; i >= 0; i--) {
      const midi = rootNote.value + intervals[i] + oct * 12
      if (midi > 96) continue
      const noteIndex = midi % 12
      const octNum = Math.floor(midi / 12) - 1
      rows.push({ midi, name: `${allNoteLabels[noteIndex]}${octNum}`, isRoot: intervals[i] === 0 })
    }
  }
  return rows
})

// Grid operations
function toggleCell(midi: number, step: number) {
  const track = activeTrack.value
  if (!track) return
  if (!track.grid[midi]) track.grid[midi] = {}
  const wasActive = !!track.grid[midi][step]
  track.grid[midi][step] = wasActive ? false : (isInSession.value && currentUser.value ? currentUser.value.id : true)
  if (!wasActive) playNote(midi, 0.2, track.instrument, track.volume)
  if (isInSession.value) broadcastGridUpdate(track.id, midi, step, !wasActive)
}

function clearCurrentTrack() {
  if (activeTrack.value) {
    clearTrackGrid(activeTrack.value.id)
    if (isInSession.value) syncSettings()
  }
}

// Cursor sharing
function hasCursorAt(midi: number, step: number): boolean {
  for (const c of Object.values(remoteCursors.value)) {
    if (c.trackId === activeTrackId.value && c.midi === midi && c.step === step) return true
  }
  return false
}

function getCursorColor(midi: number, step: number): string {
  for (const c of Object.values(remoteCursors.value)) {
    if (c.trackId === activeTrackId.value && c.midi === midi && c.step === step) return c.color
  }
  return '#888'
}

function getCellStyle(midi: number, step: number) {
  if (!isInSession.value) return {}
  const track = activeTrack.value
  if (!track) return {}
  const val = track.grid[midi]?.[step]
  if (val && typeof val === 'string' && val !== currentUser.value?.id) {
    const p = participants.value.find((u) => u.id === val)
    if (p) return { '--cell-color': p.color }
  }
  return {}
}

function onCellHover(midi: number, step: number) {
  if (isInSession.value) broadcastCursor(activeTrackId.value, midi, step)
}

function onCellLeave() {
  if (isInSession.value) broadcastCursor(activeTrackId.value, null, null)
}

// Playback
let playInterval: ReturnType<typeof setInterval> | null = null

function togglePlay() {
  playing.value ? stopPlay() : startPlay()
}

function startPlay() {
  playing.value = true
  currentStep.value = -1
  const stepMs = (60 / bpm.value) * 1000 / 4
  playInterval = setInterval(() => {
    currentStep.value = (currentStep.value + 1) % totalSteps.value
    for (const track of getAudibleTracks()) {
      for (const midiStr of Object.keys(track.grid)) {
        const midi = Number(midiStr)
        if (track.grid[midi]?.[currentStep.value]) {
          playNote(midi, stepMs / 1000 * 0.8, track.instrument, track.volume)
        }
      }
    }
  }, stepMs)
}

function stopPlay() {
  playing.value = false
  currentStep.value = -1
  if (playInterval) { clearInterval(playInterval); playInterval = null }
}

// Track management
function handleAddTrack(role: Track['role'], name: string) {
  addTrack(role, name)
  showAddTrack.value = false
  if (isInSession.value) syncSettings()
}

// Session
function handleCreateSession() {
  if (!sessionUserName.value.trim()) return
  createSession(sessionUserName.value.trim())
  setupSessionCallbacks()
  if (import.meta.client) window.addEventListener('dtm-sync-request', handleSyncRequest as EventListener)
}

function handleJoinSession() {
  if (!sessionUserName.value.trim() || joinCode.value.length < 4) return
  if (joinSession(joinCode.value, sessionUserName.value.trim())) setupSessionCallbacks()
}

function handleLeaveSession() {
  if (import.meta.client) window.removeEventListener('dtm-sync-request', handleSyncRequest as EventListener)
  leaveSession()
  showSessionPanel.value = false
  showChat.value = false
}

function handleSyncRequest() {
  sendSyncResponse({
    tracks: JSON.parse(JSON.stringify(tracks.value)),
    bpm: bpm.value,
    scale: selectedScale.value,
    rootNote: rootNote.value,
    totalSteps: totalSteps.value,
  })
}

function setupSessionCallbacks() {
  setCallbacks({
    onGridUpdate: (trackId: string, midi: number, step: number, active: boolean, userId: string) => {
      const track = tracks.value.find((t) => t.id === trackId)
      if (!track) return
      if (!track.grid[midi]) track.grid[midi] = {}
      track.grid[midi][step] = active ? userId : false
      if (active) playNote(midi, 0.2, track.instrument, track.volume)
    },
    onSettingUpdate: (settings: Partial<SessionState>) => {
      if (settings.bpm !== undefined) bpm.value = settings.bpm
      if (settings.scale !== undefined) selectedScale.value = settings.scale
      if (settings.rootNote !== undefined) rootNote.value = settings.rootNote
      if (settings.totalSteps !== undefined) totalSteps.value = settings.totalSteps
      if (settings.tracks !== undefined) importTracksData(settings.tracks)
    },
    onFullSync: (state: SessionState) => {
      bpm.value = state.bpm
      selectedScale.value = state.scale
      rootNote.value = state.rootNote
      totalSteps.value = state.totalSteps
      if (state.tracks) importTracksData(state.tracks)
    },
  })
}

function syncSettings() {
  if (!isInSession.value) return
  broadcastSettingUpdate({
    tracks: JSON.parse(JSON.stringify(tracks.value)),
    bpm: bpm.value,
    scale: selectedScale.value,
    rootNote: rootNote.value,
    totalSteps: totalSteps.value,
  })
}

async function copyCode() {
  if (!import.meta.client) return
  try { await navigator.clipboard.writeText(sessionId.value); copied.value = true; setTimeout(() => { copied.value = false }, 2000) } catch { /* */ }
}

// Chat
function sendChat() {
  if (!chatInput.value.trim()) return
  broadcastChat(chatInput.value)
  chatInput.value = ''
  nextTick(() => { chatScrollRef.value?.scrollTo({ top: chatScrollRef.value.scrollHeight, behavior: 'smooth' }) })
}

function onOpenChat() {
  setChatPanelOpen(true)
  nextTick(() => { chatScrollRef.value?.scrollTo({ top: chatScrollRef.value.scrollHeight }) })
}

watch(showChat, (v) => { if (!v) setChatPanelOpen(false) })

// Post to community
const router = useRouter()

function handlePost() {
  if (!user.value || !postTitle.value.trim()) return
  communityAddPost({
    author: user.value.name,
    title: postTitle.value.trim(),
    body: postBody.value.trim() || `BPM: ${bpm.value} / スケール: ${selectedScale.value} / ${totalSteps.value}ステップ / ${tracks.value.length}トラック`,
    category: 'showcase',
    songData: {
      tracks: exportTracksData(),
      bpm: bpm.value,
      scale: selectedScale.value,
      rootNote: rootNote.value,
      totalSteps: totalSteps.value,
    },
  })
  showPostModal.value = false
  postTitle.value = ''
  postBody.value = ''
  router.push('/community')
}

// Load song from community (via useState)
const loadSong = useState<any>('dtm-load-song', () => null)

function loadSongFromState() {
  if (!loadSong.value) return
  const data = loadSong.value
  loadSong.value = null
  if (data.tracks) importTracksData(data.tracks)
  if (data.bpm) bpm.value = data.bpm
  if (data.scale) selectedScale.value = data.scale
  if (data.rootNote) rootNote.value = data.rootNote
  if (data.totalSteps) totalSteps.value = data.totalSteps
}

// Presets
interface Preset {
  name: string; icon: string; desc: string; category: string; tags: string[]
  scale: string; root: number; bpm: number; steps?: number; trackNotes: Record<string, [number, number][]>
}

const presetCategories = [
  { id: 'all', icon: '🎵', name: 'すべて' },
  { id: 'pop', icon: '🎹', name: 'ポップ' },
  { id: 'rock', icon: '🤘', name: 'ロック' },
  { id: 'jazz', icon: '🎷', name: 'ジャズ' },
  { id: 'edm', icon: '🎧', name: 'EDM' },
  { id: 'jpop', icon: '🇯🇵', name: 'J-POP' },
  { id: 'classical', icon: '🎻', name: 'クラシカル' },
]

const activePresetCat = ref('all')

const filteredPresets = computed(() => {
  if (activePresetCat.value === 'all') return presets
  return presets.filter((p) => p.category === activePresetCat.value)
})

const presets: Preset[] = [
  // ===== ポップ =====
  {
    name: 'ポップ基本',
    icon: '🎹', desc: 'I-IV-V-I メロディ+コード+ベース', category: 'pop', tags: ['メロ', 'コード', 'ベース'],
    scale: 'major', root: 60, bpm: 120,
    trackNotes: {
      melody: [[72,0],[74,2],[76,4],[77,6],[76,8],[74,10],[72,12],[74,14]],
      chords: [[60,0],[64,0],[67,0],[65,4],[69,4],[72,4],[67,8],[71,8],[74,8],[60,12],[64,12],[67,12]],
      bass: [[48,0],[48,4],[53,4],[53,8],[55,8],[55,12],[48,12]],
      rhythm: [[36,0],[42,1],[38,2],[42,3],[36,4],[42,5],[38,6],[42,7],[36,8],[42,9],[38,10],[42,11],[36,12],[42,13],[38,14],[42,15]],
    },
  },
  {
    name: '4コード進行',
    icon: '🎤', desc: 'I-V-vi-IV 王道洋楽ポップ', category: 'pop', tags: ['メロ', 'コード', 'ベース', 'リズム'],
    scale: 'major', root: 60, bpm: 110, steps: 32,
    trackNotes: {
      melody: [[72,0],[72,2],[74,4],[76,6],[79,8],[76,10],[74,12],[72,14],[71,16],[72,18],[74,20],[72,22],[69,24],[67,26],[69,28],[72,30]],
      chords: [[60,0],[64,0],[67,0],[55,8],[59,8],[62,8],[57,16],[60,16],[64,16],[53,24],[57,24],[60,24]],
      bass: [[48,0],[48,4],[43,8],[43,12],[45,16],[45,20],[41,24],[41,28]],
      rhythm: Array.from({ length: 32 }, (_, i) => i % 4 === 0 ? [36, i] : i % 4 === 2 ? [38, i] : [42, i]) as [number, number][],
    },
  },
  {
    name: 'バラード',
    icon: '💕', desc: 'ゆったり I-vi-IV-V', category: 'pop', tags: ['メロ', 'コード', 'ベース'],
    scale: 'major', root: 60, bpm: 72, steps: 32,
    trackNotes: {
      melody: [[72,0],[74,4],[76,8],[79,12],[76,16],[74,20],[72,24],[74,28]],
      chords: [[60,0],[64,0],[67,0],[57,8],[60,8],[64,8],[53,16],[57,16],[60,16],[55,24],[59,24],[62,24]],
      bass: [[48,0],[48,4],[45,8],[45,12],[41,16],[41,20],[43,24],[43,28]],
    },
  },
  // ===== ロック =====
  {
    name: 'ロックリフ',
    icon: '🤘', desc: 'ペンタトニック + パワーコード', category: 'rock', tags: ['メロ', 'ベース', 'リズム'],
    scale: 'pentatonic', root: 69, bpm: 130,
    trackNotes: {
      melody: [[69,0],[72,1],[69,2],[74,4],[76,5],[74,6],[72,8],[69,9],[67,10],[69,12],[72,14],[69,15]],
      bass: [[45,0],[45,2],[45,4],[43,8],[43,10],[43,12],[45,14]],
      rhythm: [[36,0],[42,1],[38,2],[42,3],[36,4],[36,5],[38,6],[42,7],[36,8],[42,9],[38,10],[42,11],[36,12],[42,13],[38,14],[36,15]],
    },
  },
  {
    name: 'パワーコードリフ',
    icon: '🔥', desc: 'オクターブ+5度のヘヴィリフ', category: 'rock', tags: ['コード', 'ベース', 'リズム'],
    scale: 'minor', root: 64, bpm: 140,
    trackNotes: {
      chords: [[64,0],[71,0],[76,0],[64,2],[71,2],[62,4],[69,4],[74,4],[62,6],[69,6],[60,8],[67,8],[72,8],[60,10],[67,10],[64,12],[71,12],[76,12],[64,14],[71,14]],
      bass: [[40,0],[40,2],[38,4],[38,6],[36,8],[36,10],[40,12],[40,14]],
      rhythm: [[36,0],[38,2],[36,4],[38,6],[36,8],[36,9],[38,10],[36,12],[38,14],[36,15]],
    },
  },
  {
    name: 'シャッフルロック',
    icon: '🎸', desc: 'ブルース寄りの跳ねるリフ', category: 'rock', tags: ['メロ', 'ベース', 'リズム'],
    scale: 'blues', root: 60, bpm: 120,
    trackNotes: {
      melody: [[60,0],[63,2],[65,3],[66,4],[67,5],[63,7],[60,8],[67,10],[66,11],[65,12],[63,13],[60,15]],
      bass: [[36,0],[36,4],[41,8],[36,12]],
      rhythm: [[36,0],[42,2],[38,4],[42,6],[36,8],[42,10],[38,12],[42,14]],
    },
  },
  // ===== ジャズ =====
  {
    name: 'II-V-I ジャズ',
    icon: '🎷', desc: 'Dm7-G7-CMaj7 スウィング', category: 'jazz', tags: ['メロ', 'コード', 'ベース'],
    scale: 'major', root: 60, bpm: 140, steps: 32,
    trackNotes: {
      melody: [[74,0],[76,2],[77,4],[79,6],[77,8],[74,10],[72,12],[71,14],[72,16],[74,18],[76,20],[79,22],[84,24],[81,26],[79,28],[77,30]],
      chords: [[62,0],[65,0],[69,0],[72,0],[62,8],[65,8],[69,8],[55,16],[59,16],[62,16],[65,16],[60,24],[64,24],[67,24],[71,24]],
      bass: [[50,0],[52,2],[53,4],[55,6],[55,8],[57,10],[55,12],[53,14],[48,16],[50,18],[52,20],[53,22],[48,24],[52,26],[55,28],[48,30]],
    },
  },
  {
    name: 'ボサノバ',
    icon: '🏖️', desc: 'ボサノバ風コード+メロディ', category: 'jazz', tags: ['メロ', 'コード', 'ベース'],
    scale: 'major', root: 60, bpm: 130,
    trackNotes: {
      melody: [[72,0],[71,2],[72,4],[74,6],[76,8],[74,10],[72,12],[71,14]],
      chords: [[60,0],[64,0],[67,0],[71,0],[62,4],[65,4],[69,4],[72,4],[65,8],[69,8],[72,8],[76,8],[55,12],[59,12],[62,12],[65,12]],
      bass: [[48,0],[48,4],[53,8],[43,12]],
    },
  },
  {
    name: 'モーダルジャズ',
    icon: '🌙', desc: 'ドリアンモードの浮遊感', category: 'jazz', tags: ['コード', 'ベース'],
    scale: 'dorian', root: 62, bpm: 85,
    trackNotes: {
      chords: [[62,0],[65,0],[69,0],[64,4],[67,4],[72,4],[65,8],[69,8],[74,8],[62,12],[67,12],[71,12]],
      bass: [[50,0],[50,4],[52,8],[50,12]],
    },
  },
  // ===== EDM =====
  {
    name: 'EDMドロップ',
    icon: '🎧', desc: 'エネルギッシュなドロップ', category: 'edm', tags: ['メロ', 'コード', 'ベース', 'リズム'],
    scale: 'minor', root: 69, bpm: 128, steps: 32,
    trackNotes: {
      melody: [[81,0],[81,4],[84,8],[81,12],[79,16],[81,20],[84,24],[86,28]],
      chords: [[69,0],[72,0],[76,0],[67,8],[72,8],[76,8],[65,16],[69,16],[72,16],[64,24],[67,24],[72,24]],
      bass: [[45,0],[45,2],[45,4],[45,6],[43,8],[43,10],[43,12],[43,14],[41,16],[41,18],[41,20],[41,22],[40,24],[40,26],[40,28],[40,30]],
      rhythm: Array.from({ length: 32 }, (_, i) => [i % 2 === 0 ? 36 : 42, i]) as [number, number][],
    },
  },
  {
    name: 'トランスアルペジオ',
    icon: '✨', desc: '高速アルペジオ + 4つ打ち', category: 'edm', tags: ['メロ', 'ベース', 'リズム'],
    scale: 'minor', root: 69, bpm: 138,
    trackNotes: {
      melody: [[69,0],[72,1],[76,2],[81,3],[76,4],[72,5],[69,6],[72,7],[67,8],[72,9],[76,10],[79,11],[76,12],[72,13],[67,14],[72,15]],
      bass: [[45,0],[45,4],[43,8],[43,12]],
      rhythm: [[36,0],[36,4],[36,8],[36,12],[42,2],[42,6],[42,10],[42,14]],
    },
  },
  {
    name: 'ローファイビート',
    icon: '🌃', desc: 'チルなローファイ風ビート', category: 'edm', tags: ['コード', 'ベース', 'リズム'],
    scale: 'dorian', root: 62, bpm: 78,
    trackNotes: {
      chords: [[62,0],[65,0],[69,0],[71,0],[64,4],[67,4],[72,4],[74,4],[60,8],[65,8],[69,8],[72,8],[62,12],[67,12],[71,12],[74,12]],
      bass: [[50,0],[50,4],[48,8],[50,12]],
      rhythm: [[36,0],[42,3],[38,4],[42,7],[36,8],[42,10],[38,12],[42,15]],
    },
  },
  // ===== J-POP =====
  {
    name: 'カノン進行',
    icon: '🇯🇵', desc: 'I-V-vi-iii-IV-I-IV-V', category: 'jpop', tags: ['メロ', 'コード', 'ベース', 'リズム'],
    scale: 'major', root: 60, bpm: 125, steps: 32,
    trackNotes: {
      melody: [[72,0],[74,2],[76,4],[74,6],[72,8],[71,10],[69,12],[67,14],[65,16],[67,18],[69,20],[72,22],[74,24],[76,26],[79,28],[76,30]],
      chords: [[60,0],[64,0],[67,0],[55,4],[59,4],[62,4],[57,8],[60,8],[64,8],[52,12],[55,12],[59,12],[53,16],[57,16],[60,16],[48,20],[52,20],[55,20],[53,24],[57,24],[60,24],[55,28],[59,28],[62,28]],
      bass: [[48,0],[48,2],[43,4],[43,6],[45,8],[45,10],[40,12],[40,14],[41,16],[41,18],[36,20],[36,22],[41,24],[41,26],[43,28],[43,30]],
      rhythm: Array.from({ length: 32 }, (_, i) => i % 4 === 0 ? [36, i] : i % 4 === 2 ? [38, i] : [42, i]) as [number, number][],
    },
  },
  {
    name: '王道進行',
    icon: '👑', desc: 'IV-V-iii-vi 切ないJ-POP', category: 'jpop', tags: ['メロ', 'コード', 'ベース', 'リズム'],
    scale: 'major', root: 60, bpm: 130,
    trackNotes: {
      melody: [[77,0],[76,2],[74,4],[76,6],[72,8],[71,10],[69,12],[72,14]],
      chords: [[65,0],[69,0],[72,0],[67,4],[71,4],[74,4],[64,8],[67,8],[71,8],[69,12],[72,12],[76,12]],
      bass: [[53,0],[53,2],[55,4],[55,6],[52,8],[52,10],[57,12],[57,14]],
      rhythm: [[36,0],[42,1],[38,2],[42,3],[36,4],[42,5],[38,6],[42,7],[36,8],[42,9],[38,10],[42,11],[36,12],[42,13],[38,14],[42,15]],
    },
  },
  {
    name: '小室進行',
    icon: '💿', desc: '♭VI-♭VII-V-I 90年代感', category: 'jpop', tags: ['メロ', 'コード', 'ベース', 'リズム'],
    scale: 'minor', root: 69, bpm: 140,
    trackNotes: {
      melody: [[81,0],[81,2],[84,4],[81,6],[79,8],[81,10],[84,12],[86,14]],
      chords: [[65,0],[69,0],[72,0],[67,4],[71,4],[74,4],[64,8],[68,8],[71,8],[69,12],[72,12],[76,12]],
      bass: [[41,0],[41,2],[43,4],[43,6],[40,8],[40,10],[45,12],[45,14]],
      rhythm: [[36,0],[42,1],[38,2],[42,3],[36,4],[42,5],[38,6],[42,7],[36,8],[42,9],[38,10],[42,11],[36,12],[42,13],[38,14],[42,15]],
    },
  },
  {
    name: '丸サ進行',
    icon: '🌃', desc: 'IVM7-V7-IIIm7-VIm おしゃれ系', category: 'jpop', tags: ['メロ', 'コード', 'ベース'],
    scale: 'major', root: 60, bpm: 105,
    trackNotes: {
      melody: [[77,0],[76,2],[74,4],[76,6],[72,8],[74,10],[71,12],[72,14]],
      chords: [[65,0],[69,0],[72,0],[76,0],[67,4],[71,4],[74,4],[77,4],[64,8],[67,8],[71,8],[74,8],[69,12],[72,12],[76,12],[81,12]],
      bass: [[53,0],[53,2],[55,4],[55,6],[52,8],[52,10],[57,12],[57,14]],
    },
  },
  // ===== クラシカル =====
  {
    name: 'バロック風',
    icon: '🎻', desc: '対位法的な2声', category: 'classical', tags: ['メロ', 'ベース'],
    scale: 'major', root: 60, bpm: 100,
    trackNotes: {
      melody: [[72,0],[74,1],[76,2],[77,3],[79,4],[77,5],[76,6],[74,7],[72,8],[74,9],[76,10],[79,11],[84,12],[81,13],[79,14],[77,15]],
      bass: [[48,0],[50,2],[52,4],[53,6],[55,8],[53,10],[52,12],[48,14]],
    },
  },
  {
    name: 'ワルツ',
    icon: '💃', desc: '3/4拍子のクラシカルワルツ', category: 'classical', tags: ['メロ', 'コード', 'ベース'],
    scale: 'major', root: 60, bpm: 180, steps: 24,
    trackNotes: {
      melody: [[72,0],[76,3],[79,6],[76,9],[72,12],[74,15],[76,18],[74,21]],
      chords: [[64,1],[67,2],[64,4],[67,5],[65,7],[69,8],[65,10],[69,11],[62,13],[67,14],[62,16],[67,17],[64,19],[67,20],[64,22],[67,23]],
      bass: [[48,0],[55,3],[48,6],[55,9],[53,12],[55,15],[43,18],[55,21]],
    },
  },
  {
    name: 'ハーモニックマイナー',
    icon: '🏰', desc: 'エキゾチックなマイナー旋律', category: 'classical', tags: ['メロ', 'コード', 'ベース'],
    scale: 'minor', root: 69, bpm: 110,
    trackNotes: {
      melody: [[69,0],[71,1],[72,2],[74,3],[76,4],[77,5],[80,6],[81,7],[80,8],[77,9],[76,10],[74,11],[72,12],[71,13],[69,14],[69,15]],
      chords: [[69,0],[72,0],[76,0],[65,4],[68,4],[72,4],[64,8],[68,8],[71,8],[69,12],[72,12],[76,12]],
      bass: [[45,0],[45,4],[41,8],[45,12]],
    },
  },
]

function loadPreset(preset: Preset) {
  stopPlay()
  clearAllGrids()
  selectedScale.value = preset.scale
  rootNote.value = preset.root
  bpm.value = preset.bpm
  totalSteps.value = preset.steps || 16

  for (const [role, notes] of Object.entries(preset.trackNotes)) {
    const track = tracks.value.find((t) => t.role === role)
    if (track) {
      track.grid = {}
      for (const [midi, step] of notes) {
        if (!track.grid[midi]) track.grid[midi] = {}
        track.grid[midi][step] = true
      }
    }
  }
  if (isInSession.value) syncSettings()
}

// Init
onMounted(() => {
  initTracks()
  loadSongFromState()
})

onUnmounted(() => {
  if (playInterval) clearInterval(playInterval)
  if (isInSession.value) leaveSession()
  if (import.meta.client) window.removeEventListener('dtm-sync-request', handleSyncRequest as EventListener)
})

useHead({ title: 'DTM ステップシーケンサー - 音楽理論辞典' })
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.page-title { font-size: 28px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; }
.page-desc { color: var(--text-muted); font-size: 13px; }
.header-actions { display: flex; gap: 8px; }
.header-btn { padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.session-btn { background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); }
.session-btn:hover { border-color: var(--accent); color: var(--accent); }
.post-btn { background: var(--accent); border: none; color: #fff; }
.post-btn:hover { opacity: 0.9; }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

/* Session Panel */
.session-panel { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.session-tabs { display: flex; gap: 4px; margin-bottom: 12px; background: var(--bg-primary); border-radius: 8px; padding: 3px; }
.s-tab { flex: 1; padding: 8px; background: transparent; border: none; border-radius: 6px; color: var(--text-muted); font-size: 13px; font-weight: 600; cursor: pointer; }
.s-tab.active { background: var(--accent); color: #fff; }
.session-form { display: flex; flex-direction: column; gap: 10px; }
.s-input { padding: 10px 14px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 14px; outline: none; }
.s-input:focus { border-color: var(--accent); }
.code-input { font-family: monospace; font-size: 18px; font-weight: 700; letter-spacing: 4px; text-align: center; text-transform: uppercase; }
.s-action-btn { padding: 10px 20px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
.s-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.s-note { font-size: 11px; color: var(--text-dimmed); text-align: center; }
.s-textarea { padding: 10px 14px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 14px; outline: none; resize: vertical; font-family: inherit; }

.session-active { display: flex; flex-direction: column; gap: 12px; }
.session-top-row { display: flex; justify-content: space-between; align-items: center; }
.s-code-label { font-size: 10px; color: var(--text-dimmed); text-transform: uppercase; display: block; }
.s-code { font-family: monospace; font-size: 24px; font-weight: 800; color: var(--accent); letter-spacing: 4px; cursor: pointer; }
.s-code small { font-size: 11px; color: var(--text-dimmed); letter-spacing: 0; }
.s-leave { padding: 6px 14px; background: transparent; border: 1px solid #ef4444; border-radius: 6px; color: #ef4444; font-size: 12px; font-weight: 600; cursor: pointer; }
.participants-row { display: flex; flex-wrap: wrap; gap: 6px; }
.p-chip { display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--bg-primary); border: 2px solid; border-radius: 16px; font-size: 12px; font-weight: 600; color: var(--text-primary); }
.p-dot { width: 6px; height: 6px; border-radius: 50%; }
.p-chip small { color: var(--text-dimmed); font-weight: 400; }

/* Chat */
.chat-section { margin-top: 12px; border-top: 1px solid var(--border-color); padding-top: 12px; }
.chat-toggle { background: none; border: none; color: var(--text-muted); font-size: 13px; font-weight: 600; cursor: pointer; position: relative; }
.chat-badge { position: absolute; top: -6px; right: -12px; background: #ef4444; color: #fff; font-size: 10px; min-width: 16px; height: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.chat-body { margin-top: 10px; }
.chat-messages { max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; padding: 8px; background: var(--bg-primary); border-radius: 8px; }
.chat-msg { font-size: 13px; line-height: 1.4; }
.chat-msg.own .chat-author { font-weight: 700; }
.chat-author { font-weight: 600; margin-right: 6px; }
.chat-text { color: var(--text-secondary); }
.chat-empty { color: var(--text-dimmed); font-size: 12px; text-align: center; padding: 16px 0; }
.chat-input-row { display: flex; gap: 6px; }
.chat-input { flex: 1; padding: 8px 12px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 13px; outline: none; }
.chat-input:focus { border-color: var(--accent); }
.chat-send { padding: 8px 16px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
.chat-send:disabled { opacity: 0.5; }

/* Controls */
.controls { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; padding: 12px 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 10px; }
.ctrl { display: flex; flex-direction: column; gap: 3px; }
.ctrl label { font-size: 10px; font-weight: 600; color: var(--text-dimmed); text-transform: uppercase; letter-spacing: 0.5px; }
.ctrl-val { font-size: 13px; font-weight: 700; color: var(--accent); text-align: center; min-width: 32px; }
.range { width: 90px; accent-color: var(--accent); }
.sel { padding: 6px 10px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); font-size: 12px; outline: none; cursor: pointer; }
.ctrl-btns { display: flex; gap: 6px; margin-left: auto; }
.play-btn { padding: 8px 20px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
.play-btn.playing { background: #e74c3c; }
.clear-btn { padding: 8px 12px; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); font-size: 13px; cursor: pointer; }
.clear-btn:hover { border-color: #e74c3c; color: #e74c3c; }

/* Track List */
.track-list { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; align-items: center; }
.track-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; transition: all 0.15s; min-width: 0; }
.track-item.active { border-color: var(--trk-color); box-shadow: 0 0 0 1px var(--trk-color); }
.track-item.muted { opacity: 0.5; }
.trk-color-bar { width: 3px; height: 24px; border-radius: 2px; flex-shrink: 0; }
.trk-info { display: flex; flex-direction: column; min-width: 0; }
.trk-name { font-size: 12px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.trk-inst { font-size: 10px; color: var(--text-dimmed); }
.trk-controls { display: flex; align-items: center; gap: 4px; }
.trk-sel { padding: 2px 4px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; color: var(--text-primary); cursor: pointer; }
.trk-btn { width: 20px; height: 20px; border-radius: 4px; font-size: 10px; font-weight: 700; border: 1px solid var(--border-color); background: transparent; color: var(--text-dimmed); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.trk-btn.on { background: var(--accent); border-color: var(--accent); color: #fff; }
.vol-range { width: 50px; accent-color: var(--accent); height: 14px; }
.trk-del { background: none; border: none; color: var(--text-dimmed); cursor: pointer; font-size: 12px; padding: 2px; }
.trk-del:hover { color: #ef4444; }
.add-track-btn { padding: 6px 14px; background: transparent; border: 1px dashed var(--border-color); border-radius: 8px; color: var(--text-muted); font-size: 12px; font-weight: 600; cursor: pointer; }
.add-track-btn:hover { border-color: var(--accent); color: var(--accent); }
.add-track-menu { display: flex; gap: 4px; flex-wrap: wrap; }
.add-role-btn { padding: 4px 10px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; font-size: 12px; cursor: pointer; color: var(--text-primary); }
.add-role-btn:hover { border-color: var(--accent); }

/* Sequencer */
.seq-wrapper { margin-bottom: 24px; overflow: hidden; border: 1px solid var(--border-color); border-radius: 10px; background: var(--bg-secondary); }
.seq { display: flex; overflow-x: auto; }
.row-labels { display: flex; flex-direction: column; flex-shrink: 0; border-right: 1px solid var(--border-color); }
.row-label { height: 26px; display: flex; align-items: center; padding: 0 8px; font-size: 10px; font-weight: 500; color: var(--text-dimmed); border-bottom: 1px solid var(--border-color); min-width: 44px; }
.row-label.root { color: var(--accent); font-weight: 700; }
.grid-scroll { overflow-x: auto; flex: 1; }
.grid { display: flex; flex-direction: column; min-width: fit-content; }
.grid-row { display: flex; height: 26px; border-bottom: 1px solid var(--border-color); }
.cell { width: 32px; height: 26px; border-right: 1px solid var(--border-color); cursor: pointer; transition: background 0.1s; flex-shrink: 0; position: relative; }
.cell:hover { background: var(--hover-bg); }
.cell.beat { border-right: 2px solid var(--border-color); }
.cell.active { background: var(--cell-color, var(--accent)); border-radius: 2px; margin: 2px 1px; box-shadow: 0 0 4px var(--accent-glow); }
.cell.playing { background: var(--hover-bg); }
.cell.active.playing { background: var(--cell-color, var(--accent-light)); box-shadow: 0 0 10px var(--accent-glow); transform: scale(1.05); }
.cell.root-row { background: rgba(108, 76, 224, 0.03); }
.cell.cursor { outline: 2px solid; outline-offset: -2px; }
.cursor-dot { position: absolute; top: 1px; right: 1px; width: 5px; height: 5px; border-radius: 50%; }
.step-inds { display: flex; height: 18px; }
.step-ind { width: 32px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: var(--text-dimmed); flex-shrink: 0; }
.step-ind.current { color: var(--accent); font-weight: 700; }
.step-ind.beat { font-weight: 600; color: var(--text-muted); }

/* Presets */
.presets { margin-top: 8px; }
.presets-title { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
.preset-categories { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.preset-cat-btn { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-muted); white-space: nowrap; }
.preset-cat-btn:hover { border-color: var(--accent); color: var(--accent); }
.preset-cat-btn.active { background: var(--accent); border-color: var(--accent); color: white; }
.presets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
.preset-btn { display: flex; flex-direction: column; align-items: flex-start; padding: 14px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 10px; cursor: pointer; transition: all 0.2s; text-align: left; }
.preset-btn:hover { border-color: var(--accent); transform: translateY(-1px); }
.preset-icon { font-size: 20px; margin-bottom: 4px; }
.preset-name { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; }
.preset-desc { font-size: 11px; color: var(--text-muted); margin-bottom: 6px; }
.preset-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.preset-tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: var(--accent-bg, rgba(99,102,241,0.1)); color: var(--accent-light, #818cf8); font-weight: 500; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 14px; padding: 24px; width: 100%; max-width: 440px; margin: 16px; }
.modal-title { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }
.modal-body { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.modal-note { font-size: 13px; color: var(--text-muted); }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; }

@media (max-width: 768px) {
  .page-header { flex-direction: column; gap: 10px; }
  .header-actions { width: 100%; }
  .controls { flex-direction: column; align-items: stretch; }
  .ctrl-btns { margin-left: 0; justify-content: center; }
  .cell { width: 24px; }
  .step-ind { width: 24px; }
  .track-list { flex-direction: column; }
  .track-item { width: 100%; }
}
</style>
