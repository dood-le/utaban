export interface Track {
  id: string
  name: string
  role: 'melody' | 'chords' | 'bass' | 'rhythm' | 'custom'
  instrument: string
  grid: Record<number, Record<number, string | boolean>>
  muted: boolean
  solo: boolean
  volume: number // 0-1
  color: string
}

const TRACK_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316']

const ROLE_DEFAULTS: Record<string, { name: string; instrument: string; color: string }> = {
  melody: { name: 'メロディ', instrument: 'lead', color: '#6366f1' },
  chords: { name: 'コード', instrument: 'pad', color: '#10b981' },
  bass: { name: 'ベース', instrument: 'bass', color: '#f59e0b' },
  rhythm: { name: 'リズム', instrument: 'piano', color: '#ef4444' },
  custom: { name: 'カスタム', instrument: 'piano', color: '#8b5cf6' },
}

function generateTrackId() {
  return 'trk_' + Math.random().toString(36).substring(2, 8)
}

export function useDtmTracks() {
  const tracks = useState<Track[]>('dtm-tracks', () => createDefaultTracks())
  const activeTrackId = useState<string>('dtm-active-track', () => '')

  const activeTrack = computed(() => {
    return tracks.value.find((t) => t.id === activeTrackId.value) || tracks.value[0]
  })

  const hasSolo = computed(() => tracks.value.some((t) => t.solo))

  function createDefaultTracks(): Track[] {
    const defaults: Track[] = [
      createTrack('melody', 'メロディ'),
      createTrack('chords', 'コード'),
      createTrack('bass', 'ベース'),
      createTrack('rhythm', 'リズム'),
    ]
    return defaults
  }

  function createTrack(role: Track['role'] = 'custom', customName?: string): Track {
    const defaults = ROLE_DEFAULTS[role] || ROLE_DEFAULTS.custom
    return {
      id: generateTrackId(),
      name: customName || defaults.name,
      role,
      instrument: defaults.instrument,
      grid: {},
      muted: false,
      solo: false,
      volume: 0.8,
      color: defaults.color,
    }
  }

  function initTracks() {
    if (tracks.value.length === 0) {
      tracks.value = createDefaultTracks()
    }
    if (!activeTrackId.value || !tracks.value.find((t) => t.id === activeTrackId.value)) {
      activeTrackId.value = tracks.value[0]?.id || ''
    }
  }

  function addTrack(role: Track['role'] = 'custom', name?: string): Track {
    const track = createTrack(role, name)
    track.color = TRACK_COLORS[tracks.value.length % TRACK_COLORS.length]
    tracks.value = [...tracks.value, track]
    return track
  }

  function removeTrack(id: string) {
    if (tracks.value.length <= 1) return
    tracks.value = tracks.value.filter((t) => t.id !== id)
    if (activeTrackId.value === id) {
      activeTrackId.value = tracks.value[0]?.id || ''
    }
  }

  function setActiveTrack(id: string) {
    activeTrackId.value = id
  }

  function toggleMute(id: string) {
    const track = tracks.value.find((t) => t.id === id)
    if (track) track.muted = !track.muted
  }

  function toggleSolo(id: string) {
    const track = tracks.value.find((t) => t.id === id)
    if (track) track.solo = !track.solo
  }

  function setTrackVolume(id: string, volume: number) {
    const track = tracks.value.find((t) => t.id === id)
    if (track) track.volume = Math.max(0, Math.min(1, volume))
  }

  function setTrackInstrument(id: string, instrument: string) {
    const track = tracks.value.find((t) => t.id === id)
    if (track) track.instrument = instrument
  }

  function clearTrackGrid(id: string) {
    const track = tracks.value.find((t) => t.id === id)
    if (track) track.grid = {}
  }

  function clearAllGrids() {
    for (const track of tracks.value) {
      track.grid = {}
    }
  }

  function isTrackAudible(track: Track): boolean {
    if (track.muted) return false
    if (hasSolo.value && !track.solo) return false
    return true
  }

  function getAudibleTracks(): Track[] {
    return tracks.value.filter(isTrackAudible)
  }

  function exportTracksData(): Track[] {
    return JSON.parse(JSON.stringify(tracks.value.map((t) => ({
      ...t,
      // Normalize grid to boolean for export
      grid: Object.fromEntries(
        Object.entries(t.grid).map(([midi, steps]) => [
          midi,
          Object.fromEntries(Object.entries(steps).map(([step, val]) => [step, !!val])),
        ])
      ),
    }))))
  }

  function importTracksData(data: Track[]) {
    tracks.value = data.map((t, i) => ({
      ...t,
      id: t.id || generateTrackId(),
      color: t.color || TRACK_COLORS[i % TRACK_COLORS.length],
      muted: false,
      solo: false,
      volume: t.volume ?? 0.8,
    }))
    activeTrackId.value = tracks.value[0]?.id || ''
  }

  return {
    tracks,
    activeTrackId,
    activeTrack,
    hasSolo,
    initTracks,
    addTrack,
    removeTrack,
    setActiveTrack,
    toggleMute,
    toggleSolo,
    setTrackVolume,
    setTrackInstrument,
    clearTrackGrid,
    clearAllGrids,
    isTrackAudible,
    getAudibleTracks,
    exportTracksData,
    importTracksData,
  }
}
