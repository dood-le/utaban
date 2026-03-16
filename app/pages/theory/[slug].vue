<template>
  <div v-if="entry" class="theory-page">
    <div class="breadcrumb">
      <NuxtLink to="/">ホーム</NuxtLink>
      <span class="sep">/</span>
      <NuxtLink to="/dictionary">用語辞典</NuxtLink>
      <span class="sep">/</span>
      <span class="current">{{ entry.title }}</span>
    </div>

    <div class="page-layout">
      <article class="main-content">
        <div class="entry-category">
          {{ categoryInfo?.icon }} {{ categoryInfo?.name }}
        </div>
        <h1 class="entry-title">{{ entry.title }}</h1>
        <p class="entry-short">{{ entry.shortDescription }}</p>

        <div class="entry-body">
          <div v-for="(paragraph, i) in paragraphs" :key="i" class="paragraph">
            <TermLinkedText :html="paragraph" :current-slug="slug" />
          </div>
        </div>

        <AudioPlayer :audio-demo="entry.audioDemo" />

        <PianoKeyboard
          v-if="entry.audioDemo"
          :highlighted-notes="highlightedNotes"
          :start-note="pianoStart"
          :end-note="pianoEnd"
        />

        <!-- 楽曲例セクション -->
        <div v-if="entry.songExamples?.length" class="song-examples-section">
          <h2 class="song-examples-title">この理論が使われている楽曲</h2>
          <p class="song-examples-desc">実際の楽曲でこの理論がどう活かされているか確認しましょう。</p>
          <div class="song-examples-list">
            <div v-for="(song, i) in entry.songExamples" :key="i" class="song-example-card">
              <div class="song-example-header">
                <span class="song-example-number">{{ i + 1 }}</span>
                <div class="song-example-info">
                  <h4 class="song-example-name">{{ song.title }}</h4>
                  <span class="song-example-artist">{{ song.artist }}<span v-if="song.year" class="song-example-year"> ({{ song.year }})</span></span>
                </div>
              </div>
              <p class="song-example-desc">{{ song.description }}</p>
            </div>
          </div>
        </div>

        <!-- デモ曲セクション -->
        <div v-if="entry.demoSongs?.length" class="demo-songs-section">
          <h2 class="demo-songs-title">この理論を使ったデモ曲</h2>
          <p class="demo-songs-desc">理論がどのように実際の音楽で使われるか、聴いて確かめてみましょう。</p>
          <DemoSongPlayer
            v-for="(song, i) in entry.demoSongs"
            :key="i"
            :song="song"
          />
        </div>
      </article>

      <aside class="sidebar">
        <div v-if="relatedEntries.length > 0" class="sidebar-section">
          <h3 class="sidebar-title">関連キーワード</h3>
          <div class="related-list">
            <KeywordLink
              v-for="related in relatedEntries"
              :key="related.slug"
              :slug="related.slug"
            />
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">同じカテゴリ</h3>
          <div class="same-category-list">
            <NuxtLink
              v-for="item in sameCategoryEntries"
              :key="item.slug"
              :to="`/theory/${item.slug}`"
              class="same-cat-link"
              :class="{ current: item.slug === entry.slug }"
            >
              {{ item.title }}
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <div v-else class="not-found">
    <h1>項目が見つかりません</h1>
    <p>お探しの音楽理論用語は存在しません。</p>
    <NuxtLink to="/dictionary" class="back-link">用語辞典に戻る</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { getEntry, getCategory, getRelatedEntries, getEntriesByCategory } = useTheoryDictionary()

const entry = computed(() => getEntry(slug.value))
const categoryInfo = computed(() => entry.value ? getCategory(entry.value.category) : null)
const relatedEntries = computed(() => getRelatedEntries(slug.value))
const sameCategoryEntries = computed(() =>
  entry.value ? getEntriesByCategory(entry.value.category) : []
)

