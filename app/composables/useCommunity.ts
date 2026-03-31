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
    songData: {
      bpm: 90,
      scale: 'blues',
      rootNote: 60,
      totalSteps: 32,
      tracks: [
        { name: 'Piano', instrument: 'piano', volume: 0.7, muted: false, gridData: { 60: { 0: true, 4: true, 8: true, 12: true, 16: true, 20: true, 24: true, 28: true }, 63: { 2: true, 10: true, 18: true, 26: true }, 65: { 4: true, 12: true, 20: true, 28: true }, 66: { 6: true, 14: true }, 67: { 8: true, 16: true, 24: true } } },
        { name: 'Bass', instrument: 'bass', volume: 0.8, muted: false, gridData: { 48: { 0: true, 8: true, 16: true, 24: true }, 51: { 4: true, 12: true }, 53: { 20: true, 28: true } } },
      ],
    },
  },
  {
    id: 4,
    author: 'ゆうき',
    title: 'ドリアンスケールでおしゃれなコード進行',
    body: 'ドリアンモードを使うとマイナーなのにどこか明るい響きが出せます。Im7 → IV7 の繰り返しだけでもかなりおしゃれ。Pharrell Williamsの「Get Lucky」もドリアンですよね。Lo-Fiやネオソウル系にもおすすめです。',
    category: 'tip',
    createdAt: '2026-03-13T14:20:00',
    likes: 18,
  },
  {
    id: 5,
    author: 'みさき',
    title: 'テンションコードの入門におすすめの曲',
    body: '9thや13thなどのテンションコードに興味があるのですが、実際の楽曲で分かりやすく使われている例を教えてほしいです。ジャズだけでなくポップスでも使われている曲があれば嬉しいです。',
    category: 'question',
    createdAt: '2026-03-12T20:45:00',
    likes: 7,
  },
  {
    id: 6,
    author: 'りょう',
    title: '転調テクニック：半音上げの効果',
    body: 'サビのリピートで半音上に転調するテクニック、J-POPでは定番ですよね。ラストサビで感動を高めたいときに使えます。ポイントは転調直前にドミナント（転調先のV7）を入れること。自然に繋がります。',
    category: 'tip',
    createdAt: '2026-03-12T16:30:00',
    likes: 22,
  },
  {
    id: 7,
    author: 'はるか',
    title: '初めてDTMで曲を完成させました！',
    body: 'このサイトのDTM機能で初めて1曲通して作りました。Cメジャーの王道進行（I-V-VIm-IV）にペンタトニックでメロディを乗せただけですが、ちゃんと曲っぽくなって感動しました。次はセカンダリードミナントに挑戦したいです！',
    category: 'showcase',
    createdAt: '2026-03-11T21:00:00',
    likes: 31,
    songData: {
      bpm: 120,
      scale: 'major',
      rootNote: 60,
      totalSteps: 32,
      tracks: [
        { name: 'Melody', instrument: 'piano', volume: 0.6, muted: false, gridData: { 72: { 0: true, 1: true }, 71: { 2: true }, 69: { 3: true, 4: true }, 67: { 6: true, 7: true }, 69: { 8: true, 9: true }, 72: { 10: true }, 74: { 12: true, 13: true, 14: true }, 72: { 16: true, 17: true }, 71: { 18: true }, 69: { 20: true, 21: true }, 67: { 22: true }, 65: { 24: true, 25: true, 26: true, 27: true, 28: true, 29: true, 30: true, 31: true } } },
        { name: 'Chords', instrument: 'strings', volume: 0.5, muted: false, gridData: { 60: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true }, 64: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true }, 67: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true }, 55: { 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true }, 59: { 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true }, 62: { 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true } } },
        { name: 'Bass', instrument: 'bass', volume: 0.7, muted: false, gridData: { 48: { 0: true, 4: true }, 43: { 8: true, 12: true }, 45: { 16: true, 20: true }, 41: { 24: true, 28: true } } },
      ],
    },
  },
  {
    id: 8,
    author: 'そうた',
    title: 'メロディックマイナーとハーモニックマイナーの使い分け',
    body: 'マイナーキーで作曲するとき、ナチュラル・ハーモニック・メロディックの3つのマイナースケールの使い分けがいまいち分かりません。理論書には「上行はメロディック、下行はナチュラル」と書いてありますが、実際のポップスではどう使われていますか？',
    category: 'question',
    createdAt: '2026-03-11T09:15:00',
    likes: 9,
  },
  {
    id: 9,
    author: 'なな',
    title: 'ベースラインの作り方：ルート以外の音を使う',
    body: 'ベースがずっとルート音だけだと単調になりがち。3度や5度を経過音として入れたり、クロマチックアプローチ（半音で次のルートに向かう）を使うと一気にプロっぽくなります。ウォーキングベースの基本にもなるテクニックです。',
    category: 'tip',
    createdAt: '2026-03-10T17:40:00',
    likes: 15,
  },
  {
    id: 10,
    author: 'だいち',
    title: 'ミクソリディアンでファンクっぽい曲を作ってみた',
    body: 'ミクソリディアンモード（メジャースケールの7度を半音下げたもの）を使ってファンクっぽい曲をDTMで作りました。I7一発でカッティングギター風のリズムを刻むだけでもグルーヴ感が出ます。ベースは16分音符のスラップ風にしてみました。',
    category: 'showcase',
    createdAt: '2026-03-10T12:00:00',
    likes: 14,
    songData: {
      bpm: 110,
      scale: 'mixolydian',
      rootNote: 55,
      totalSteps: 32,
      tracks: [
        { name: 'Guitar', instrument: 'guitar', volume: 0.7, muted: false, gridData: { 55: { 0: true, 2: true, 4: true, 6: true, 8: true, 10: true, 12: true, 14: true, 16: true, 18: true, 20: true, 22: true, 24: true, 26: true, 28: true, 30: true }, 59: { 0: true, 4: true, 8: true, 12: true, 16: true, 20: true, 24: true, 28: true }, 62: { 0: true, 4: true, 8: true, 12: true, 16: true, 20: true, 24: true, 28: true } } },
        { name: 'Bass', instrument: 'bass', volume: 0.8, muted: false, gridData: { 43: { 0: true, 1: true, 3: true, 4: true, 6: true, 7: true, 8: true, 10: true, 12: true, 13: true, 15: true, 16: true, 18: true, 19: true, 20: true, 22: true, 24: true, 25: true, 27: true, 28: true, 30: true, 31: true } } },
        { name: 'Drums', instrument: 'kick', volume: 0.9, muted: false, gridData: { 36: { 0: true, 4: true, 8: true, 12: true, 16: true, 20: true, 24: true, 28: true }, 38: { 2: true, 6: true, 10: true, 14: true, 18: true, 22: true, 26: true, 30: true } } },
      ],
    },
  },
  {
    id: 11,
    author: 'えみ',
    title: '対位法って独学で学べますか？',
    body: 'バッハのインヴェンションを聴いて対位法に興味を持ちました。独学で学ぶには何から始めればいいですか？おすすめの教材や、このサイトの辞典で読むべき項目があれば教えてください。',
    category: 'question',
    createdAt: '2026-03-09T19:30:00',
    likes: 6,
  },
  {
    id: 12,
    author: 'こうへい',
    title: 'コード進行の「裏コード」活用法',
    body: 'ドミナント7thコードのトライトーン（増4度）を共有する関係を利用して、V7の代わりに♭II7を使うテクニックです。例えばCキーのG7の代わりにD♭7を使う。ジャズだけでなくシティポップでも使われています。響きがグッと都会的になりますよ。',
    category: 'tip',
    createdAt: '2026-03-09T11:20:00',
    likes: 25,
  },
  {
    id: 13,
    author: 'さくら',
    title: 'アンビエント系の作曲に挑戦',
    body: 'ホールトーンスケールを使ってアンビエントっぽい曲を作ってみました。全音音階だと調性感が薄れて浮遊感が出ます。リバーブを深めにかけて、ゆったりしたテンポで和音を重ねるだけでも雰囲気が出ます。瞑想BGMにも良さそう。',
    category: 'showcase',
    createdAt: '2026-03-08T23:00:00',
    likes: 11,
    songData: {
      bpm: 70,
      scale: 'wholeTone',
      rootNote: 60,
      totalSteps: 32,
      tracks: [
        { name: 'Pad', instrument: 'strings', volume: 0.4, muted: false, gridData: { 60: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true }, 64: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true }, 68: { 16: true, 17: true, 18: true, 19: true, 20: true, 21: true, 22: true, 23: true, 24: true, 25: true, 26: true, 27: true, 28: true, 29: true, 30: true, 31: true }, 66: { 16: true, 17: true, 18: true, 19: true, 20: true, 21: true, 22: true, 23: true, 24: true, 25: true, 26: true, 27: true, 28: true, 29: true, 30: true, 31: true } } },
        { name: 'Bell', instrument: 'piano', volume: 0.3, muted: false, gridData: { 72: { 0: true, 8: true, 16: true, 24: true }, 76: { 4: true, 12: true, 20: true, 28: true } } },
      ],
    },
  },
  {
    id: 14,
    author: 'ゆうと',
    title: 'DAWとこのサイトのDTM機能の連携について',
    body: 'このサイトのDTM機能で作ったフレーズをDAW（Ableton Live）に持っていく良い方法はありますか？MIDIエクスポート機能があれば最高なのですが…。今はピアノロールを見ながら手打ちしています。',
    category: 'discussion',
    createdAt: '2026-03-08T15:45:00',
    likes: 19,
  },
  {
    id: 15,
    author: 'あおい',
    title: 'コード理論を知らなくても作曲できる？',
    body: '音楽理論を全く知らない状態で曲を作り始めましたが、やっぱり理論は必要でしょうか？感覚だけで作る限界を感じています。でもどこから勉強すればいいか分からない…。このサイトの辞典を一通り読めば基礎は身につきますか？',
    category: 'discussion',
    createdAt: '2026-03-07T20:10:00',
    likes: 28,
  },
  {
    id: 16,
    author: 'れん',
    title: 'ペンタトニックだけでメロディは作れる',
    body: 'メロディ作りに悩んでいる人へ。まずはペンタトニックスケール（5音）だけで作ってみてください。音が少ない分ハズレの音が出にくく、どんなコード進行にも合いやすいです。演歌もロックもブルースもペンタが基本。慣れたら経過音を足していけばOK。',
    category: 'tip',
    createdAt: '2026-03-07T13:25:00',
    likes: 35,
  },
  {
    id: 17,
    author: 'まこと',
    title: 'フリジアンモードでダークな曲を作った',
    body: 'フリジアンスケールの♭2度が生み出す独特の緊張感がクセになります。メタルやフラメンコで多用されるスケールですが、エレクトロニカに応用してみました。Im → ♭II のコード進行を繰り返すだけでかなり雰囲気が出ます。',
    category: 'showcase',
    createdAt: '2026-03-06T18:50:00',
    likes: 16,
    songData: {
      bpm: 85,
      scale: 'phrygian',
      rootNote: 64,
      totalSteps: 32,
      tracks: [
        { name: 'Synth', instrument: 'synth', volume: 0.6, muted: false, gridData: { 64: { 0: true, 1: true, 2: true, 3: true, 8: true, 9: true, 10: true, 11: true, 16: true, 17: true, 18: true, 19: true, 24: true, 25: true, 26: true, 27: true }, 65: { 4: true, 5: true, 6: true, 7: true, 12: true, 13: true, 14: true, 15: true, 20: true, 21: true, 22: true, 23: true, 28: true, 29: true, 30: true, 31: true } } },
        { name: 'Lead', instrument: 'piano', volume: 0.5, muted: false, gridData: { 76: { 0: true, 2: true }, 75: { 4: true }, 73: { 6: true, 8: true }, 71: { 10: true }, 69: { 12: true, 14: true }, 76: { 16: true, 18: true }, 75: { 20: true }, 73: { 22: true, 24: true }, 71: { 26: true }, 64: { 28: true, 29: true, 30: true, 31: true } } },
        { name: 'Bass', instrument: 'bass', volume: 0.8, muted: false, gridData: { 52: { 0: true, 4: true, 8: true, 12: true }, 53: { 16: true, 20: true, 24: true, 28: true } } },
      ],
    },
  },
  {
    id: 18,
    author: 'ひなた',
    title: 'リハーモナイゼーションのコツを教えて',
    body: '既存の曲のコード進行をリハーモナイズ（別のコードに置き換え）する練習をしています。メロディの音がコードトーンやテンションに合っていれば置き換えOKという理解で合っていますか？上手くやるコツがあれば知りたいです。',
    category: 'question',
    createdAt: '2026-03-06T10:00:00',
    likes: 8,
  },
]

