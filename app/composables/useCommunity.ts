export interface SongData {
  tracks: any[]
  bpm: number
  scale: string
  rootNote: number
  totalSteps: number
}

export interface Post {
  id: number
  author: string
  title: string
  body: string
  category: 'question' | 'tip' | 'showcase' | 'discussion'
  createdAt: string
  likes: number
  songData?: SongData
}

const STORAGE_KEY = 'community-posts'

const defaultPosts: Post[] = [
  {
    id: 1,
    author: 'たくみ',
    title: 'II-V-Iの練習方法について',
    body: 'ジャズピアノ初心者です。II-V-Iを全12キーで練習するコツがあれば教えてください。五度圏に沿って練習するのが良いと聞きましたが、皆さんはどうしていますか？',
    category: 'question',
    createdAt: '2026-03-15T10:30:00',
    likes: 5,
  },
  {
    id: 2,
    author: 'あかね',
    title: 'サブドミナントマイナーの使い方TIPS',
    body: 'メジャーキーの曲でサビの最後にIVmを入れると、一気に切なさが増します。J-POPでよく使われるテクニック。例えばCキーならFmを入れてみてください。Creepのコード進行も参考になります。',
    category: 'tip',
    createdAt: '2026-03-14T18:00:00',
    likes: 12,
  },
  {
    id: 3,
    author: 'けんた',
    title: 'DTMで作ったブルース進行',
    body: 'このサイトのDTM機能でブルーススケールを使った12小節ブルースを作ってみました。ブルーノートの♭5thを入れるだけで一気にそれっぽくなりますね！',
    category: 'showcase',
    createdAt: '2026-03-13T22:15:00',
    likes: 8,
  },
]

export function useCommunity() {
  const posts = useState<Post[]>('community-posts', () => [])

  function initPosts() {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          posts.value = JSON.parse(saved)
        } catch {
          posts.value = defaultPosts
        }
      } else {
        posts.value = defaultPosts
      }
    }
  }

  function addPost(post: Omit<Post, 'id' | 'createdAt' | 'likes'>) {
    const newPost: Post = {
      ...post,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      likes: 0,
    }
    posts.value = [newPost, ...posts.value]
    savePosts()
  }

  function likePost(id: number) {
    const post = posts.value.find((p) => p.id === id)
    if (post) {
      post.likes++
      savePosts()
    }
  }

  function savePosts() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts.value))
    }
  }

  return { posts, initPosts, addPost, likePost }
}