const paragraphs = computed(() => {
  if (!entry.value) return []
  return entry.value.description
    .split('\n\n')
    .map((p) => {
      let html = p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      if (html.includes('|')) {
        const lines = html.split('\n').filter((l) => l.trim().startsWith('|'))
        if (lines.length >= 2) {
          const headerCells = lines[0].split('|').filter(Boolean).map((c) => c.trim())
          const dataLines = lines.slice(2)
          let table = '<table><thead><tr>'
          for (const cell of headerCells) {
            table += `<th>${cell}</th>`
          }
          table += '</tr></thead><tbody>'
          for (const line of dataLines) {
            const cells = line.split('|').filter(Boolean).map((c) => c.trim())
            table += '<tr>'
            for (const cell of cells) {
              table += `<td>${cell}</td>`
            }
            table += '</tr>'
          }
          table += '</tbody></table>'
          return table
        }
      }
      html = html.replace(/\n/g, '<br>')
      return `<p>${html}</p>`
    })
})

const highlightedNotes = computed(() => {
  if (!entry.value?.audioDemo) return []
  const all = new Set<number>()
  for (const step of entry.value.audioDemo.notes) {
    for (const note of step) {
      all.add(note)
    }
  }
  return Array.from(all)
})

const pianoStart = computed(() => {
  if (!highlightedNotes.value.length) return 60
  return Math.max(48, Math.min(...highlightedNotes.value) - 2)
})

const pianoEnd = computed(() => {
  if (!highlightedNotes.value.length) return 84
  return Math.min(96, Math.max(...highlightedNotes.value) + 2)
})

useHead({
  title: computed(() => entry.value ? `${entry.value.title} - 音楽理論辞典` : '項目が見つかりません'),
})
</script>

<style scoped>
.theory-page {
  max-width: 1000px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.breadcrumb a {
  color: var(--accent);
}

.breadcrumb .sep {
  color: var(--text-dimmed);
}

.breadcrumb .current {
  color: var(--text-muted);
}

.page-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 40px;
}

@media (max-width: 768px) {
  .page-layout {
    grid-template-columns: 1fr;
  }
}

.entry-category {
  font-size: 14px;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 8px;
}

.entry-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.entry-short {
  font-size: 16px;
  color: var(--text-muted);
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.entry-body {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.entry-body :deep(p) {
  margin-bottom: 16px;
}

.entry-body :deep(strong) {
  color: var(--accent-pale);
  font-weight: 600;
}

.entry-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}

.entry-body :deep(th) {
  background: var(--table-header-bg);
  padding: 8px 12px;
  text-align: left;
  font-weight: 600;
  color: var(--accent-pale);
  border: 1px solid var(--border-color);
}

.entry-body :deep(td) {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
}

.song-examples-section {
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.song-examples-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.song-examples-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.song-examples-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.song-example-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 16px;
  transition: border-color 0.2s;
}

.song-example-card:hover {
  border-color: var(--accent);
}

.song-example-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.song-example-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.song-example-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.song-example-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.song-example-artist {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.song-example-year {
  color: var(--text-dimmed);
}

.song-example-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-left: 40px;
}

.demo-songs-section {
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.demo-songs-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.demo-songs-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.sidebar {
  position: sticky;
  top: 88px;
  align-self: start;
}

.sidebar-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  transition: background 0.3s, border-color 0.3s;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.related-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.same-category-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.same-cat-link {
  display: block;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s;
}

.same-cat-link:hover {
  color: var(--accent-pale);
  background: var(--hover-bg);
}

.same-cat-link.current {
  color: var(--accent);
  background: var(--accent-bg);
  font-weight: 600;
}

.not-found {
  text-align: center;
  padding: 80px 0;
}

.not-found h1 {
  font-size: 28px;
  margin-bottom: 12px;
}

.not-found p {
  color: var(--text-muted);
  margin-bottom: 24px;
}

.back-link {
  display: inline-block;
  padding: 10px 24px;
  background: var(--accent);
  color: white;
  border-radius: 8px;
  font-weight: 600;
}
</style>
