<template>
  <NuxtLink
    v-if="entry"
    :to="`/theory/${slug}`"
    class="keyword-link"
    :title="entry.shortDescription"
  >
    <span class="keyword-text">{{ entry.title }}</span>
    <span class="keyword-badge">{{ getCategoryIcon(entry.category) }}</span>
  </NuxtLink>
  <span v-else class="keyword-unknown">{{ slug }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  slug: string
}>()

const { getEntry, getCategory } = useTheoryDictionary()
const entry = computed(() => getEntry(props.slug))

function getCategoryIcon(categoryId: string) {
  const cat = getCategory(categoryId)
  return cat?.icon || '📖'
}
</script>

<style scoped>
.keyword-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  background: var(--accent-bg);
  border: 1px solid var(--accent-bg);
  border-radius: 6px;
  color: var(--accent-light);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.keyword-link:hover {
  background: var(--hover-bg);
  border-color: var(--accent);
  color: var(--accent-pale);
  transform: translateY(-1px);
}

.keyword-text {
  font-weight: 500;
}

.keyword-badge {
  font-size: 12px;
}

.keyword-unknown {
  color: var(--text-dimmed);
  font-style: italic;
}
</style>
