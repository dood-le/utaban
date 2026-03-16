<template>
  <div class="home">
    <section class="hero">
      <div class="hero-inner">
        <span class="hero-badge">Music Theory Dictionary</span>
        <h1 class="hero-title">音楽理論辞典</h1>
        <p class="hero-subtitle">
          作曲・編曲に役立つ音楽理論を<br />インタラクティブに学ぼう
        </p>
        <div class="hero-search">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="キーワードを検索... (例: コード、スケール)"
            class="search-input"
            @input="onSearch"
          />
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">{{ totalEntries }}</span>
            <span class="stat-label">トピック</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">{{ categories.length }}</span>
            <span class="stat-label">カテゴリ</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">{{ totalDemos }}</span>
            <span class="stat-label">サウンドデモ</span>
          </div>
        </div>
      </div>
    </section>

    <!-- クイックリンク -->
    <section v-if="!searchQuery" class="quick-links">
      <NuxtLink to="/dtm" class="quick-card quick-dtm">
        <span class="quick-icon">🎹</span>
        <div>
          <h3 class="quick-title">DTMステップシーケンサー</h3>
          <p class="quick-desc">ブラウザ上で作曲体験</p>
        </div>
      </NuxtLink>
      <NuxtLink to="/songs" class="quick-card quick-songs">
        <span class="quick-icon">🎶</span>
        <div>
          <h3 class="quick-title">MIDIライブラリ</h3>
          <p class="quick-desc">みんなの作品を試聴・共有</p>
        </div>
      </NuxtLink>
      <NuxtLink to="/community" class="quick-card quick-community">
        <span class="quick-icon">💬</span>
        <div>
          <h3 class="quick-title">コミュニティ</h3>
          <p class="quick-desc">質問・Tips・作品を共有</p>
        </div>
      </NuxtLink>
      <a href="#categories" class="quick-card quick-dict" @click.prevent="scrollToCategories">
        <span class="quick-icon">📖</span>
        <div>
          <h3 class="quick-title">理論辞典</h3>
          <p class="quick-desc">{{ totalEntries }}のトピックを探索</p>
        </div>
      </a>
    </section>

    <!-- 検索結果 -->
    <section v-if="searchQuery && searchResults.length > 0" class="section">
      <h2 class="section-title">検索結果 ({{ searchResults.length }}件)</h2>
      <div class="card-grid">
        <TheoryCard v-for="entry in searchResults" :key="entry.slug" :entry="entry" />
      </div>
    </section>
    <section v-else-if="searchQuery && searchResults.length === 0" class="section">
      <p class="no-results">「{{ searchQuery }}」に一致する項目が見つかりませんでした。</p>
    </section>

    <!-- カテゴリ一覧 -->
    <section v-if="!searchQuery" id="categories" class="section">
      <div v-for="category in categories" :key="category.id" class="category-section">
        <div class="category-header">
          <span class="category-icon">{{ category.icon }}</span>
          <div>
            <h2 class="category-name">{{ category.name }}</h2>
            <p class="category-desc">{{ category.description }}</p>
          </div>
        </div>
        <div class="card-grid">
          <TheoryCard
            v-for="entry in getEntriesByCategory(category.id)"
            :key="entry.slug"
            :entry="entry"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { getCategories, getEntries, getEntriesByCategory, searchEntries } = useTheoryDictionary()

const categories = getCategories()
const allEntries = getEntries()
const totalEntries = allEntries.length
const totalDemos = allEntries.filter((e) => e.audioDemo).length

const searchQuery = ref('')
const searchResults = ref<ReturnType<typeof searchEntries>>([])

function onSearch() {
  if (searchQuery.value.trim()) {
    searchResults.value = searchEntries(searchQuery.value.trim())
  } else {
    searchResults.value = []
  }
}

function scrollToCategories() {
  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
}

useHead({
  title: '音楽理論辞典 - 作曲理論をインタラクティブに学ぶ',
})
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #a78bfa 70%, #c084fc 100%);
  border-radius: 20px;
  padding: 56px 32px 48px;
  text-align: center;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 32px;
  line-height: 1.7;
}

.hero-search {
  max-width: 480px;
  margin: 0 auto 28px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 44px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 14px;
  color: #fff;
  font-size: 15px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.5);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-num {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
}

/* Quick Links */
.quick-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 32px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 14px;
  text-decoration: none;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  transition: all 0.2s;
}

.quick-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}

.quick-dtm:hover { border-color: #6366f1; }
.quick-songs:hover { border-color: #ec4899; }
.quick-community:hover { border-color: #10b981; }
.quick-dict:hover { border-color: #f59e0b; }

.quick-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.quick-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.quick-desc {
  font-size: 13px;
  color: var(--text-muted);
}

/* Sections */
.section {
  margin-top: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.no-results {
  text-align: center;
  color: var(--text-dimmed);
  padding: 40px 0;
}

.category-section {
  margin-bottom: 40px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.category-icon {
  font-size: 32px;
}

.category-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.category-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 2px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .hero {
    padding: 40px 20px 36px;
    border-radius: 16px;
  }
  .hero-title { font-size: 32px; }
  .hero-subtitle { font-size: 15px; }
  .quick-links {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-stats { gap: 16px; }
  .stat-num { font-size: 20px; }
}
</style>
