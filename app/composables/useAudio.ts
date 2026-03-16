let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return audioContext
}

function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

interface InstrumentConfig {
  oscType: OscillatorType
  filterFreq: number
  volume: number
  attack: number
  decay: number
  sustain: number
  release: number
}

const instruments: Record<string, InstrumentConfig> = {
  piano: { oscType: 'triangle', filterFreq: 3000, volume: 0.3, attack: 0.01, decay: 0.15, sustain: 0.2, release: 0.2 },
  bass: { oscType: 'sawtooth', filterFreq: 800, volume: 0.35, attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.1 },
  lead: { oscType: 'square', filterFreq: 2500, volume: 0.2, attack: 0.02, decay: 0.1, sustain: 0.25, release: 0.15 },
  pad: { oscType: 'sine', filterFreq: 1500, volume: 0.2, attack: 0.15, decay: 0.2, sustain: 0.3, release: 0.3 },
  strings: { oscType: 'sawtooth', filterFreq: 4000, volume: 0.2, attack: 0.12, decay: 0.2, sustain: 0.35, release: 0.4 },
  organ: { oscType: 'sine', filterFreq: 5000, volume: 0.25, attack: 0.005, decay: 0.05, sustain: 0.4, release: 0.08 },
  marimba: { oscType: 'sine', filterFreq: 6000, volume: 0.35, attack: 0.002, decay: 0.3, sustain: 0.0, release: 0.1 },
  synth: { oscType: 'sawtooth', filterFreq: 3500, volume: 0.2, attack: 0.03, decay: 0.15, sustain: 0.25, release: 0.2 },
  default: { oscType: 'triangle', filterFreq: 2000, volume: 0.3, attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.15 },
}

function createOscillator(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  instrumentName: string = 'default'
) {
  const config = instruments[instrumentName] || instruments.default
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc.type = config.oscType
  osc.frequency.setValueAtTime(frequency, startTime)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(config.filterFreq, startTime)
  filter.Q.setValueAtTime(1, startTime)

  const safeRelease = Math.min(config.release, duration * 0.3)
  const sustainEnd = startTime + duration - safeRelease

  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(config.volume, startTime + config.attack)
  gain.gain.linearRampToValueAtTime(config.sustain, startTime + config.attack + config.decay)
  if (sustainEnd > startTime + config.attack + config.decay) {
    gain.gain.setValueAtTime(config.sustain, sustainEnd)
  }
  gain.gain.linearRampToValueAtTime(0, startTime + duration)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.start(startTime)
  osc.stop(startTime + duration + 0.01)
}

function createOscillatorWithVolume(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  instrumentName: string = 'default',
  volumeScale: number = 1.0
) {
  const config = instruments[instrumentName] || instruments.default
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc.type = config.oscType
  osc.frequency.setValueAtTime(frequency, startTime)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(config.filterFreq, startTime)
  filter.Q.setValueAtTime(1, startTime)

  const vol = config.volume * volumeScale
  const sus = config.sustain * volumeScale
  const safeRelease = Math.min(config.release, duration * 0.3)
  const sustainEnd = startTime + duration - safeRelease

  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(vol, startTime + config.attack)
  gain.gain.linearRampToValueAtTime(sus, startTime + config.attack + config.decay)
  if (sustainEnd > startTime + config.attack + config.decay) {
    gain.gain.setValueAtTime(sus, sustainEnd)
  }
  gain.gain.linearRampToValueAtTime(0, startTime + duration)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.start(startTime)
  osc.stop(startTime + duration + 0.01)
}

// --- Sample audio (AudioBuffer) support ---
const sampleBuffers: Map<string, AudioBuffer> = new Map()
const loadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map()

async function loadSample(url: string): Promise<AudioBuffer | null> {
  if (sampleBuffers.has(url)) return sampleBuffers.get(url)!
  if (loadingPromises.has(url)) return loadingPromises.get(url)!

  const promise = (async () => {
    try {
      const ctx = getAudioContext()
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
      sampleBuffers.set(url, audioBuffer)
      return audioBuffer
    } catch {
      return null
    }
  })()

  loadingPromises.set(url, promise)
  return promise
}

