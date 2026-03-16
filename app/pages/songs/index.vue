<template>
  <div class="songs-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">MIDIライブラリ</h1>
        <p class="page-desc">みんなの作品を聴いて、自分の曲も投稿しよう</p>
      </div>
      <div class="header-actions">
        <NuxtLink to="/dtm" class="header-btn create-btn">DTMで作曲</NuxtLink>
        <button v-if="user" class="header-btn upload-btn" @click="showUpload = !showUpload">
          {{ showUpload ? '閉じる' : '曲を投稿' }}
        </button>
        <NuxtLink v-else to="/login" class="header-btn upload-btn">ログインして投稿</NuxtLink>
      </div>
    </div>

    <!-- 投稿フォーム -->
    <div v-if="showUpload && user" class="upload-form">
      <h3 class="form-title">曲を投稿</h3>
      <p class="form-hint">DTMで作成した曲のデータをJSON形式で貼り付けてください。DTMページの「投稿」ボタンからコピーできます。</p>
      <div class="form-grid">
        <input v-model="newTitle" type="text" class="f-input" placeholder="曲名" maxlength="50" required />
        <select v-model="newGenre" class="f-input">
          <option value="J-POP">J-POP</option>
          <option value="Rock">Rock</option>
          <option value="Jazz">Jazz</option>
          <option value="Blues">Blues</option>
          <option value="Classical">Classical</option>
          <option value="Electronica">Electronica</option>
          <option value="Funk">Funk</option>
          <option value="Lo-Fi">Lo-Fi</option>
          <option value="Ambient">Ambient</option>
          <option value="Other">その他</option>
        </select>
      </div>
      <textarea v-model="newDescription" class="f-input f-textarea" placeholder="曲の説明" rows="2" maxlength="500" />
      <textarea v-model="newJsonData" class="f-input f-textarea json-input" placeholder='{"tracks":[...],"bpm":120,"scale":"major","rootNote":60,"totalSteps":16}' rows="4" />
      <div v-if="jsonError" class="json-error">{{ jsonError }}</div>
      <div class="form-actions">
        <span class="char-count">{{ newDescription.length }} / 500</span>
        <button class="submit-btn" :disabled="!canSubmit" @click="handleSubmit">投稿する</button>
      </div>
    </div>

    <!-- フィルタ・検索 -->
    <div class="filter-bar">
      <div class="search-wrap">
        <input v-model="searchQuery" type="text" class="search-input" placeholder="曲名・アーティストで検索..." />
      </div>
      <div class="genre-filters">
        <button class="genre-tab" :class="{ active: selectedGenre === null }" @click="selectedGenre = null">
          すべて
        </button>
        <button
          v-for="g in genres"
          :key="g"
          class="genre-tab"
          :class="{ active: selectedGenre === g }"
          @click="selectedGenre = g"
        >
          {{ g }}
        </button>
      </div>
      <select v-model="sortBy" class="sort-select">
        <option value="latest">新着順</option>
        <option value="popular">人気順</option>
        <option value="plays">再生数順</option>
      </select>
    </div>

    <!-- 曲一覧 -->
    <div class="songs-grid">
      <div v-for="song in filteredSongs" :key="song.id" class="song-card">
        <div class="song-top">
          <span class="song-genre-badge">{{ song.genre }}</span>
          <span class="song-date">{{ formatDate(song.createdAt) }}</span>
        </div>
        <h3 class="song-title">{{ song.title }}</h3>
        <p class="song-artist">{{ song.artist }}</p>
        <p class="song-desc">{{ song.description }}</p>

        <!-- トラック情報 -->
        <div class="song-tracks">
          <span v-for="track in song.tracks" :key="track.id" class="track-chip" :style="{ borderColor: track.color }">
            {{ track.name }}
          </span>
        </div>

        <!-- メタ情報 -->
        <div class="song-meta">
          <span class="meta-item">BPM {{ song.bpm }}</span>
          <span class="meta-item">{{ getScaleDisplayName(song.scale) }}</span>
          <span class="meta-item">{{ midiToNoteName(song.rootNote) }}</span>
          <span class="meta-item">{{ song.totalSteps }}ステップ</span>
        </div>

        <!-- アクション -->
        <div class="song-actions">
          <button
            class="action-btn play-btn"
            :class="{ playing: playingId === song.id }"
            @click="togglePlay(song)"
          >
            {{ playingId === song.id ? '■ 停止' : '▶ 再生' }}
          </button>
          <button class="action-btn open-btn" @click="openInDtm(song)">DTMで開く</button>
          <NuxtLink v-if="song.article" :to="`/songs/${song.id}`" class="action-btn article-btn">解説</NuxtLink>
          <button class="action-btn like-btn" @click="likeSong(song.id)">
            ♥ {{ song.likes }}
          </button>
          <span class="play-count">▶ {{ song.plays }}</span>
        </div>

        <!-- プログレスバー -->
        <div v-if="playingId === song.id" class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
    </div>

    <p v-if="filteredSongs.length === 0" class="empty-state">
      該当する曲が見つかりません。DTMで作曲して投稿してみましょう！
    </p>
  </div>
