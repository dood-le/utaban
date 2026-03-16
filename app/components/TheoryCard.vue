<template>
  <NuxtLink :to="`/theory/${entry.slug}`" class="theory-card">
    <div class="card-category">{{ categoryName }}</div>
    <h3 class="card-title">{{ entry.title }}</h3>
    <p class="card-desc">{{ entry.shortDescription }}</p>
    <div class="card-badges">
      <span v-if="entry.audioDemo" class="card-badge">&#9835; サウンドデモ</span>
      <span v-if="entry.demoSongs?.length" class="card-badge song-badge">&#9834; デモ曲</span>
      <span v-if="entry.songExamples?.length" class="card-badge examples-badge">&#9836; 楽曲例 {{ entry.songExamples.length }}曲</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { TheoryEntry } from '~/composables/useTheoryDictionary'

const props = defineProps<{
  entry: TheoryEntry
}>()

const { getCategory } = useTheoryDictionary()
const categoryName = computed(() => getCategory(props.entry.category)?.name || '')
</script>

<style scoped>
.theory-card {
  display: block;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s;
}

.theory-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--accent-bg);
}

.card-category {
  font-size: 12px;
  color: var(--accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
}

.card-badges {
  margin-top: 12px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.card-badge {
  display: inline-block;
  font-size: 12px;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.song-badge {
  color: #d97706;
  background: rgba(217, 119, 6, 0.1);
}

.examples-badge {
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
}
</style>