export function useCommunity() {
  const posts = useState<Post[]>('community-posts', () => [])

  function isValidPost(p: any): p is Post {
    return p && typeof p.id === 'number' && typeof p.author === 'string' && typeof p.title === 'string' && typeof p.body === 'string' && validCategories.includes(p.category) && typeof p.createdAt === 'string' && typeof p.likes === 'number'
  }

  function initPosts() {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          if (saved.length > 5_000_000) {
            posts.value = defaultPosts
            return
          }
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.every(isValidPost)) {
            posts.value = parsed
          } else {
            posts.value = defaultPosts
          }
        } catch {
          posts.value = defaultPosts
        }
      } else {
        posts.value = defaultPosts
      }
    }
  }

  function sanitizeText(text: string): string {
    return text.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c))
  }

  const validCategories: Post['category'][] = ['question', 'tip', 'showcase', 'discussion']

  function addPost(post: Omit<Post, 'id' | 'createdAt' | 'likes'>) {
    const title = sanitizeText(post.title.trim()).slice(0, 100)
    const body = sanitizeText(post.body.trim()).slice(0, 2000)
    const author = sanitizeText(post.author.trim()).slice(0, 20)
    const category = validCategories.includes(post.category) ? post.category : 'discussion'

    if (!title || !body || !author) return

    const newPost: Post = {
      title,
      body,
      author,
      category,
      songData: post.songData,
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