</template>

<script setup lang="ts">
import type { SharedSong } from '~/composables/useSongLibrary'
import type { Track } from '~/composables/useDtmTracks'

const router = useRouter()
const { user } = useAuth()
const { songs, initSongs, addSong, likeSong, incrementPlays, midiToNoteName, getScaleDisplayName } = useSongLibrary()
const { playNote, stop: stopAudio } = useAudio()
const loadSongState = useState<any>('dtm-load-song', () => null)

// フィルタ
const searchQuery = ref('')
const selectedGenre = ref<string | null>(null)
const sortBy = ref<'latest' | 'popular' | 'plays'>('latest')

const genres = computed(() => {
  const set = new Set(songs.value.map((s) => s.genre))
  return Array.from(set).sort()
})

const filteredSongs = computed(() => {
  let result = [...songs.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    )
  }
  if (selectedGenre.value) {
    result = result.filter((s) => s.genre === selectedGenre.value)
  }
  switch (sortBy.value) {
    case 'popular':
      result.sort((a, b) => b.likes - a.likes)
      break
    case 'plays':
      result.sort((a, b) => b.plays - a.plays)
      break
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  return result
})

// 投稿フォーム
const showUpload = ref(false)
const newTitle = ref('')
const newDescription = ref('')
const newGenre = ref('J-POP')
const newJsonData = ref('')
const jsonError = ref('')

const canSubmit = computed(() => {
  return newTitle.value.trim() && newJsonData.value.trim() && !jsonError.value
})

watch(newJsonData, (val) => {
  jsonError.value = ''
  if (!val.trim()) return
  try {
    const data = JSON.parse(val)
    if (!data.tracks || !Array.isArray(data.tracks) || data.tracks.length === 0) {
      jsonError.value = 'tracks配列が必要です'
    }
    if (!data.bpm || typeof data.bpm !== 'number') {
      jsonError.value = 'bpmが必要です'
    }
  } catch {
    jsonError.value = 'JSONの形式が正しくありません'
  }
})

function handleSubmit() {
  if (!user.value || !canSubmit.value) return
  try {
    const data = JSON.parse(newJsonData.value)
    addSong({
      title: newTitle.value.trim(),
      artist: user.value.name,
      description: newDescription.value.trim(),
      genre: newGenre.value,
      bpm: data.bpm || 120,
      scale: data.scale || 'major',
      rootNote: data.rootNote ?? 60,
      totalSteps: data.totalSteps || 16,
      tracks: data.tracks,
    })
    newTitle.value = ''
    newDescription.value = ''
    newJsonData.value = ''
    showUpload.value = false
  } catch {
    jsonError.value = 'データの解析に失敗しました'
  }
}

// 再生機能
const playingId = ref<number | null>(null)
const currentStep = ref(-1)
const progressPercent = ref(0)
let playTimer: ReturnType<typeof setInterval> | null = null

function togglePlay(song: SharedSong) {
  if (playingId.value === song.id) {
    stopPlayback()
    return
  }
  stopPlayback()
  playingId.value = song.id
  currentStep.value = -1
  progressPercent.value = 0
  incrementPlays(song.id)

  const stepMs = (60 / song.bpm) * 1000 / 4
  const totalSteps = song.totalSteps

  playTimer = setInterval(() => {
    currentStep.value = (currentStep.value + 1) % totalSteps
    progressPercent.value = ((currentStep.value + 1) / totalSteps) * 100

    for (const track of song.tracks) {
      if (track.muted) continue
      if (!track.grid) continue
      for (const [midiStr, steps] of Object.entries(track.grid)) {
        const midi = parseInt(midiStr)
        if (steps && (steps as any)[currentStep.value]) {
          playNote(midi, (stepMs / 1000) * 0.8, track.instrument, track.volume)
        }
      }
    }

    if (currentStep.value === totalSteps - 1) {
      stopPlayback()
    }
  }, stepMs)
}

