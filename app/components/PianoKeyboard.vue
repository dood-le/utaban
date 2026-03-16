<template>
  <div class="piano-container">
    <h4 class="piano-title">ピアノで試す</h4>
    <div class="piano">
      <div
        v-for="key in keys"
        :key="key.midi"
        class="key"
        :class="{
          black: key.isBlack,
          white: !key.isBlack,
          highlighted: highlightedNotes.includes(key.midi),
          pressing: pressingNote === key.midi,
        }"
        @mousedown="onKeyDown(key.midi)"
        @mouseup="onKeyUp"
        @mouseleave="onKeyUp"
      >
        <span v-if="!key.isBlack" class="key-label">{{ key.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    startNote?: number
    endNote?: number
    highlightedNotes?: number[]
  }>(),
  {
    startNote: 60,
    endNote: 84,
    highlightedNotes: () => [],
  }
)

const { playNote } = useAudio()
const pressingNote = ref<number | null>(null)

const noteLabels = ['ド', 'ド#', 'レ', 'レ#', 'ミ', 'ファ', 'ファ#', 'ソ', 'ソ#', 'ラ', 'ラ#', 'シ']
const blackNoteIndices = [1, 3, 6, 8, 10]

interface PianoKey {
  midi: number
  label: string
  isBlack: boolean
}

const keys = computed<PianoKey[]>(() => {
  const result: PianoKey[] = []
  for (let midi = props.startNote; midi <= props.endNote; midi++) {
    const noteIndex = midi % 12
    result.push({
      midi,
      label: noteLabels[noteIndex],
      isBlack: blackNoteIndices.includes(noteIndex),
    })
  }
  return result
})

function onKeyDown(midi: number) {
  pressingNote.value = midi
  playNote(midi, 0.5)
}

function onKeyUp() {
  pressingNote.value = null
}
</script>

<style scoped>
.piano-container {
  margin: 20px 0;
  overflow-x: auto;
}

.piano-title {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: 12px;
}

.piano {
  display: flex;
  position: relative;
  height: 140px;
  user-select: none;
}

.key {
  position: relative;
  cursor: pointer;
  transition: background 0.1s;
}

.key.white {
  width: 40px;
  height: 140px;
  background: linear-gradient(to bottom, #f8f8f8, #e8e8e8);
  border: 1px solid #aaa;
  border-radius: 0 0 5px 5px;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
}

.key.white:hover {
  background: linear-gradient(to bottom, #f0f0ff, #e0e0f0);
}

.key.white:active,
.key.white.pressing {
  background: linear-gradient(to bottom, #d0d0ff, #c0c0e0);
}

.key.white.highlighted {
  background: linear-gradient(to bottom, var(--accent-pale), var(--accent-light));
}

.key.black {
  width: 26px;
  height: 90px;
  background: linear-gradient(to bottom, #333, #111);
  border: 1px solid #000;
  border-radius: 0 0 4px 4px;
  margin-left: -13px;
  margin-right: -13px;
  z-index: 2;
}

.key.black:hover {
  background: linear-gradient(to bottom, #444, #222);
}

.key.black:active,
.key.black.pressing {
  background: linear-gradient(to bottom, #555, #333);
}

.key.black.highlighted {
  background: linear-gradient(to bottom, var(--accent), var(--accent-light));
}

.key-label {
  font-size: 10px;
  color: #888;
  pointer-events: none;
}

.key.highlighted .key-label {
  color: #333;
  font-weight: 600;
}
</style>
