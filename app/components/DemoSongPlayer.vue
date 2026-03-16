<template>
  <div class="demo-song-player">
    <div class="song-header">
      <div class="song-info">
        <h4 class="song-title">{{ song.title }}</h4>
        <p class="song-desc">{{ song.description }}</p>
      </div>
      <div class="song-controls">
        <span class="bpm-badge">BPM {{ song.bpm }}</span>
        <button class="play-btn" :class="{ playing: playing }" @click="togglePlay">
          <span v-if="!playing">&#9654; 再生</span>
          <span v-else>&#9632; 停止</span>
        </button>
      </div>
    </div>

    <div class="tracks">
      <div
        v-for="(track, ti) in song.tracks"
        :key="ti"
        class="track"
      >
        <div class="track-label">
          <span class="track-icon">{{ instrumentIcon(track.instrument) }}</span>
          <span class="track-name">{{ track.name }}</span>
        </div>
        <div class="track-timeline">
          <div
            v-for="(note, ni) in track.notes"
            :key="ni"
            class="track-note"
            :class="{
              rest: !note,
              active: playing && isNoteActive(ti, ni),
            }"
            :style="{ flex: note ? note[1] : 1 }"
          />
        </div>
      </div>
    </div>

    <div v-if="playing" class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DemoSong } from '~/composables/useTheoryDictionary'

const props = defineProps<{ song: DemoSong }>()

const { playDemoSongNotes, getContext } = useAudio()

const playing = ref(false)
const currentTime = ref(0)
const totalBeats = ref(0)
const activeNotes = ref<Map<string, boolean>>(new Map())
let animFrame = 0
let startedAt = 0

const progressPercent = computed(() => {
  if (totalBeats.value === 0) return 0
  return Math.min(100, (currentTime.value / totalBeats.value) * 100)
})

function instrumentIcon(inst: string) {
  const icons: Record<string, string> = {
    piano: '🎹', bass: '🎸', lead: '🎵', pad: '🎻',
    strings: '🎻', organ: '⛪', marimba: '🥁', synth: '🎛️',
  }
  return icons[inst] || '🎵'
}

function isNoteActive(trackIndex: number, noteIndex: number) {
  return activeNotes.value.get(`${trackIndex}-${noteIndex}`) || false
}

function computeTotalBeats(): number {
  let maxBeats = 0
  for (const track of props.song.tracks) {
    let beats = 0
    for (const note of track.notes) {
      beats += note ? note[1] : 1
    }
    maxBeats = Math.max(maxBeats, beats)
  }
  return maxBeats
}

function togglePlay() {
  if (playing.value) {
    stopPlayback()
  } else {
    startPlayback()
  }
}

function startPlayback() {
  const ctx = getContext()
  const bpm = props.song.bpm
  const beatDuration = 60 / bpm

  totalBeats.value = computeTotalBeats()
  playing.value = true
  startedAt = ctx.currentTime

  const totalDuration = totalBeats.value * beatDuration

  // Schedule all notes
  for (let ti = 0; ti < props.song.tracks.length; ti++) {
    const track = props.song.tracks[ti]
    let beatOffset = 0

    for (let ni = 0; ni < track.notes.length; ni++) {
      const noteData = track.notes[ni]
      if (!noteData) {
        beatOffset += 1
        continue
      }

      const [midiNotes, durationBeats] = noteData
      const noteStart = ctx.currentTime + beatOffset * beatDuration
      const noteDuration = durationBeats * beatDuration * 0.9

      playDemoSongNotes(midiNotes, noteStart, noteDuration, track.instrument)
      beatOffset += durationBeats
    }
  }

  // Animation loop
  function tick() {
    if (!playing.value) return
    const elapsed = ctx.currentTime - startedAt
    currentTime.value = elapsed / beatDuration

    // Update active notes
    const newActive = new Map<string, boolean>()
    for (let ti = 0; ti < props.song.tracks.length; ti++) {
      const track = props.song.tracks[ti]
      let beatOffset = 0
      for (let ni = 0; ni < track.notes.length; ni++) {
        const noteData = track.notes[ni]
        const dur = noteData ? noteData[1] : 1
        if (currentTime.value >= beatOffset && currentTime.value < beatOffset + dur) {
          newActive.set(`${ti}-${ni}`, true)
        }
        beatOffset += dur
      }
    }
    activeNotes.value = newActive

    if (elapsed < totalDuration) {
      animFrame = requestAnimationFrame(tick)
    } else {
      stopPlayback()
    }
  }

  animFrame = requestAnimationFrame(tick)
}

function stopPlayback() {
  playing.value = false
  currentTime.value = 0
  activeNotes.value = new Map()
  cancelAnimationFrame(animFrame)
}

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
.demo-song-player {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
}

.song-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.song-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.song-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

.song-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.bpm-badge {
  font-size: 12px;
  color: var(--accent);
  background: var(--accent-bg);
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.play-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}

.play-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.play-btn.playing {
  background: #e74c3c;
}

.tracks {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.track {
  display: flex;
  align-items: center;
  gap: 10px;
}

.track-label {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 100px;
  font-size: 12px;
  color: var(--text-muted);
}

.track-icon {
  font-size: 14px;
}

.track-name {
  white-space: nowrap;
}

.track-timeline {
  flex: 1;
  display: flex;
  gap: 2px;
  height: 24px;
}

.track-note {
  border-radius: 3px;
  background: var(--note-bg, rgba(124, 91, 245, 0.15));
  transition: background 0.15s, transform 0.1s;
}

.track-note.rest {
  background: transparent;
  border: 1px dashed var(--border-color);
}

.track-note.active {
  background: var(--accent);
  transform: scaleY(1.15);
  box-shadow: 0 0 8px var(--accent-glow);
}

.progress-bar {
  margin-top: 12px;
  height: 3px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.1s linear;
}
</style>