function stopPlayback() {
  if (playTimer) {
    clearInterval(playTimer)
    playTimer = null
  }
  playingId.value = null
  currentStep.value = -1
  progressPercent.value = 0
  stopAudio()
}

// DTMで開く
function openInDtm(song: SharedSong) {
  stopPlayback()
  loadSongState.value = {
    tracks: song.tracks,
    bpm: song.bpm,
    scale: song.scale,
    rootNote: song.rootNote,
    totalSteps: song.totalSteps,
  }
  router.push('/dtm')
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

onMounted(() => {
  initSongs()
})

onUnmounted(() => {
  stopPlayback()
})

useHead({ title: 'MIDIライブラリ - 音楽理論辞典' })
</script>

<style scoped>
.songs-page { max-width: 1000px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.page-desc { color: var(--text-muted); font-size: 14px; }

.header-actions { display: flex; gap: 8px; }

.header-btn {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.create-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.create-btn:hover { border-color: var(--accent); }

.upload-btn { background: var(--accent); color: #fff; }
.upload-btn:hover { opacity: 0.9; }

/* 投稿フォーム */
.upload-form {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 24px;
}

.form-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.form-hint {
  font-size: 13px;
  color: var(--text-dimmed);
  margin-bottom: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 160px;
  gap: 10px;
  margin-bottom: 10px;
}

.f-input {
  padding: 10px 14px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.f-input:focus { border-color: var(--accent); }
.f-input::placeholder { color: var(--text-dimmed); }

.f-textarea { width: 100%; resize: vertical; margin-bottom: 10px; }

.json-input {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  line-height: 1.5;
}

.json-error {
  color: #ef4444;
  font-size: 13px;
  margin-bottom: 8px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count { font-size: 12px; color: var(--text-dimmed); }

.submit-btn {
  padding: 10px 24px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover { opacity: 0.9; }
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* フィルタ */
.filter-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.search-wrap { flex: 1; min-width: 200px; }

.search-input {
  width: 100%;
  padding: 10px 14px;
  background: var(--search-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus { border-color: var(--accent); }
.search-input::placeholder { color: var(--text-dimmed); }

.genre-filters {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.genre-tab {
  padding: 5px 12px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  color: var(--text-muted);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.genre-tab:hover { border-color: var(--accent); color: var(--accent); }
.genre-tab.active {
  background: var(--accent-bg);
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 600;
}

.sort-select {
  padding: 8px 12px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  cursor: pointer;
}

/* 曲カード */
.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.song-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 20px;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.song-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.song-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.song-genre-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 600;
  background: var(--accent-bg);
  color: var(--accent);
}

.song-date {
  font-size: 12px;
  color: var(--text-dimmed);
}

.song-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.song-artist {
  font-size: 13px;
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 8px;
}

.song-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.song-tracks {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.track-chip {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid;
  color: var(--text-muted);
  background: var(--bg-secondary);
}

.song-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.meta-item {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-dimmed);
  font-weight: 500;
}

.song-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  padding: 6px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--card-bg);
  color: var(--text-primary);
}

.play-btn { background: var(--accent); color: #fff; border-color: var(--accent); }
.play-btn:hover { opacity: 0.9; }
.play-btn.playing { background: #ef4444; border-color: #ef4444; }

.open-btn:hover { border-color: var(--accent); color: var(--accent); }

.article-btn {
  text-decoration: none;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
}
.article-btn:hover { background: rgba(16, 185, 129, 0.2); }

.like-btn:hover { color: #e74c3c; border-color: #e74c3c; }

.play-count {
  font-size: 12px;
  color: var(--text-dimmed);
  margin-left: auto;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--border-color);
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.1s linear;
}

.empty-state {
  text-align: center;
  color: var(--text-dimmed);
  padding: 60px 0;
  font-size: 15px;
}

@media (max-width: 768px) {
  .page-header { flex-direction: column; }
  .form-grid { grid-template-columns: 1fr; }
  .filter-bar { flex-direction: column; }
  .songs-grid { grid-template-columns: 1fr; }
  .song-actions { flex-wrap: wrap; }
}
</style>
