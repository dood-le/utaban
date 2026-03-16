<template>
  <div v-if="song" class="song-detail">
    <div class="breadcrumb">
      <NuxtLink to="/songs">MIDIライブラリ</NuxtLink>
      <span class="sep">/</span>
      <span class="current">{{ song.title }}</span>
    </div>

    <!-- ヘッダー -->
    <div class="detail-header">
      <div class="header-left">
        <span class="genre-badge">{{ song.genre }}</span>
        <h1 class="detail-title">{{ song.title }}</h1>
        <p class="detail-artist">by {{ song.artist }}</p>
        <p class="detail-desc">{{ song.description }}</p>
        <div class="detail-meta">
          <span class="meta-tag">BPM {{ song.bpm }}</span>
          <span class="meta-tag">{{ getScaleDisplayName(song.scale) }}</span>
          <span class="meta-tag">Key: {{ midiToNoteName(song.rootNote) }}</span>
          <span class="meta-tag">{{ song.totalSteps }}ステップ</span>
          <span class="meta-tag">{{ song.tracks.length }}トラック</span>
        </div>
      </div>
      <div class="header-actions">
        <button
          class="action-btn play-btn"
          :class="{ playing: isPlaying }"
          @click="togglePlay"
        >
          {{ isPlaying ? '■ 停止' : '▶ 再生' }}
        </button>
        <button class="action-btn dtm-btn" @click="openInDtm">DTMで開く</button>
        <button class="action-btn like-btn" @click="likeSong(song.id)">♥ {{ song.likes }}</button>
      </div>
    </div>

    <!-- プログレスバー -->
    <div v-if="isPlaying" class="play-progress">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <!-- トラック一覧 -->
    <div class="tracks-section">
      <h2 class="section-title">トラック構成</h2>
      <div class="track-cards">
        <div v-for="track in song.tracks" :key="track.id" class="track-card">
          <div class="track-color" :style="{ background: track.color }"></div>
          <div class="track-info">
            <span class="track-name">{{ track.name }}</span>
            <span class="track-detail">{{ track.instrument }} / Vol: {{ Math.round(track.volume * 100) }}%</span>
          </div>
          <span class="track-role">{{ roleLabel(track.role) }}</span>
        </div>
      </div>
    </div>

    <!-- 解説記事 -->
    <div v-if="song.article" class="article-section">
      <h2 class="section-title">楽曲解説</h2>

      <div class="article-card summary-card">
        <h3 class="article-heading">概要</h3>
        <p class="article-text">{{ song.article.summary }}</p>
      </div>

      <div class="article-card theory-card">
        <h3 class="article-heading">使われている音楽理論</h3>
        <p class="article-text">{{ song.article.theory }}</p>
      </div>

      <div class="article-card structure-card">
        <h3 class="article-heading">楽曲構造の解説</h3>
        <div class="article-text">
          <p v-for="(line, i) in structureLines" :key="i">{{ line }}</p>
        </div>
      </div>

      <div class="article-card tips-card">
        <h3 class="article-heading">作曲のヒント</h3>
        <div class="tips-list">
          <p v-for="(tip, i) in tipLines" :key="i" class="tip-item">{{ tip }}</p>
        </div>
      </div>

      <!-- 関連キーワード -->
      <div v-if="relatedEntries.length > 0" class="related-section">
        <h3 class="article-heading">関連する音楽理論</h3>
        <div class="related-links">
          <NuxtLink
            v-for="entry in relatedEntries"
            :key="entry.slug"
            :to="`/theory/${entry.slug}`"
            class="related-link"
          >
            <span class="related-icon">{{ getCategoryIcon(entry.category) }}</span>
            <div>
              <span class="related-title">{{ entry.title }}</span>
              <span class="related-desc">{{ entry.shortDescription }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else class="no-article">
      <p>この曲にはまだ解説記事がありません。</p>
    </div>
  </div>

  <div v-else class="not-found">
    <h1>曲が見つかりません</h1>
    <p>お探しの曲は存在しないか、削除された可能性があります。</p>
    <NuxtLink to="/songs" class="back-link">MIDIライブラリに戻る</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const songId = computed(() => Number(route.params.id))

const { songs, initSongs, getSong, likeSong, incrementPlays, midiToNoteName, getScaleDisplayName } = useSongLibrary()
const { playNote, stop: stopAudio } = useAudio()
const { getEntry, getCategory } = useTheoryDictionary()
const loadSongState = useState<any>('dtm-load-song', () => null)

const song = computed(() => getSong(songId.value))

const structureLines = computed(() => {
  if (!song.value?.article?.structure) return []
  return song.value.article.structure.split('\n').filter((l: string) => l.trim())
})

const tipLines = computed(() => {
  if (!song.value?.article?.tips) return []
  return song.value.article.tips.split('\n').filter((l: string) => l.trim())
})

const relatedEntries = computed(() => {
  if (!song.value?.article?.relatedTerms) return []
  return song.value.article.relatedTerms
    .map((slug: string) => getEntry(slug))
    .filter(Boolean)
})

function getCategoryIcon(category: string) {
  const cat = getCategory(category)
  return cat?.icon || '📖'
}

function roleLabel(role: string) {
  const map: Record<string, string> = {
    melody: 'メロディ',
    chords: 'コード',
    bass: 'ベース',
    rhythm: 'リズム',
    custom: 'カスタム',
  }
  return map[role] || role
}

// 再生
const isPlaying = ref(false)
const currentStep = ref(-1)
const progressPercent = ref(0)
let playTimer: ReturnType<typeof setInterval> | null = null

function togglePlay() {
  if (isPlaying.value) {
    stopPlayback()
    return
  }
  if (!song.value) return
  isPlaying.value = true
  currentStep.value = -1
  progressPercent.value = 0
  incrementPlays(song.value.id)

  const s = song.value
  const stepMs = (60 / s.bpm) * 1000 / 4

  playTimer = setInterval(() => {
    currentStep.value = (currentStep.value + 1) % s.totalSteps
    progressPercent.value = ((currentStep.value + 1) / s.totalSteps) * 100

    for (const track of s.tracks) {
      if (track.muted || !track.grid) continue
      for (const [midiStr, steps] of Object.entries(track.grid)) {
        const midi = parseInt(midiStr)
        if (steps && (steps as any)[currentStep.value]) {
          playNote(midi, (stepMs / 1000) * 0.8, track.instrument, track.volume)
        }
      }
    }

    if (currentStep.value === s.totalSteps - 1) {
      stopPlayback()
    }
  }, stepMs)
}

function stopPlayback() {
  if (playTimer) { clearInterval(playTimer); playTimer = null }
  isPlaying.value = false
  currentStep.value = -1
  progressPercent.value = 0
  stopAudio()
}

function openInDtm() {
  if (!song.value) return
  stopPlayback()
  loadSongState.value = {
    tracks: song.value.tracks,
    bpm: song.value.bpm,
    scale: song.value.scale,
    rootNote: song.value.rootNote,
    totalSteps: song.value.totalSteps,
  }
  router.push('/dtm')
}

onMounted(() => {
  initSongs()
})

onUnmounted(() => {
  stopPlayback()
})

useHead({
  title: computed(() => song.value ? `${song.value.title} - MIDIライブラリ` : '曲が見つかりません'),
})
</script>

<style scoped>
.song-detail { max-width: 860px; }

.breadcrumb {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--text-muted); margin-bottom: 24px;
}
.breadcrumb a { color: var(--accent); text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb .sep { color: var(--text-dimmed); }

/* ヘッダー */
.detail-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 24px; margin-bottom: 24px; flex-wrap: wrap;
}

