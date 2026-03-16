<template>
  <span class="term-linked-text" v-html="linkedHtml" @click="handleClick" />
  <Teleport to="body">
    <div
      v-if="tooltip.visible"
      class="term-tooltip"
      :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
      @click.stop
    >
      <div class="term-tooltip-header">
        <NuxtLink :to="`/theory/${tooltip.slug}`" class="term-tooltip-title">
          {{ tooltip.title }}
        </NuxtLink>
        <button class="term-tooltip-close" @click="closeTooltip">&times;</button>
      </div>
      <p class="term-tooltip-desc">{{ tooltip.description }}</p>
      <NuxtLink :to="`/theory/${tooltip.slug}`" class="term-tooltip-link">
        詳しく見る &rarr;
      </NuxtLink>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  html: string
  currentSlug?: string
}>()

const { getEntries, getEntry } = useTheoryDictionary()

const tooltip = reactive({
  visible: false,
  slug: '',
  title: '',
  description: '',
  x: 0,
  y: 0,
})

const linkedHtml = computed(() => {
  const allEntries = getEntries()
  let result = props.html

  const termMap: { title: string; slug: string }[] = []
  for (const entry of allEntries) {
    if (entry.slug === props.currentSlug) continue
    const mainTitle = entry.title.replace(/（.+?）/, '').trim()
    termMap.push({ title: mainTitle, slug: entry.slug })
    const paren = entry.title.match(/（(.+?)）/)
    if (paren) {
      termMap.push({ title: paren[1], slug: entry.slug })
    }
  }

  termMap.sort((a, b) => b.title.length - a.title.length)

  const linked = new Set<string>()

  for (const term of termMap) {
    if (linked.has(term.slug)) continue
    const escaped = term.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(?<![a-zA-Z/>"\\w])${escaped}(?![<\\w])`, 'g')

    let replaced = false
    result = result.replace(regex, (match) => {
      if (replaced) return match
      replaced = true
      linked.add(term.slug)
      return `<span class="term-link" data-slug="${term.slug}">${match}</span>`
    })
  }

  return result
})

function handleClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.classList.contains('term-link')) return

  const slug = target.dataset.slug
  if (!slug) return

  const entry = getEntry(slug)
  if (!entry) return

  const rect = target.getBoundingClientRect()

  tooltip.slug = slug
  tooltip.title = entry.title
  tooltip.description = entry.shortDescription
  tooltip.x = Math.min(rect.left, window.innerWidth - 320)
  tooltip.y = rect.bottom + window.scrollY + 8
  tooltip.visible = true
}

function closeTooltip() {
  tooltip.visible = false
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.term-tooltip') && !target.classList.contains('term-link')) {
    tooltip.visible = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.term-linked-text :deep(.term-link) {
  color: var(--accent-light, #818cf8);
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 3px;
  cursor: pointer;
  transition: color 0.15s;
}

.term-linked-text :deep(.term-link:hover) {
  color: var(--accent, #6366f1);
  text-decoration-style: solid;
}

.term-tooltip {
  position: absolute;
  z-index: 9999;
  background: var(--card-bg, #1e1e2e);
  border: 1px solid var(--border-color, #333);
  border-radius: 10px;
  padding: 14px 16px;
  width: 300px;
  max-width: calc(100vw - 32px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  animation: tooltip-in 0.15s ease-out;
}

@keyframes tooltip-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.term-tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.term-tooltip-title {
  font-weight: 700;
  font-size: 15px;
  color: var(--accent-pale, #a5b4fc);
  text-decoration: none;
}

.term-tooltip-title:hover {
  text-decoration: underline;
}

.term-tooltip-close {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--text-muted, #888);
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.term-tooltip-desc {
  font-size: 13px;
  color: var(--text-secondary, #aaa);
  line-height: 1.6;
  margin-bottom: 8px;
}

.term-tooltip-link {
  font-size: 12px;
  color: var(--accent, #6366f1);
  text-decoration: none;
  font-weight: 600;
}

.term-tooltip-link:hover {
  text-decoration: underline;
}
</style>
