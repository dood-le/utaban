<template>
  <div v-if="audioDemo" class="audio-player">
    <div class="player-header">
      <h4>サウンドデモ</h4>
      <button
        class="play-button"
        :class="{ playing: isPlaying }"
        @click="togglePlay"
      >
        <span v-if="!isPlaying">&#9654; 再生</span>
        <span v-else>&#9632; 停止</span>
      </button>
    </div>
    <div class="steps">
      <div
        v-for="(step, i) in audioDemo.notes"
        :key="i"
        class="step"
        :class="{ active: currentStep === i }"
        @click="playStepOnce(i)"
      >
        <div class="step-indicator" />
        <span class="step-label">{{ audioDemo.labels?.[i] || `Step ${i + 1}` }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AudioDemo } from '~/composables/useTheoryDictionary'

const props = defineProps<{
  audioDemo: AudioDemo | undefined
}>()

const { playChord, playSequence, stop, isPlaying, currentStep } = useAudio()

function togglePlay() {
  if (isPlaying.value) {
    stop()
  } else if (props.audioDemo) {
    playSequence(props.audioDemo.notes, props.audioDemo.duration || 600)
  }
}

function playStepOnce(index: number) {
  if (props.audioDemo && !isPlaying.value) {
    playChord(props.audioDemo.notes[index], (props.audioDemo.duration || 600) / 1000)
  }
}
</script>

<style scoped>
.audio-player {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.player-header h4 {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
}

.play-button {
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

.play-button:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.play-button.playing {
  background: #e74c3c;
}

.steps {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--hover-bg);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 50px;
}

.step:hover {
  background: var(--accent-bg);
  border-color: var(--accent-light);
}

.step.active {
  background: var(--accent-bg);
  border-color: var(--accent);
}

.step-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  transition: all 0.2s;
}

.step.active .step-indicator {
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
}

.step-label {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

.step.active .step-label {
  color: var(--accent-pale);
}
</style>