function playSampleBuffer(
  buffer: AudioBuffer,
  startTime: number,
  duration: number,
  playbackRate: number = 1,
  volume: number = 0.5
) {
  const ctx = getAudioContext()
  const source = ctx.createBufferSource()
  const gain = ctx.createGain()

  source.buffer = buffer
  source.playbackRate.setValueAtTime(playbackRate, startTime)

  gain.gain.setValueAtTime(volume, startTime)
  gain.gain.linearRampToValueAtTime(0, startTime + duration)

  source.connect(gain)
  gain.connect(ctx.destination)

  source.start(startTime)
  source.stop(startTime + duration + 0.01)
}

function midiToPlaybackRate(baseMidi: number, targetMidi: number): number {
  return Math.pow(2, (targetMidi - baseMidi) / 12)
}

export function useAudio() {
  const isPlaying = ref(false)
  const currentStep = ref(-1)

  function playNote(midiNote: number, duration: number = 0.5, instrument: string = 'default', volume: number = 1.0) {
    const ctx = getAudioContext()
    createOscillatorWithVolume(ctx, midiToFrequency(midiNote), ctx.currentTime, duration, instrument, volume)
  }

  function playChord(midiNotes: number[], duration: number = 0.8, instrument: string = 'default') {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    for (const note of midiNotes) {
      createOscillator(ctx, midiToFrequency(note), now, duration, instrument)
    }
  }

  async function playSequence(
    steps: number[][],
    stepDuration: number = 500,
    onStep?: (index: number) => void
  ) {
    if (isPlaying.value) return
    isPlaying.value = true
    currentStep.value = -1

    const ctx = getAudioContext()
    const durationSec = stepDuration / 1000

    for (let i = 0; i < steps.length; i++) {
      if (!isPlaying.value) break
      currentStep.value = i
      onStep?.(i)

      const notes = steps[i]
      const now = ctx.currentTime
      for (const note of notes) {
        createOscillator(ctx, midiToFrequency(note), now, durationSec * 0.9)
      }

      await new Promise((resolve) => setTimeout(resolve, stepDuration))
    }

    isPlaying.value = false
    currentStep.value = -1
  }

  function playDemoSongNotes(
    midiNotes: number[],
    startTime: number,
    duration: number,
    instrument: string
  ) {
    const ctx = getAudioContext()
    for (const note of midiNotes) {
      createOscillator(ctx, midiToFrequency(note), startTime, duration, instrument)
    }
  }

  function getContext() {
    return getAudioContext()
  }

  function stop() {
    isPlaying.value = false
    currentStep.value = -1
  }

  async function loadSampleInstrument(url: string): Promise<boolean> {
    const buf = await loadSample(url)
    return buf !== null
  }

  function playSampleNote(
    url: string,
    midiNote: number,
    baseMidi: number = 60,
    duration: number = 0.5,
    volume: number = 0.5
  ) {
    const buffer = sampleBuffers.get(url)
    if (!buffer) return
    const ctx = getAudioContext()
    const rate = midiToPlaybackRate(baseMidi, midiNote)
    playSampleBuffer(buffer, ctx.currentTime, duration, rate, volume)
  }

  function playSampleChord(
    url: string,
    midiNotes: number[],
    baseMidi: number = 60,
    duration: number = 0.8,
    volume: number = 0.4
  ) {
    const buffer = sampleBuffers.get(url)
    if (!buffer) return
    const ctx = getAudioContext()
    const now = ctx.currentTime
    for (const note of midiNotes) {
      const rate = midiToPlaybackRate(baseMidi, note)
      playSampleBuffer(buffer, now, duration, rate, volume)
    }
  }

  return {
    playNote,
    playChord,
    playSequence,
    playDemoSongNotes,
    loadSampleInstrument,
    playSampleNote,
    playSampleChord,
    getContext,
    stop,
    isPlaying,
    currentStep,
  }
}
