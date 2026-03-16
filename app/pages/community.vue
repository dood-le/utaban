<template>
  <div class="community-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">コミュニティ</h1>
        <p class="page-desc">音楽理論の疑問や発見を共有しよう</p>
      </div>
      <button v-if="user" class="new-post-btn" @click="showForm = !showForm">
        {{ showForm ? '✕ 閉じる' : '＋ 投稿する' }}
      </button>
      <NuxtLink v-else to="/login" class="new-post-btn">ログインして投稿</NuxtLink>
    </div>

    <!-- 投稿フォーム -->
    <div v-if="showForm && user" class="post-form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <select v-model="newCategory" class="form-select">
            <option value="question">❓ 質問</option>
            <option value="tip">💡 Tips</option>
            <option value="showcase">🎵 作品紹介</option>
            <option value="discussion">💬 議論</option>
          </select>
        </div>
        <input
          v-model="newTitle"
          type="text"
          class="form-input"
          placeholder="タイトル"
          required
          maxlength="100"
        />
        <textarea
          v-model="newBody"
          class="form-textarea"
          placeholder="本文を入力..."
          required
          rows="4"
          maxlength="2000"
        />
        <div class="form-actions">
          <span class="char-count">{{ newBody.length }} / 2000</span>
          <button type="submit" class="submit-btn">投稿する</button>
        </div>
      </form>
    </div>

    <!-- カテゴリフィルタ -->
    <div class="filter-tabs">
      <button
        class="filter-tab"
        :class="{ active: filter === null }"
        @click="filter = null"
      >
        すべて ({{ posts.length }})
      </button>
      <button
        v-for="cat in categoryOptions"
        :key="cat.id"
        class="filter-tab"
        :class="{ active: filter === cat.id }"
        @click="filter = cat.id"
      >
        {{ cat.icon }} {{ cat.label }}
      </button>
    </div>

    <!-- 投稿一覧 -->
    <div class="posts-list">
      <div v-for="post in filteredPosts" :key="post.id" class="post-card">
        <div class="post-header">
          <span class="post-cat-badge" :class="'cat-' + post.category">
            {{ getCatIcon(post.category) }} {{ getCatLabel(post.category) }}
          </span>
          <span class="post-date">{{ formatDate(post.createdAt) }}</span>
        </div>
        <h3 class="post-title">{{ post.title }}</h3>
        <p class="post-body">{{ post.body }}</p>
        <div v-if="post.songData" class="post-song-badge">
          <span class="song-info-label">DTM作品データ付き</span>
          <button class="load-dtm-btn" @click="loadInDtm(post.songData)">DTMで開く</button>
        </div>
        <div class="post-footer">
          <span class="post-author">{{ post.author }}</span>
          <button class="like-btn" @click="likePost(post.id)">
            ♥ {{ post.likes }}
          </button>
        </div>
      </div>
    </div>

    <p v-if="filteredPosts.length === 0" class="empty-state">
      まだ投稿がありません。最初の投稿をしてみましょう！
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/composables/useCommunity'

const router = useRouter()
const { user } = useAuth()
const { posts, initPosts, addPost, likePost } = useCommunity()
const loadSongState = useState<any>('dtm-load-song', () => null)

const showForm = ref(false)
const filter = ref<string | null>(null)
const newTitle = ref('')
const newBody = ref('')
const newCategory = ref<Post['category']>('question')

const categoryOptions = [
  { id: 'question', icon: '❓', label: '質問' },
  { id: 'tip', icon: '💡', label: 'Tips' },
  { id: 'showcase', icon: '🎵', label: '作品紹介' },
  { id: 'discussion', icon: '💬', label: '議論' },
]

const filteredPosts = computed(() => {
  if (!filter.value) return posts.value
  return posts.value.filter((p) => p.category === filter.value)
})

function getCatIcon(cat: string) {
  return categoryOptions.find((c) => c.id === cat)?.icon || ''
}

function getCatLabel(cat: string) {
  return categoryOptions.find((c) => c.id === cat)?.label || ''
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

function loadInDtm(songData: any) {
  if (!songData) return
  loadSongState.value = songData
  router.push('/dtm')
}

function handleSubmit() {
  if (!user.value || !newTitle.value.trim() || !newBody.value.trim()) return
  addPost({
    author: user.value.name,
    title: newTitle.value.trim(),
    body: newBody.value.trim(),
    category: newCategory.value,
  })
  newTitle.value = ''
  newBody.value = ''
  showForm.value = false
}

onMounted(() => {
  initPosts()
})

useHead({ title: 'コミュニティ - 音楽理論辞典' })
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.page-desc {
  color: var(--text-muted);
  font-size: 14px;
}

.new-post-btn {
  display: inline-block;
  padding: 10px 20px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.new-post-btn:hover { opacity: 0.9; transform: translateY(-1px); }

.post-form-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.post-form-card form { display: flex; flex-direction: column; gap: 12px; }

.form-row { display: flex; gap: 12px; }

.form-select {
  padding: 10px 14px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
}

.form-input {
  padding: 12px 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus { border-color: var(--accent); }
.form-input::placeholder { color: var(--text-dimmed); }

.form-textarea {
  padding: 12px 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-textarea:focus { border-color: var(--accent); }
.form-textarea::placeholder { color: var(--text-dimmed); }

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

.filter-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 20px;
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

.filter-tab:hover { border-color: var(--accent); color: var(--accent); }

.filter-tab.active {
  background: var(--accent-bg);
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 600;
}

.posts-list { display: flex; flex-direction: column; gap: 12px; }

.post-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
}

.post-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.post-cat-badge {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.cat-question { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.cat-tip { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.cat-showcase { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.cat-discussion { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }

.post-date {
  font-size: 12px;
  color: var(--text-dimmed);
}

.post-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.post-body {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 12px;
  white-space: pre-wrap;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-author {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.like-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 4px 14px;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.like-btn:hover {
  color: #e74c3c;
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.06);
}

.post-song-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  padding: 8px 14px;
  margin-bottom: 12px;
}

.song-info-label {
  font-size: 13px;
  color: #6366f1;
  font-weight: 600;
}

.load-dtm-btn {
  padding: 6px 16px;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.load-dtm-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  color: var(--text-dimmed);
  padding: 60px 0;
  font-size: 15px;
}
</style>
