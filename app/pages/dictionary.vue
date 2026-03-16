<template>
  <div class="dictionary">
    <h1 class="page-title">用語辞典</h1>
    <p class="page-desc">
      キーワードをクリックすると、詳しい解説とサウンドデモを確認できます。
    </p>

    <div class="search-bar">
      <input
        v-model="query"
        type="text"
        placeholder="用語を検索..."
        class="search-input"
      />
    </div>

    <div class="filter-tabs">
      <button
        class="filter-tab"
        :class="{ active: selectedCategory === null }"
        @click="selectedCategory = null"
      >
        すべて ({{ allEntries.length }})
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="filter-tab"
        :class="{ active: selectedCategory === cat.id }"
        @click="selectedCategory = cat.id"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>

    <div class="entries-list">
      <NuxtLink
        v-for="entry in filteredEntries"
        :key="entry.slug"
        :to="`/theory/${entry.slug}`"
        class="entry-row"
      >
        <div class="entry-info">
          <span class="entry-title">{{ entry.title }}</span>
          <span class="entry-desc">{{ entry.shortDescription }}</span>
        </div>
        <div class="entry-meta">
          <span class="entry-cat">{{ getCategoryName(entry.category) }}</span>
          <span v-if="entry.audioDemo" class="entry-audio">&#9835;</span>
          <span v-if="entry.demoSongs?.length" class="entry-song">&#9834;</span>
          <span class="entry-arrow">&rarr;</span>
        </div>
      </NuxtLink>
    </div>

    <p v-if="filteredEntries.length === 0" class="no-results">
      一致する用語が見つかりません。
    </p>
  </div>
</template>

<script setup lang="ts">
const { getCategories, getEntries, getCategory, searchEntries, getEntriesByCategory } = useTheoryDictionary()

const categories = getCategories()
const allEntries = getEntries()

const query = ref('')
const selectedCategory = ref<string | null>(null)

const filteredEntries = computed(() => {
  let results = allEntries
  if (selectedCategory.value) {
    results = getEntriesByCategory(selectedCategory.value)
  }
  if (query.value.trim()) {
    const searched = searchEntries(query.value.trim())
    results = results.filter((e) => searched.some((s) => s.slug === e.slug))
  }
  return results
})

function getCategoryName(id: string) {
  return getCategory(id)?.name || ''
}

useHead({ title: '用語辞典 - 音楽理論辞典' })
</script>

<style scoped>
.page-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.page-desc {
  color: var(--text-muted);
  margin-bottom: 24px;
}

.search-bar {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  background: var(--search-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s, background 0.3s;
}

.search-input:focus {
  border-color: var(--accent);
}

.search-input::placeholder {
  color: var(--text-dimmed);
}

.filter-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.filter-tab {
  padding: 6px 14px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  border-color: var(--accent);
  color: var(--accent-pale);
}

.filter-tab.active {
  background: var(--accent-bg);
  border-color: var(--accent);
  color: var(--accent-pale);
  font-weight: 600;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.entry-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.15s;
}

.entry-row:hover {
  background: var(--hover-bg);
}

.entry-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.entry-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.entry-desc {
  font-size: 13px;
  color: var(--text-dimmed);
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.entry-cat {
  font-size: 12px;
  color: var(--text-dimmed);
  background: var(--bg-secondary);
  padding: 3px 8px;
  border-radius: 4px;
}

.entry-audio {
  color: var(--accent);
  font-size: 14px;
}

.entry-song {
  color: #f0a050;
  font-size: 14px;
}

.entry-arrow {
  color: var(--text-dimmed);
  font-size: 16px;
}

.no-results {
  text-align: center;
  color: var(--text-dimmed);
  padding: 40px 0;
}
</style>