.genre-badge {
  display: inline-block; font-size: 12px; padding: 4px 12px;
  border-radius: 12px; font-weight: 600;
  background: var(--accent-bg); color: var(--accent); margin-bottom: 8px;
}

.detail-title {
  font-size: 32px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;
}

.detail-artist {
  font-size: 15px; color: var(--accent); font-weight: 500; margin-bottom: 10px;
}

.detail-desc {
  font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-bottom: 14px;
}

.detail-meta { display: flex; gap: 8px; flex-wrap: wrap; }

.meta-tag {
  font-size: 12px; padding: 3px 10px; border-radius: 6px;
  background: var(--bg-secondary); color: var(--text-dimmed); font-weight: 500;
}

.header-actions { display: flex; gap: 8px; flex-shrink: 0; }

.action-btn {
  padding: 10px 20px; border: 1px solid var(--border-color); border-radius: 10px;
  font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  background: var(--card-bg); color: var(--text-primary);
}

.play-btn { background: var(--accent); color: #fff; border-color: var(--accent); }
.play-btn:hover { opacity: 0.9; }
.play-btn.playing { background: #ef4444; border-color: #ef4444; }
.dtm-btn:hover { border-color: var(--accent); color: var(--accent); }
.like-btn:hover { color: #e74c3c; border-color: #e74c3c; }

/* プログレス */
.play-progress {
  height: 4px; background: var(--border-color); border-radius: 2px; margin-bottom: 24px; overflow: hidden;
}
.progress-fill { height: 100%; background: var(--accent); transition: width 0.1s linear; }

/* トラック */
.tracks-section { margin-bottom: 32px; }

.section-title {
  font-size: 20px; font-weight: 700; color: var(--text-primary);
  margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border-color);
}

.track-cards { display: flex; flex-direction: column; gap: 8px; }

.track-card {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; background: var(--card-bg);
  border: 1px solid var(--border-color); border-radius: 10px;
}

.track-color { width: 6px; height: 36px; border-radius: 3px; flex-shrink: 0; }

.track-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.track-name { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.track-detail { font-size: 12px; color: var(--text-dimmed); }

.track-role {
  font-size: 11px; padding: 3px 10px; border-radius: 8px;
  background: var(--accent-bg); color: var(--accent); font-weight: 600;
}

/* 解説記事 */
.article-section { display: flex; flex-direction: column; gap: 16px; }

.article-card {
  background: var(--card-bg); border: 1px solid var(--border-color);
  border-radius: 14px; padding: 24px;
}

.article-heading {
  font-size: 16px; font-weight: 700; color: var(--text-primary);
  margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
}

.summary-card .article-heading::before { content: '📝'; }
.theory-card .article-heading::before { content: '🎵'; }
.structure-card .article-heading::before { content: '🏗️'; }
.tips-card .article-heading::before { content: '💡'; }

.article-text {
  font-size: 14px; color: var(--text-secondary); line-height: 1.8;
}
.article-text p { margin-bottom: 8px; }
.article-text p:last-child { margin-bottom: 0; }

.tips-list { display: flex; flex-direction: column; gap: 6px; }

.tip-item {
  font-size: 14px; color: var(--text-secondary); line-height: 1.7;
  padding-left: 8px; border-left: 3px solid var(--accent);
}

/* 関連理論 */
.related-section {
  background: var(--card-bg); border: 1px solid var(--border-color);
  border-radius: 14px; padding: 24px;
}

.related-links { display: flex; flex-direction: column; gap: 8px; }

.related-link {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 10px;
  text-decoration: none; color: inherit; transition: all 0.2s;
  border: 1px solid var(--border-color);
}
.related-link:hover { border-color: var(--accent); transform: translateX(4px); }

.related-icon { font-size: 22px; flex-shrink: 0; }
.related-title { font-size: 14px; font-weight: 600; color: var(--text-primary); display: block; }
.related-desc { font-size: 12px; color: var(--text-dimmed); display: block; margin-top: 2px; }

.no-article {
  text-align: center; color: var(--text-dimmed); padding: 40px; font-size: 15px;
  background: var(--bg-secondary); border-radius: 14px;
}

.not-found { text-align: center; padding: 80px 0; }
.not-found h1 { font-size: 28px; margin-bottom: 12px; color: var(--text-primary); }
.not-found p { color: var(--text-muted); margin-bottom: 24px; }
.back-link {
  display: inline-block; padding: 10px 24px; background: var(--accent);
  color: white; border-radius: 8px; font-weight: 600; text-decoration: none;
}

@media (max-width: 768px) {
  .detail-header { flex-direction: column; }
  .detail-title { font-size: 24px; }
  .header-actions { width: 100%; }
  .action-btn { flex: 1; text-align: center; }
}
</style>
