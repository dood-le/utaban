import type { Track } from './useDtmTracks'

export interface SharedSong {
  id: number
  title: string
  artist: string
  description: string
  genre: string
  bpm: number
  scale: string
  rootNote: number
  totalSteps: number
  tracks: Track[]
  likes: number
  plays: number
  createdAt: string
  article?: SongArticle
}

export interface SongArticle {
  summary: string
  theory: string
  structure: string
  tips: string
  relatedTerms: string[]
}

const STORAGE_KEY = 'song-library'

const SCALE_NAMES: Record<string, string> = {
  major: 'メジャー',
  minor: 'マイナー',
  pentatonic: 'ペンタトニック',
  blues: 'ブルース',
  dorian: 'ドリアン',
  mixolydian: 'ミクソリディアン',
  chromatic: 'クロマチック',
  phrygian: 'フリジアン',
  lydian: 'リディアン',
  harmonicMinor: 'ハーモニックマイナー',
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function midiToNoteName(midi: number): string {
  return NOTE_NAMES[midi % 12] + Math.floor(midi / 12 - 1)
}

function getScaleDisplayName(scale: string): string {
  return SCALE_NAMES[scale] || scale
}

// --- サンプル曲データ ---
function createSampleSongs(): SharedSong[] {
  return [
    // 1. さくらメロディ
    {
      id: 1,
      title: 'さくらメロディ',
      artist: 'サンプル太郎',
      description: '日本的なペンタトニックを使った穏やかなメロディ。春の風景をイメージした短い曲です。',
      genre: 'J-POP',
      bpm: 100,
      scale: 'pentatonic',
      rootNote: 60,
      totalSteps: 16,
      tracks: [
        {
          id: 'sample1_melody', name: 'メロディ', role: 'melody', instrument: 'lead',
          grid: { 72: { 0: true, 4: true, 12: true }, 69: { 2: true, 6: true, 14: true }, 67: { 1: true, 8: true, 10: true }, 64: { 3: true, 9: true, 13: true }, 60: { 5: true, 7: true, 11: true, 15: true } },
          muted: false, solo: false, volume: 0.8, color: '#6366f1',
        },
        {
          id: 'sample1_chords', name: 'コード', role: 'chords', instrument: 'pad',
          grid: { 60: { 0: true, 4: true, 8: true, 12: true }, 64: { 0: true, 4: true, 8: true, 12: true }, 67: { 0: true, 4: true, 8: true, 12: true } },
          muted: false, solo: false, volume: 0.4, color: '#10b981',
        },
        {
          id: 'sample1_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 48: { 0: true, 4: true, 8: true, 12: true }, 45: { 2: true, 6: true, 10: true, 14: true } },
          muted: false, solo: false, volume: 0.7, color: '#f59e0b',
        },
      ],
      likes: 24, plays: 89, createdAt: '2026-03-10T14:30:00',
      article: {
        summary: 'ペンタトニックスケール（5音音階）は日本の伝統音楽やJ-POPで頻繁に使われるスケールです。この曲ではCペンタトニック（C-D-E-G-A）を使い、和風の情緒を表現しています。',
        theory: 'ペンタトニックスケールはメジャースケールから4度と7度を除いた5音で構成されます。半音関係が無いため、どの音を組み合わせても不協和になりにくいのが最大の特徴です。この曲ではC-D-E-G-Aの5音のみを使用し、コード進行はCメジャー系のシンプルな構成にしています。',
        structure: 'メロディトラック: C5を頂点に、G4、E4、D4、C4へと下降する動き。4拍ごとに高い音に戻り、波のような形を描きます。\nコードトラック: Cメジャーコード（C-E-G）を4拍ごとに繰り返すシンプルなパッド。\nベーストラック: CとAの交互パターンで、安定感とペンタトニック感を同時に生み出しています。',
        tips: '・ペンタトニックは「外れにくい」スケールなので、即興練習にも最適です\n・4度（F）と7度（B）を避けるだけでメジャースケールからペンタトニックに変換できます\n・同じ音でもオクターブを変えるだけで全く異なる印象になります',
        relatedTerms: ['pentatonic', 'major-scale'],
      },
    },

    // 2. Midnight Blues
    {
      id: 2,
      title: 'Midnight Blues',
      artist: 'ブルースマン',
      description: 'ブルーススケールを使ったスローテンポのブルース。ブルーノート(♭5th)がポイント。',
      genre: 'Blues',
      bpm: 80,
      scale: 'blues',
      rootNote: 60,
      totalSteps: 16,
      tracks: [
        {
          id: 'sample2_melody', name: 'メロディ', role: 'melody', instrument: 'lead',
          grid: { 72: { 0: true, 8: true }, 70: { 2: true, 10: true }, 67: { 4: true, 12: true }, 66: { 5: true, 13: true }, 63: { 6: true, 14: true }, 60: { 7: true, 15: true } },
          muted: false, solo: false, volume: 0.8, color: '#6366f1',
        },
        {
          id: 'sample2_chords', name: 'コード', role: 'chords', instrument: 'organ',
          grid: { 60: { 0: true, 8: true }, 63: { 0: true, 8: true }, 67: { 0: true, 8: true }, 70: { 0: true, 8: true }, 58: { 4: true, 12: true }, 62: { 4: true, 12: true }, 65: { 4: true, 12: true } },
          muted: false, solo: false, volume: 0.4, color: '#10b981',
        },
        {
          id: 'sample2_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 36: { 0: true, 2: true, 4: true, 6: true, 8: true, 10: true, 12: true, 14: true }, 38: { 1: true, 5: true, 9: true, 13: true }, 41: { 3: true, 7: true, 11: true, 15: true } },
          muted: false, solo: false, volume: 0.7, color: '#f59e0b',
        },
      ],
      likes: 18, plays: 56, createdAt: '2026-03-12T20:00:00',
      article: {
        summary: 'ブルーススケールはマイナーペンタトニックに♭5th（ブルーノート）を加えた6音のスケールです。この独特の「憂い」のある響きがブルースの核心です。',
        theory: 'Cブルーススケール: C-E♭-F-F#-G-B♭。ポイントはF#（♭5th）で、これがブルース特有の「泣き」を生みます。コードはC7（I7）とF7（IV7）のドミナント7thコードを使い、ブルース感を強調しています。ブルースでは全てのコードを7thにするのが定番です。',
        structure: 'メロディ: C5から半音ずつ下降するブルージーなライン。ブルーノート(F#4)を経由してC4に着地。\nコード: C7→F7の2コード進行。オルガンの温かい音色がスモーキーな雰囲気を演出。\nベース: ウォーキングベース風に毎拍動くパターン。C-D-Fの3音で安定したグルーヴを作っています。',
        tips: '・ブルーノート（♭5th）は経過音として使うのがコツ。長く伸ばすと不安定になりすぎます\n・ブルースでは全コードにセブンスを付けるのが基本です\n・BPM 60〜90のスローテンポが最もブルースらしい雰囲気になります',
        relatedTerms: ['blues-scale', 'seventh-chord', 'pentatonic'],
      },
    },

    // 3. サイバー・ドリーム
    {
      id: 3,
      title: 'サイバー・ドリーム',
      artist: 'シンセ職人',
      description: 'シンセサイザーを使ったエレクトロニカ風の曲。ドリアンスケールの浮遊感がポイント。',
      genre: 'Electronica',
      bpm: 128,
      scale: 'dorian',
      rootNote: 62,
      totalSteps: 32,
      tracks: [
        {
          id: 'sample3_melody', name: 'メロディ', role: 'melody', instrument: 'synth',
          grid: { 74: { 0: true, 8: true, 16: true, 24: true }, 72: { 2: true, 10: true, 18: true }, 69: { 4: true, 12: true, 20: true, 28: true }, 67: { 6: true, 14: true, 22: true, 30: true }, 65: { 3: true, 11: true, 26: true }, 62: { 7: true, 15: true, 23: true, 31: true } },
          muted: false, solo: false, volume: 0.7, color: '#6366f1',
        },
        {
          id: 'sample3_chords', name: 'パッド', role: 'chords', instrument: 'pad',
          grid: { 62: { 0: true, 16: true }, 65: { 0: true, 16: true }, 69: { 0: true, 16: true }, 60: { 8: true, 24: true }, 64: { 8: true, 24: true }, 67: { 8: true, 24: true } },
          muted: false, solo: false, volume: 0.35, color: '#10b981',
        },
        {
          id: 'sample3_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 38: { 0: true, 4: true, 8: true, 12: true, 16: true, 20: true, 24: true, 28: true }, 41: { 2: true, 6: true, 10: true, 14: true, 18: true, 22: true, 26: true, 30: true } },
          muted: false, solo: false, volume: 0.7, color: '#f59e0b',
        },
        {
          id: 'sample3_rhythm', name: 'リズム', role: 'rhythm', instrument: 'marimba',
          grid: { 84: { 0: true, 4: true, 8: true, 12: true, 16: true, 20: true, 24: true, 28: true }, 80: { 2: true, 6: true, 10: true, 14: true, 18: true, 22: true, 26: true, 30: true }, 77: { 1: true, 5: true, 9: true, 13: true, 17: true, 21: true, 25: true, 29: true } },
          muted: false, solo: false, volume: 0.3, color: '#ef4444',
        },
      ],
      likes: 31, plays: 112, createdAt: '2026-03-14T09:15:00',
      article: {
        summary: 'ドリアンモードはマイナースケールの6番目の音を半音上げたスケールです。マイナーなのに明るさも感じる「浮遊感」が特徴で、ジャズやエレクトロニカで多用されます。',
        theory: 'Dドリアン: D-E-F-G-A-B-C。ナチュラルマイナー（Dマイナー: D-E-F-G-A-B♭-C）との違いは6度がB♭ではなくBであること。この半音の違いが明暗の中間的な響きを生みます。マイルス・デイヴィスの「So What」で有名になったモードです。',
        structure: 'メロディ: D5-C5-A4-G4-F4-D4の下降パターンを繰り返し。ドリアンの6度（B音）を意図的に避けることで、浮遊感を強調。\nパッド: Dm(D-F-A)とC(C-E-G)の2コード交互で、モーダルな雰囲気を維持。\nベース: DとFの交互パターン。ルートと短3度の動きがマイナー感を保ちつつ安定。\nリズム: マリンバの3音パターンで電子的なリズムを表現。',
        tips: '・ドリアンはマイナーキーの曲に「希望」や「浮遊感」を加えたいときに最適\n・コード進行はIm-♭VII（例: Dm-C）の2コードが最もドリアンらしい響き\n・ベースのパターンを変えるだけで雰囲気が大きく変わります',
        relatedTerms: ['church-modes', 'minor-scale'],
      },
    },

    // 4. カノン風バラード
    {
      id: 4,
      title: 'カノン風バラード',
      artist: 'クラシック好き',
      description: 'パッヘルベルのカノン進行（I-V-VI-III-IV-I-IV-V）をベースにしたバラード。王道の美しい響き。',
      genre: 'Classical',
      bpm: 72,
      scale: 'major',
      rootNote: 60,
      totalSteps: 32,
      tracks: [
        {
          id: 'sample4_melody', name: 'メロディ', role: 'melody', instrument: 'strings',
          grid: { 76: { 0: true, 16: true }, 74: { 2: true, 18: true }, 72: { 4: true, 8: true, 20: true, 28: true }, 71: { 6: true, 22: true }, 69: { 10: true, 14: true, 24: true }, 67: { 12: true, 26: true, 30: true }, 65: { 1: true, 17: true }, 64: { 3: true, 9: true, 19: true, 25: true } },
          muted: false, solo: false, volume: 0.7, color: '#6366f1',
        },
        {
          id: 'sample4_chords', name: 'コード', role: 'chords', instrument: 'piano',
          grid: { 60: { 0: true, 8: true }, 64: { 0: true, 8: true, 12: true }, 67: { 0: true, 4: true }, 59: { 4: true }, 62: { 4: true, 28: true }, 57: { 8: true, 16: true }, 55: { 12: true, 20: true, 28: true }, 53: { 16: true, 24: true }, 48: { 20: true }, 52: { 20: true } },
          muted: false, solo: false, volume: 0.5, color: '#10b981',
        },
        {
          id: 'sample4_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 48: { 0: true, 20: true }, 43: { 4: true, 28: true }, 45: { 8: true }, 40: { 12: true }, 41: { 16: true, 24: true } },
          muted: false, solo: false, volume: 0.6, color: '#f59e0b',
        },
      ],
      likes: 42, plays: 158, createdAt: '2026-03-08T16:45:00',
      article: {
        summary: 'カノン進行（I-V-VIm-IIIm-IV-I-IV-V）は300年以上前にパッヘルベルが使って以来、クラシックからJ-POPまで無数の名曲で使われている「最強のコード進行」です。',
        theory: 'Cメジャーでのカノン進行: C-G-Am-Em-F-C-F-G。この進行が美しい理由は、ベースラインが段階的に下降（C-B-A-G-F-E-F-G）するためです。順次下降するベースラインは古くから「美しい」と感じられる普遍的なパターンです。各コードはダイアトニックコードのみで構成されているため、キーの中で完全に安定しています。',
        structure: 'メロディ: ストリングスで歌うような旋律。E5→D5→C5→B4と下降し、コードの動きと平行して動く部分が美しい調和を生みます。\nコード: カノン進行の8コードを4拍ずつ配置。ピアノの温かい音色で。\nベース: 各コードのルート音をロングトーンで演奏。段階的下降がはっきり聴き取れます。',
        tips: '・カノン進行はJ-POPでも定番（例: マリーゴールド、チェリー、パプリカ等）\n・ベースラインの下降が「聴き心地の良さ」の正体です\n・メロディを変えるだけで全く別の曲になるので、作曲練習に最適です',
        relatedTerms: ['canon-progression', 'diatonic-chord', 'cadence'],
      },
    },

    // 5. ファンキー・グルーヴ
    {
      id: 5,
      title: 'ファンキー・グルーヴ',
      artist: 'リズム王',
      description: 'ミクソリディアンスケールを使ったファンク風のグルーヴ。シンコペーションの効いたリズムが特徴。',
      genre: 'Funk',
      bpm: 110,
      scale: 'mixolydian',
      rootNote: 65,
      totalSteps: 16,
      tracks: [
        {
          id: 'sample5_melody', name: 'メロディ', role: 'melody', instrument: 'synth',
          grid: { 77: { 0: true, 3: true, 8: true, 11: true }, 75: { 1: true, 5: true, 9: true, 13: true }, 72: { 2: true, 6: true, 10: true }, 70: { 4: true, 12: true }, 67: { 7: true, 15: true }, 65: { 14: true } },
          muted: false, solo: false, volume: 0.7, color: '#6366f1',
        },
        {
          id: 'sample5_chords', name: 'コード', role: 'chords', instrument: 'piano',
          grid: { 65: { 0: true, 3: true, 8: true, 11: true }, 69: { 0: true, 3: true, 8: true, 11: true }, 72: { 0: true, 3: true, 8: true, 11: true }, 63: { 4: true, 12: true }, 67: { 4: true, 12: true }, 70: { 4: true, 12: true } },
          muted: false, solo: false, volume: 0.45, color: '#10b981',
        },
        {
          id: 'sample5_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 41: { 0: true, 3: true, 7: true, 8: true, 11: true, 15: true }, 43: { 1: true, 5: true, 9: true, 13: true }, 45: { 2: true, 6: true, 10: true, 14: true } },
          muted: false, solo: false, volume: 0.75, color: '#f59e0b',
        },
        {
          id: 'sample5_rhythm', name: 'リズム', role: 'rhythm', instrument: 'marimba',
          grid: { 84: { 0: true, 2: true, 4: true, 6: true, 8: true, 10: true, 12: true, 14: true }, 80: { 1: true, 3: true, 5: true, 7: true, 9: true, 11: true, 13: true, 15: true } },
          muted: false, solo: false, volume: 0.25, color: '#ef4444',
        },
      ],
      likes: 15, plays: 67, createdAt: '2026-03-15T11:00:00',
      article: {
        summary: 'ミクソリディアンモードはメジャースケールの7度を半音下げたスケールです。メジャーなのにどこか「ワイルド」な響きがファンクやロックに最適です。',
        theory: 'Fミクソリディアン: F-G-A-B♭-C-D-E♭。通常のFメジャー（F-G-A-B♭-C-D-E）との違いは7度がEではなくE♭であること。この♭7thがドミナント7thコードの響きを自然に含み、ブルージーかつファンキーな質感を生みます。',
        structure: 'メロディ: シンコペーション（裏拍にアクセント）を多用。拍の「ウラ」に音を置くことでファンキーなグルーヴ感を演出。\nコード: F(I)とE♭(♭VII)の2コード。♭VIIコードはミクソリディアンの象徴。\nベース: F-G-Aの上昇パターンがリズミカルに繰り返される。\nリズム: マリンバの8分音符連打がファンクのノリを支える。',
        tips: '・ミクソリディアンはロック・ファンク・ブルースで大活躍するモードです\n・I-♭VII（例: F-E♭）の2コードヴァンプがこのモードの基本パターン\n・シンコペーション（裏拍アクセント）がファンクらしさの鍵です',
        relatedTerms: ['church-modes', 'syncopation', 'seventh-chord'],
      },
    },

    // 6. 哀愁のワルツ
    {
      id: 6,
      title: '哀愁のワルツ',
      artist: 'ショパン愛好家',
      description: 'ハーモニックマイナーを使ったワルツ風の曲。マイナーの中に東洋的な響きが混ざる独特の美しさ。',
      genre: 'Classical',
      bpm: 84,
      scale: 'harmonicMinor',
      rootNote: 57,
      totalSteps: 24,
      tracks: [
        {
          id: 'sample6_melody', name: 'メロディ', role: 'melody', instrument: 'strings',
          grid: { 69: { 0: true, 12: true }, 68: { 3: true, 15: true }, 65: { 6: true, 18: true }, 64: { 9: true }, 62: { 21: true }, 60: { 10: true, 22: true }, 57: { 11: true, 23: true } },
          muted: false, solo: false, volume: 0.7, color: '#6366f1',
        },
        {
          id: 'sample6_chords', name: 'コード', role: 'chords', instrument: 'piano',
          grid: { 57: { 0: true, 12: true }, 60: { 0: true, 6: true, 12: true, 18: true }, 64: { 0: true, 12: true }, 56: { 6: true, 18: true }, 59: { 6: true, 18: true }, 65: { 6: true, 18: true } },
          muted: false, solo: false, volume: 0.45, color: '#10b981',
        },
        {
          id: 'sample6_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 45: { 0: true, 12: true }, 44: { 6: true, 18: true }, 43: { 3: true, 15: true }, 40: { 9: true, 21: true } },
          muted: false, solo: false, volume: 0.6, color: '#f59e0b',
        },
      ],
      likes: 28, plays: 94, createdAt: '2026-03-07T10:00:00',
      article: {
        summary: 'ハーモニックマイナースケールはナチュラルマイナーの7度を半音上げたスケールです。6度と7度の間に増2度（1音半）の音程が生まれ、これが東洋的・エキゾチックな響きを生みます。',
        theory: 'Aハーモニックマイナー: A-B-C-D-E-F-G#。ナチュラルマイナー（A-B-C-D-E-F-G）との違いは7度がG#であること。F→G#の増2度音程がアラビア風の響きを生み、クラシック音楽ではV7コード（E7）を使うための必然的なスケールとして発展しました。',
        structure: 'メロディ: A4→G#4→F4→E4と下降し、ハーモニックマイナーの特徴音G#を経由。この半音のステップが「哀愁」の核。\nコード: Am(i)→E7(V7)の基本進行。G#がE7の3rdとして機能し、Amへの強い解決感を生む。\nベース: A→G#→G→Eの半音下降がワルツの流れを支える。',
        tips: '・ハーモニックマイナーの増2度（6度→7度）がエキゾチックな響きの正体\n・V7→Imの進行はマイナーキーの最も強力なカデンツです\n・3/4拍子（ワルツ）は3ステップで1拍のリズム。BPM 84なら実質テンポ252の速さ',
        relatedTerms: ['minor-scale', 'cadence', 'interval'],
      },
    },

    // 7. ネオシティポップ
    {
      id: 7,
      title: 'ネオシティポップ',
      artist: 'トーキョーナイト',
      description: 'リディアンスケールの♯4thが生む浮遊感とおしゃれなコード進行。80年代シティポップへのオマージュ。',
      genre: 'J-POP',
      bpm: 116,
      scale: 'lydian',
      rootNote: 65,
      totalSteps: 16,
      tracks: [
        {
          id: 'sample7_melody', name: 'メロディ', role: 'melody', instrument: 'lead',
          grid: { 77: { 0: true, 8: true }, 76: { 2: true, 10: true }, 74: { 4: true, 12: true }, 72: { 1: true, 6: true, 14: true }, 70: { 3: true }, 69: { 5: true, 13: true }, 65: { 7: true, 15: true } },
          muted: false, solo: false, volume: 0.7, color: '#6366f1',
        },
        {
          id: 'sample7_chords', name: 'コード', role: 'chords', instrument: 'pad',
          grid: { 65: { 0: true, 8: true }, 69: { 0: true, 8: true }, 72: { 0: true, 8: true }, 76: { 0: true, 8: true }, 67: { 4: true, 12: true }, 71: { 4: true, 12: true }, 74: { 4: true, 12: true } },
          muted: false, solo: false, volume: 0.35, color: '#10b981',
        },
        {
          id: 'sample7_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 41: { 0: true, 2: true, 8: true, 10: true }, 43: { 4: true, 6: true, 12: true, 14: true } },
          muted: false, solo: false, volume: 0.65, color: '#f59e0b',
        },
        {
          id: 'sample7_rhythm', name: 'リズム', role: 'rhythm', instrument: 'marimba',
          grid: { 84: { 0: true, 4: true, 8: true, 12: true }, 81: { 2: true, 6: true, 10: true, 14: true } },
          muted: false, solo: false, volume: 0.2, color: '#ef4444',
        },
      ],
      likes: 36, plays: 130, createdAt: '2026-03-13T22:30:00',
      article: {
        summary: 'リディアンモードはメジャースケールの4度を半音上げたスケールです。この♯4thが「夢見心地」のような浮遊感を生み、映画音楽やシティポップで好まれます。',
        theory: 'Fリディアン: F-G-A-B-C-D-E。Fメジャー（F-G-A-B♭-C-D-E）との違いは4度がB♭ではなくBであること。この♯4thによりトライトーン（F-B）がスケール内に現れ、メジャーなのに不思議な開放感を持ちます。スティーブ・ヴァイやジョー・サトリアーニなどギタリストにも人気のモード。',
        structure: 'メロディ: F5から順次下降しつつ、♯4th(B)を経由。この音が「おしゃれ」の鍵。\nコード: Fmaj7(I)→G(II)の2コード。IIメジャーはリディアンの象徴的なコード。\nベース: FとGの交互パターン。\nリズム: シンプルな4つ打ちで都会的な雰囲気。',
        tips: '・リディアンはメジャーに「魔法」をかけたいときに使えるモードです\n・映画音画家ジョン・ウィリアムズ（E.T.のテーマ等）が多用しています\n・♯4thをメロディの「頂点」付近に配置すると効果的です',
        relatedTerms: ['church-modes', 'major-scale', 'tension-chord'],
      },
    },

    // 8. Lo-Fi チルビート
    {
      id: 8,
      title: 'Lo-Fi チルビート',
      artist: 'まったりP',
      description: 'マイナーペンタトニックを使った落ち着いたLo-Fiビート。勉強や作業のBGMに。',
      genre: 'Lo-Fi',
      bpm: 75,
      scale: 'minor',
      rootNote: 57,
      totalSteps: 16,
      tracks: [
        {
          id: 'sample8_melody', name: 'メロディ', role: 'melody', instrument: 'piano',
          grid: { 69: { 0: true, 8: true }, 67: { 2: true }, 64: { 4: true, 12: true }, 62: { 6: true, 14: true }, 60: { 10: true }, 57: { 15: true } },
          muted: false, solo: false, volume: 0.6, color: '#6366f1',
        },
        {
          id: 'sample8_chords', name: 'コード', role: 'chords', instrument: 'pad',
          grid: { 57: { 0: true, 8: true }, 60: { 0: true, 8: true }, 64: { 0: true, 8: true }, 55: { 4: true, 12: true }, 59: { 4: true, 12: true }, 62: { 4: true, 12: true } },
          muted: false, solo: false, volume: 0.3, color: '#10b981',
        },
        {
          id: 'sample8_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 45: { 0: true, 8: true }, 43: { 4: true, 12: true }, 40: { 2: true, 10: true }, 38: { 6: true, 14: true } },
          muted: false, solo: false, volume: 0.55, color: '#f59e0b',
        },
      ],
      likes: 52, plays: 203, createdAt: '2026-03-05T08:00:00',
      article: {
        summary: 'Lo-Fi Hip Hopは、意図的に「低品質」な音質や穏やかなビートを特徴とするジャンルです。マイナーキーの温かいコード進行と遅めのBPMが「チル」な雰囲気を生みます。',
        theory: 'Aマイナー（A-B-C-D-E-F-G）を使用。Am→G→Fのシンプルな下降進行がLo-Fiの定番です。7thやadd9をコードに加えるとさらにLo-Fiらしくなります。BPM 70〜85の範囲がLo-Fi Hip Hopの「スイートスポット」です。',
        structure: 'メロディ: ピアノの柔らかい音色でスパースなメロディ。音数を減らすことで「余白」を作り、リラックス感を演出。\nコード: Am→Gの2コードをパッドで静かに鳴らす。\nベース: ゆったりとしたルート音中心のベースライン。',
        tips: '・Lo-Fiのコツは「引き算」。音を詰め込みすぎないことが大切\n・コードに7thやadd9を足すと一気にLo-Fi感が増します\n・BPM 75前後が作業BGMとして最も心地よいテンポです',
        relatedTerms: ['minor-scale', 'seventh-chord', 'pentatonic'],
      },
    },

    // 9. 王道進行ポップ
    {
      id: 9,
      title: '王道進行ポップ',
      artist: 'ヒットメーカー',
      description: 'J-POP定番の「王道進行」（IV-V-IIIm-VIm）を使った曲。多くのヒット曲で使われるコード進行の魅力を体感。',
      genre: 'J-POP',
      bpm: 138,
      scale: 'major',
      rootNote: 60,
      totalSteps: 16,
      tracks: [
        {
          id: 'sample9_melody', name: 'メロディ', role: 'melody', instrument: 'lead',
          grid: { 72: { 0: true, 4: true }, 74: { 1: true, 5: true }, 76: { 2: true, 8: true }, 74: { 3: true, 9: true }, 72: { 6: true, 10: true }, 71: { 7: true }, 69: { 11: true, 14: true }, 67: { 12: true }, 64: { 13: true, 15: true } },
          muted: false, solo: false, volume: 0.75, color: '#6366f1',
        },
        {
          id: 'sample9_chords', name: 'コード', role: 'chords', instrument: 'piano',
          grid: { 65: { 0: true }, 69: { 0: true }, 72: { 0: true }, 67: { 4: true }, 71: { 4: true }, 74: { 4: true }, 64: { 8: true }, 67: { 8: true }, 71: { 8: true }, 57: { 12: true }, 60: { 12: true }, 64: { 12: true } },
          muted: false, solo: false, volume: 0.5, color: '#10b981',
        },
        {
          id: 'sample9_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 41: { 0: true, 2: true }, 43: { 4: true, 6: true }, 40: { 8: true, 10: true }, 45: { 12: true, 14: true } },
          muted: false, solo: false, volume: 0.7, color: '#f59e0b',
        },
        {
          id: 'sample9_rhythm', name: 'リズム', role: 'rhythm', instrument: 'marimba',
          grid: { 84: { 0: true, 4: true, 8: true, 12: true }, 80: { 2: true, 6: true, 10: true, 14: true }, 77: { 1: true, 5: true, 9: true, 13: true } },
          muted: false, solo: false, volume: 0.2, color: '#ef4444',
        },
      ],
      likes: 55, plays: 187, createdAt: '2026-03-06T15:20:00',
      article: {
        summary: '「王道進行」（IV-V-IIIm-VIm）はJ-POPで最も多く使われるコード進行の一つです。YOASOBI「夜に駆ける」、Official髭男dism「Pretender」など無数のヒット曲で使われています。',
        theory: 'Cキーでの王道進行: F-G-Em-Am（IV-V-IIIm-VIm）。この進行が感動的な理由は、サブドミナント(IV)から始まり、ドミナント(V)で期待感を高め、トニック代理(IIIm)で一瞬解決したように見せかけ、最終的にVImに落ちることで「切なさ」を演出するからです。トニック(I)に解決しないのがポイント。',
        structure: 'メロディ: サビのようなキャッチーな上昇→下降ライン。C5→D5→E5と盛り上がり、G4に着地。\nコード: F→G→Em→Amの4コード。4拍ずつ均等配置。\nベース: 各コードのルート音。F→G→E→Aの動きが進行感を強調。\nリズム: アップテンポな8ビート風。',
        tips: '・王道進行の派生として「丸サ進行」（IVM7-V7-IIIm7-VIm）にセブンスを付けるとよりおしゃれに\n・メロディの最高音をV（G）の上に配置すると最も盛り上がって聴こえます\n・BPM 130〜145がJ-POPのサビで最もよく使われるテンポ帯です',
        relatedTerms: ['royal-road', 'diatonic-chord', 'cadence'],
      },
    },

    // 10. アンビエント・スケープ
    {
      id: 10,
      title: 'アンビエント・スケープ',
      artist: '環境音楽家',
      description: 'ホールトーンスケールを使った幻想的なアンビエント。浮遊感と非現実感を音で表現。',
      genre: 'Ambient',
      bpm: 60,
      scale: 'major',
      rootNote: 60,
      totalSteps: 32,
      tracks: [
        {
          id: 'sample10_melody', name: 'メロディ', role: 'melody', instrument: 'pad',
          grid: { 72: { 0: true, 16: true }, 70: { 4: true, 20: true }, 68: { 8: true, 24: true }, 66: { 12: true, 28: true } },
          muted: false, solo: false, volume: 0.5, color: '#6366f1',
        },
        {
          id: 'sample10_chords', name: 'パッド', role: 'chords', instrument: 'strings',
          grid: { 60: { 0: true }, 64: { 0: true }, 68: { 0: true }, 62: { 16: true }, 66: { 16: true }, 70: { 16: true } },
          muted: false, solo: false, volume: 0.3, color: '#10b981',
        },
        {
          id: 'sample10_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 36: { 0: true, 16: true }, 38: { 8: true, 24: true } },
          muted: false, solo: false, volume: 0.4, color: '#f59e0b',
        },
      ],
      likes: 19, plays: 78, createdAt: '2026-03-11T06:00:00',
      article: {
        summary: 'ホールトーンスケールは全ての音の間隔が全音（2半音）で構成された6音スケールです。半音関係が無いため「浮遊感」「非現実感」が強く、ドビュッシーが多用したことで知られます。',
        theory: 'Cホールトーン: C-D-E-F#-G#-A#。全ての音程が等間隔（全音）のため、中心音が曖昧で調性感が薄いのが特徴です。このスケールから作られるコードはオーギュメント（aug）トライアドで、これも不安定で浮遊感のある響きです。',
        structure: 'メロディ: C5→B♭4→A♭4→F#4の全音下降。等間隔の動きが催眠的な効果を生む。\nパッド: Caug(C-E-G#)とDaug(D-F#-A#)の2つのaugコード。ストリングスの長い持続音。\nベース: CとDの長いロングトーン。最小限の動きがアンビエント感を維持。',
        tips: '・ホールトーンスケールは「夢」「水中」「宇宙」など非日常のシーンに最適\n・長く使いすぎると退屈になるので、通常のスケールとの切り替えが効果的\n・ドビュッシーの「帆」やスティーヴィー・ワンダーの「You Are the Sunshine of My Life」で聴けます',
        relatedTerms: ['whole-tone-scale', 'aug-chord', 'church-modes'],
      },
    },

    // 11. ジャズ・スタンダード風
    {
      id: 11,
      title: 'II-V-I エクササイズ',
      artist: 'ジャズ研究生',
      description: 'ジャズで最重要のII-V-I進行を使った練習曲。全てのジャズミュージシャンが通る道。',
      genre: 'Jazz',
      bpm: 132,
      scale: 'major',
      rootNote: 60,
      totalSteps: 16,
      tracks: [
        {
          id: 'sample11_melody', name: 'メロディ', role: 'melody', instrument: 'piano',
          grid: { 74: { 0: true }, 72: { 1: true, 9: true }, 71: { 2: true, 10: true }, 69: { 3: true, 11: true }, 67: { 4: true, 12: true }, 65: { 5: true }, 64: { 6: true, 14: true }, 62: { 7: true }, 60: { 8: true, 15: true }, 72: { 13: true } },
          muted: false, solo: false, volume: 0.7, color: '#6366f1',
        },
        {
          id: 'sample11_chords', name: 'コード', role: 'chords', instrument: 'piano',
          grid: { 62: { 0: true }, 65: { 0: true }, 69: { 0: true }, 72: { 0: true }, 59: { 4: true }, 62: { 4: true }, 65: { 4: true }, 71: { 4: true }, 60: { 8: true }, 64: { 8: true }, 67: { 8: true }, 71: { 8: true }, 62: { 12: true }, 65: { 12: true }, 69: { 12: true } },
          muted: false, solo: false, volume: 0.4, color: '#10b981',
        },
        {
          id: 'sample11_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 38: { 0: true, 2: true }, 43: { 4: true, 6: true }, 36: { 8: true, 10: true }, 38: { 12: true, 14: true } },
          muted: false, solo: false, volume: 0.65, color: '#f59e0b',
        },
      ],
      likes: 33, plays: 145, createdAt: '2026-03-09T19:40:00',
      article: {
        summary: 'II-V-I（ツー・ファイブ・ワン）はジャズの最も基本的なコード進行です。ジャズスタンダードの90%以上にこの進行が含まれており、ジャズ理論の出発点です。',
        theory: 'CキーでのII-V-I: Dm7-G7-Cmaj7。IIm7（サブドミナント機能）→V7（ドミナント機能）→Imaj7（トニック機能）という「緊張→解決」の流れがジャズの基本です。V7の3rd(B)と7th(F)がトライトーン（増4度）を形成し、この強烈な不安定さがImaj7への解決を強力にします。',
        structure: 'メロディ: Dm7上でD5→C5→B4と下降し、G7で解決に向かう。Cmaj7の3rd(E)に着地するのがジャズ的。\nコード: Dm7→G7→Cmaj7→Dm7の循環。各コードは7thまで入れてジャズらしい響き。\nベース: 各コードのルート音を2拍ずつ。D→G→C→Dのシンプルな動き。',
        tips: '・II-V-Iは全12キーで練習するのがジャズの基本修練です\n・V7にオルタードテンション（♭9, #9, ♭13等）を加えるとよりジャズ的に\n・ウォーキングベース（各拍でベースが動く）を加えるとスイング感が出ます',
        relatedTerms: ['two-five-one', 'seventh-chord', 'circle-of-fifths'],
      },
    },

    // 12. フリジアン・ロック
    {
      id: 12,
      title: 'フリジアン・ロック',
      artist: 'メタル職人',
      description: 'フリジアンモードの♭2ndが生むダークで攻撃的な響き。メタルやフラメンコで愛されるモード。',
      genre: 'Rock',
      bpm: 140,
      scale: 'phrygian',
      rootNote: 64,
      totalSteps: 16,
      tracks: [
        {
          id: 'sample12_melody', name: 'メロディ', role: 'melody', instrument: 'synth',
          grid: { 76: { 0: true, 8: true }, 75: { 1: true, 9: true }, 72: { 2: true, 4: true, 10: true, 12: true }, 71: { 3: true, 11: true }, 69: { 5: true, 13: true }, 67: { 6: true, 14: true }, 64: { 7: true, 15: true } },
          muted: false, solo: false, volume: 0.8, color: '#6366f1',
        },
        {
          id: 'sample12_chords', name: 'コード', role: 'chords', instrument: 'organ',
          grid: { 64: { 0: true, 8: true }, 67: { 0: true, 8: true }, 71: { 0: true, 8: true }, 65: { 4: true, 12: true }, 69: { 4: true, 12: true }, 72: { 4: true, 12: true } },
          muted: false, solo: false, volume: 0.5, color: '#10b981',
        },
        {
          id: 'sample12_bass', name: 'ベース', role: 'bass', instrument: 'bass',
          grid: { 40: { 0: true, 2: true, 8: true, 10: true }, 41: { 4: true, 6: true, 12: true, 14: true } },
          muted: false, solo: false, volume: 0.8, color: '#f59e0b',
        },
        {
          id: 'sample12_rhythm', name: 'リズム', role: 'rhythm', instrument: 'marimba',
          grid: { 84: { 0: true, 2: true, 4: true, 6: true, 8: true, 10: true, 12: true, 14: true }, 80: { 1: true, 3: true, 5: true, 7: true, 9: true, 11: true, 13: true, 15: true } },
          muted: false, solo: false, volume: 0.3, color: '#ef4444',
        },
      ],
      likes: 22, plays: 88, createdAt: '2026-03-11T21:00:00',
      article: {
        summary: 'フリジアンモードはマイナースケールの2度を半音下げたスケールです。この♭2ndが生む「異国的で暗い」響きは、メタル、フラメンコ、映画音楽で多用されます。',
        theory: 'Eフリジアン: E-F-G-A-B-C-D。ナチュラルマイナー（E-F#-G-A-B-C-D）との違いは2度がFであること。ルート→♭2ndの半音関係（E→F）がフリジアン最大の特徴で、この暗く緊張感のある響きはフラメンコギターでおなじみです。',
        structure: 'メロディ: E5→F5→E5の♭2nd往復が「フリジアンらしさ」を強調。そこからE4まで駆け下りる攻撃的な下降ライン。\nコード: Em(i)→F(♭II)の2コード。♭IIメジャーコードはフリジアンの象徴。\nベース: EとFのパワフルな交互パターン。半音の緊張感がダークさを増幅。\nリズム: 高速の8分音符連打がメタル的な攻撃性を表現。',
        tips: '・i→♭II（例: Em→F）がフリジアンの最も代表的なコード進行です\n・メタリカ、スレイヤーなどスラッシュメタルで頻繁に登場します\n・フラメンコのスパニッシュ・フリジアンはハーモニックマイナーの要素を加えたものです',
        relatedTerms: ['church-modes', 'minor-scale', 'power-chord'],
      },
    },
  ]
}

export function useSongLibrary() {
  const songs = useState<SharedSong[]>('song-library', () => [])

  function initSongs() {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // サンプルデータが更新されている場合はリセット
          if (!parsed.length || !parsed[0].article) {
            songs.value = createSampleSongs()
            saveSongs()
          } else {
            songs.value = parsed
          }
        } catch {
          songs.value = createSampleSongs()
        }
      } else {
        songs.value = createSampleSongs()
      }
    }
  }

  function saveSongs() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(songs.value))
    }
  }

  function getSong(id: number) {
    return songs.value.find((s) => s.id === id)
  }

  function addSong(song: Omit<SharedSong, 'id' | 'createdAt' | 'likes' | 'plays'>) {
    const newSong: SharedSong = {
      ...song,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      likes: 0,
      plays: 0,
    }
    songs.value = [newSong, ...songs.value]
    saveSongs()
    return newSong
  }

  function likeSong(id: number) {
    const song = songs.value.find((s) => s.id === id)
    if (song) {
      song.likes++
      saveSongs()
    }
  }

  function incrementPlays(id: number) {
    const song = songs.value.find((s) => s.id === id)
    if (song) {
      song.plays++
      saveSongs()
    }
  }

  function deleteSong(id: number) {
    songs.value = songs.value.filter((s) => s.id !== id)
    saveSongs()
  }

  return {
    songs,
    initSongs,
    getSong,
    addSong,
    likeSong,
    incrementPlays,
    deleteSong,
    midiToNoteName,
    getScaleDisplayName,
    SCALE_NAMES,
    NOTE_NAMES,
  }
}
