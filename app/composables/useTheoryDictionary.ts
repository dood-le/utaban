export interface SongExample {
  title: string
  artist: string
  year?: number
  description: string
}

export interface TheoryEntry {
  slug: string
  title: string
  category: string
  shortDescription: string
  description: string
  relatedTerms: string[]
  songExamples?: SongExample[]
  audioDemo?: AudioDemo
  demoSongs?: DemoSong[]
}

export interface AudioDemo {
  type: 'chord' | 'scale' | 'interval' | 'progression'
  notes: number[][] // MIDI note numbers per step
  labels?: string[]
  duration?: number // ms per step
}

export interface DemoSong {
  title: string
  description: string
  bpm: number
  tracks: DemoTrack[]
}

export interface DemoTrack {
  name: string
  instrument: 'piano' | 'bass' | 'lead' | 'pad' | 'strings' | 'organ' | 'marimba' | 'synth'
  // Each step: [midiNotes[], durationInBeats] — null = rest
  notes: ([number[], number] | null)[]
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
}

const categories: Category[] = [
  { id: 'basics', name: '音楽基礎', icon: '🎵', description: '音名、音程、拍子など音楽の基本要素' },
  { id: 'scales', name: 'スケール', icon: '🎹', description: '長音階、短音階、モードなど' },
  { id: 'chords', name: 'コード', icon: '🎸', description: '三和音、四和音、テンションコード' },
  { id: 'progressions', name: 'コード進行', icon: '🎶', description: '定番進行、代理コード、転調' },
  { id: 'rhythm', name: 'リズム', icon: '🥁', description: '拍子、シンコペーション、ポリリズム' },
  { id: 'arrangement', name: 'アレンジ', icon: '🎻', description: '編曲、対位法、オーケストレーション' },
]

const entries: TheoryEntry[] = [
  // ===== 音楽基礎 =====
  {
    slug: 'pitch',
    title: '音高（ピッチ）',
    category: 'basics',
    shortDescription: '音の高さを表す概念',
    description: `音高（ピッチ）とは、音の高さのことです。物理的には音波の周波数によって決まり、周波数が高いほど高い音に聞こえます。

国際基準ではA4（ラ）= 440Hzと定められています。1オクターブ上がると周波数は2倍になります。

西洋音楽では1オクターブを12の半音に等分した**平均律**が広く使われています。ピアノの白鍵と黒鍵を合わせると1オクターブに12個の鍵盤があるのはこのためです。`,
    relatedTerms: ['interval', 'octave', 'major-scale'],
    songExamples: [
      { title: 'Bohemian Rhapsody', artist: 'Queen', year: 1975, description: '極端に広い音域を使い、ピッチの高低差でドラマティックな表現を実現した名曲。' },
      { title: '残酷な天使のテーゼ', artist: '高橋洋子', year: 1995, description: 'サビの跳躍するメロディが印象的。音高の大きな変化がエネルギッシュさを生んでいます。' },
      { title: 'Someone Like You', artist: 'Adele', year: 2011, description: 'Aメロの低音域からサビの高音域への移行が感情の高まりを表現。' },
    ],
    audioDemo: {
      type: 'scale',
      notes: [[60], [62], [64], [65], [67], [69], [71], [72]],
      labels: ['ド', 'レ', 'ミ', 'ファ', 'ソ', 'ラ', 'シ', 'ド'],
      duration: 400,
    },
    demoSongs: [
      {
        title: 'きらきら星（音高の階段）',
        description: '音高が段階的に上下するシンプルなメロディ。ドレミの音高関係を体感できます。',
        bpm: 120,
        tracks: [
          {
            name: 'メロディ',
            instrument: 'lead',
            notes: [
              [[60], 1], [[60], 1], [[67], 1], [[67], 1],
              [[69], 1], [[69], 1], [[67], 2],
              [[65], 1], [[65], 1], [[64], 1], [[64], 1],
              [[62], 1], [[62], 1], [[60], 2],
            ],
          },
          {
            name: 'コード',
            instrument: 'pad',
            notes: [
              [[48, 52, 55], 4], [[53, 57, 60], 4],
              [[53, 57, 60], 4], [[48, 52, 55], 4],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'interval',
    title: '音程（インターバル）',
    category: 'basics',
    shortDescription: '2つの音の間の距離',
    description: `音程（インターバル）とは、2つの音の高さの隔たりのことです。半音の数で測定します。

主な音程：
- **完全1度（ユニゾン）**: 0半音（同じ音）
- **短2度**: 1半音
- **長2度**: 2半音
- **短3度**: 3半音（暗い響き）
- **長3度**: 4半音（明るい響き）
- **完全4度**: 5半音
- **増4度/減5度（トライトーン）**: 6半音（不安定な響き）
- **完全5度**: 7半音（安定した響き）
- **完全8度（オクターブ）**: 12半音

音程はメロディー（旋律的音程）としてもハーモニー（和声的音程）としても現れます。`,
    relatedTerms: ['pitch', 'octave', 'major-triad', 'minor-triad'],
    songExamples: [
      { title: 'Somewhere Over the Rainbow', artist: 'Judy Garland', year: 1939, description: '冒頭のメロディがオクターブ跳躍（完全8度）で始まる、音程の教科書的な例。' },
      { title: 'Star Wars Main Theme', artist: 'John Williams', year: 1977, description: '完全5度の跳躍が冒頭のファンファーレに力強さを与えています。' },
      { title: 'Here Comes the Bride', artist: '(ワーグナー)', year: 1850, description: '完全4度の上行で始まる、最も有名な音程の例。' },
    ],
    audioDemo: {
      type: 'interval',
      notes: [[60, 60], [60, 63], [60, 64], [60, 67], [60, 72]],
      labels: ['完全1度', '短3度', '長3度', '完全5度', 'オクターブ'],
      duration: 800,
    },
  },
  {
    slug: 'octave',
    title: 'オクターブ',
    category: 'basics',
    shortDescription: '周波数が2倍になる音程',
    description: `オクターブとは、ある音から周波数が2倍（または1/2倍）の関係にある音までの音程です。12半音に相当します。

例えば、A4 = 440Hzに対して、A5 = 880Hz、A3 = 220Hzです。

オクターブの関係にある2つの音は非常に似た響きを持ち、同じ音名が付けられます。これは人間の聴覚の基本的な性質です。

ピアノの鍵盤では、ドからドまでの白鍵7つ＋黒鍵5つ = 12鍵が1オクターブです。`,
    relatedTerms: ['pitch', 'interval'],
    songExamples: [
      { title: 'Singin\' in the Rain', artist: 'Gene Kelly', year: 1952, description: 'サビのメロディでオクターブ跳躍が効果的に使われ、明るい開放感を演出。' },
      { title: '天城越え', artist: '石川さゆり', year: 1986, description: 'サビでオクターブを越える大胆な跳躍が情念の深さを表現。' },
    ],
    audioDemo: {
      type: 'interval',
      notes: [[48], [60], [72], [48, 60, 72]],
      labels: ['低いド', '中央ド', '高いド', '3オクターブ同時'],
      duration: 700,
    },
  },
  {
    slug: 'key-signature',
    title: '調号（キーシグネチャー）',
    category: 'basics',
    shortDescription: '楽曲のキーを示す#や♭の表記',
    description: `調号は、楽曲のキー（調）を示すために五線譜の冒頭に記される#（シャープ）や♭（フラット）の記号です。

**シャープ系の調号**（五度圏の時計回り）：
- #なし: Cメジャー / Aマイナー
- #1つ: Gメジャー / Eマイナー（F#）
- #2つ: Dメジャー / Bマイナー（F#, C#）
- #3つ: Aメジャー / F#マイナー（F#, C#, G#）

**フラット系の調号**（五度圏の反時計回り）：
- ♭1つ: Fメジャー / Dマイナー（B♭）
- ♭2つ: B♭メジャー / Gマイナー（B♭, E♭）
- ♭3つ: E♭メジャー / Cマイナー（B♭, E♭, A♭）

調号はシャープとフラットが付く順番も決まっています。シャープは F-C-G-D-A-E-B、フラットは B-E-A-D-G-C-F の順です。`,
    relatedTerms: ['major-scale', 'minor-scale', 'circle-of-fifths'],
    songExamples: [
      { title: 'Let It Be', artist: 'The Beatles', year: 1970, description: 'Cメジャー（調号なし）のシンプルなキー。初心者がピアノで弾きやすい定番曲。' },
      { title: 'Yesterday', artist: 'The Beatles', year: 1965, description: 'Fメジャー（♭1つ）で書かれた名曲。B♭の響きが柔らかさを生んでいます。' },
      { title: 'Fly Me to the Moon', artist: 'Frank Sinatra', year: 1964, description: '多くのバージョンがCメジャーやAマイナーで演奏され、調号と平行調の関係を学ぶのに最適。' },
    ],
  },
  // ===== スケール =====
  {
    slug: 'major-scale',
    title: '長音階（メジャースケール）',
    category: 'scales',
    shortDescription: '明るく安定した響きの基本スケール',
    description: `長音階（メジャースケール）は西洋音楽で最も基本的なスケールです。「ドレミファソラシド」がこれにあたります。

**構成音程**: 全-全-半-全-全-全-半（W-W-H-W-W-W-H）

ここで「全」は全音（2半音）、「半」は半音（1半音）を意味します。

Cメジャースケールの場合：C - D - E - F - G - A - B - C

メジャースケールはダイアトニックコードの土台となり、キーの概念の基礎です。明るく安定した響きが特徴で、ポップス・クラシック・ジャズなどあらゆるジャンルで使われます。

各音には**スケールディグリー**（音度）が割り当てられ、ローマ数字で表記されます：I, II, III, IV, V, VI, VII`,
    relatedTerms: ['minor-scale', 'diatonic-chord', 'pitch', 'church-modes'],
    songExamples: [
      { title: 'ドレミの歌', artist: 'ジュリー・アンドリュース', year: 1959, description: 'メジャースケールそのものをメロディに落とし込んだ楽曲。音楽教育の定番。' },
      { title: 'Happy', artist: 'Pharrell Williams', year: 2013, description: 'Fメジャースケールを基調にした明るくポジティブなメロディ。メジャースケールの「幸福感」の好例。' },
      { title: 'I Got Rhythm', artist: 'George Gershwin', year: 1930, description: 'メジャースケールを土台にしたジャズスタンダード。多くのジャズ曲がこのコード進行を借用。' },
      { title: 'Let It Be', artist: 'The Beatles', year: 1970, description: 'Cメジャースケールの音だけで構成されたシンプルで普遍的なメロディ。' },
    ],
    audioDemo: {
      type: 'scale',
      notes: [[60], [62], [64], [65], [67], [69], [71], [72]],
      labels: ['I (ド)', 'II (レ)', 'III (ミ)', 'IV (ファ)', 'V (ソ)', 'VI (ラ)', 'VII (シ)', 'I (ド)'],
      duration: 400,
    },
    demoSongs: [
      {
        title: '明るいメジャーメロディ',
        description: 'メジャースケールの音だけで構成された明るく軽快なメロディ。ポップスの基本形です。',
        bpm: 130,
        tracks: [
          {
            name: 'メロディ',
            instrument: 'lead',
            notes: [
              [[64], 0.5], [[67], 0.5], [[72], 1], [[71], 0.5], [[69], 0.5],
              [[67], 1], [[65], 0.5], [[64], 0.5], [[62], 1], [[64], 1],
              [[64], 0.5], [[67], 0.5], [[72], 1], [[74], 1],
              [[72], 1], [[71], 0.5], [[69], 0.5], [[67], 2],
            ],
          },
          {
            name: 'コード',
            instrument: 'piano',
            notes: [
              [[60, 64, 67], 2], [[65, 69, 72], 2],
              [[67, 71, 74], 2], [[60, 64, 67], 2],
              [[60, 64, 67], 2], [[65, 69, 72], 2],
              [[67, 71, 74], 2], [[60, 64, 67], 2],
            ],
          },
          {
            name: 'ベース',
            instrument: 'bass',
            notes: [
              [[48], 2], [[53], 2], [[55], 2], [[48], 2],
              [[48], 2], [[53], 2], [[55], 2], [[48], 2],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'minor-scale',
    title: '短音階（マイナースケール）',
    category: 'scales',
    shortDescription: '暗く哀愁のある響きのスケール',
    description: `短音階（マイナースケール）は、長音階と対をなす基本スケールです。暗く哀愁のある響きが特徴です。

**自然短音階（ナチュラルマイナー）**: 全-半-全-全-半-全-全
Aナチュラルマイナー：A - B - C - D - E - F - G - A

**和声短音階（ハーモニックマイナー）**: 第7音を半音上げる
A - B - C - D - E - F - G# - A（独特のエキゾチックな響き）

**旋律短音階（メロディックマイナー）**: 上行時に第6・7音を半音上げる
上行：A - B - C - D - E - F# - G# - A
下行：A - G - F - E - D - C - B - A（＝ナチュラルマイナー）

マイナーキーの楽曲ではこれら3種類が状況に応じて使い分けられます。`,
    relatedTerms: ['major-scale', 'diatonic-chord', 'church-modes'],
    songExamples: [
      { title: 'Stairway to Heaven', artist: 'Led Zeppelin', year: 1971, description: 'Aマイナーを基調とした楽曲。マイナースケールの哀愁と力強さを同時に表現。' },
      { title: '千本桜', artist: '黒うさP (feat. 初音ミク)', year: 2011, description: 'マイナースケールの疾走感を活かしたボカロ楽曲。和風メロディとマイナーの融合。' },
      { title: 'Rolling in the Deep', artist: 'Adele', year: 2011, description: 'Cマイナーの力強いメロディ。ナチュラルマイナースケールの暗さが感情的な深みを生む。' },
      { title: 'Misirlou', artist: 'Dick Dale', year: 1962, description: 'ハーモニックマイナーのエキゾチックな響きを活かしたサーフロックの名曲。映画「パルプ・フィクション」でも使用。' },
    ],
    audioDemo: {
      type: 'scale',
      notes: [[69], [71], [72], [74], [76], [77], [79], [81]],
      labels: ['ラ', 'シ', 'ド', 'レ', 'ミ', 'ファ', 'ソ', 'ラ'],
      duration: 400,
    },
    demoSongs: [
      {
        title: '哀愁のマイナーバラード',
        description: 'ナチュラルマイナースケールで作った哀しくも美しいメロディ。短3度の響きが特徴的です。',
        bpm: 90,
        tracks: [
          {
            name: 'メロディ',
            instrument: 'lead',
            notes: [
              [[69], 1], [[72], 1], [[74], 1.5], [[72], 0.5],
              [[69], 1], [[71], 1], [[72], 2],
              [[77], 1], [[76], 1], [[74], 1.5], [[72], 0.5],
              [[71], 1], [[69], 1], [[69], 2],
            ],
          },
          {
            name: 'コード',
            instrument: 'pad',
            notes: [
              [[57, 60, 64], 4], [[55, 59, 62], 4],
              [[53, 57, 60], 4], [[52, 56, 59], 4],
            ],
          },
          {
            name: 'ベース',
            instrument: 'bass',
            notes: [
              [[45], 2], [[45], 1], [[43], 1],
              [[43], 2], [[41], 2],
              [[41], 2], [[40], 2],
              [[40], 2], [[38], 1], [[40], 1],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'pentatonic',
    title: 'ペンタトニックスケール',
    category: 'scales',
    shortDescription: '5音で構成される汎用性の高いスケール',
    description: `ペンタトニックスケール（五音音階）は5つの音で構成されるスケールです。世界中の民族音楽に見られる普遍的なスケールです。

**メジャーペンタトニック**: ド-レ-ミ-ソ-ラ（C-D-E-G-A）
メジャースケールから4度と7度を抜いたもの。

**マイナーペンタトニック**: ラ-ド-レ-ミ-ソ（A-C-D-E-G）
ブルース、ロックのギターソロで多用されます。

半音がないため不協和が起きにくく、どの音を組み合わせても心地よく響くのが特徴です。即興演奏の入門に最適なスケールです。`,
    relatedTerms: ['major-scale', 'minor-scale', 'blues-scale'],
    songExamples: [
      { title: 'My Girl', artist: 'The Temptations', year: 1964, description: '冒頭のギターリフがメジャーペンタトニックの教科書的な例。甘く温かい響き。' },
      { title: 'Stairway to Heaven (ソロ)', artist: 'Led Zeppelin', year: 1971, description: 'Jimmy Pageのギターソロはマイナーペンタトニックを基にした名演。' },
      { title: 'Amazing Grace', artist: '(トラディショナル)', description: 'メジャーペンタトニックのみで構成された旋律。ペンタトニックの普遍性を示す好例。' },
      { title: 'Smoke on the Water', artist: 'Deep Purple', year: 1972, description: 'ロック史上最も有名なリフの一つ。マイナーペンタトニックの力強さを体現。' },
      { title: 'さくらさくら', artist: '(日本古謡)', description: '日本の伝統的な五音音階（ヨナ抜き音階）で構成。ペンタトニックの文化的普遍性を示します。' },
    ],
    audioDemo: {
      type: 'scale',
      notes: [[60], [62], [64], [67], [69], [72]],
      labels: ['ド', 'レ', 'ミ', 'ソ', 'ラ', 'ド'],
      duration: 400,
    },
    demoSongs: [
      {
        title: 'ペンタトニック即興フレーズ',
        description: 'ペンタトニックスケールだけで構成されたロック風のギターリフ。どの音も馴染みやすい響きです。',
        bpm: 110,
        tracks: [
          {
            name: 'リフ',
            instrument: 'lead',
            notes: [
              [[60], 0.5], [[62], 0.5], [[64], 0.5], [[67], 0.5],
              [[69], 1], [[67], 0.5], [[64], 0.5],
              [[62], 1], [[60], 0.5], [[57], 0.5],
              [[60], 2],
              [[69], 0.5], [[67], 0.5], [[64], 1],
              [[62], 0.5], [[64], 0.5], [[62], 0.5], [[60], 0.5],
              [[57], 1], [[60], 1], [[60], 2],
            ],
          },
          {
            name: 'パワーコード',
            instrument: 'piano',
            notes: [
              [[48, 55], 4], [[45, 52], 4],
              [[48, 55], 4], [[45, 52], 4],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'church-modes',
    title: 'チャーチモード（教会旋法）',
    category: 'scales',
    shortDescription: '中世から伝わる7つのモード',
    description: `チャーチモード（教会旋法）は、メジャースケールの各音を起点にした7つのスケールです。

**7つのモード**（Cメジャースケール基準）：
1. **イオニアン** (C): ド-レ-ミ-ファ-ソ-ラ-シ = メジャースケール
2. **ドリアン** (D): レ-ミ-ファ-ソ-ラ-シ-ド（マイナーだが明るい）
3. **フリジアン** (E): ミ-ファ-ソ-ラ-シ-ド-レ（スパニッシュ感）
4. **リディアン** (F): ファ-ソ-ラ-シ-ド-レ-ミ（浮遊感）
5. **ミクソリディアン** (G): ソ-ラ-シ-ド-レ-ミ-ファ（ブルージー）
6. **エオリアン** (A): ラ-シ-ド-レ-ミ-ファ-ソ = ナチュラルマイナー
7. **ロクリアン** (B): シ-ド-レ-ミ-ファ-ソ-ラ（不安定）

モードを理解するとメロディやコード進行のカラーを自在にコントロールできます。`,
    relatedTerms: ['major-scale', 'minor-scale', 'diatonic-chord'],
    songExamples: [
      { title: 'So What', artist: 'Miles Davis', year: 1959, description: 'ドリアンモードを使ったモーダルジャズの金字塔。Dドリアン→E♭ドリアンの2コードで構成。' },
      { title: 'Eleanor Rigby', artist: 'The Beatles', year: 1966, description: 'ドリアンモードの響きが使われており、マイナーながらもどこか明るさがある独特の雰囲気。' },
      { title: 'Flamenco Sketches', artist: 'Miles Davis', year: 1959, description: 'フリジアンモードを含む複数のモードを自由に行き来する即興演奏。' },
      { title: 'The Simpsons Theme', artist: 'Danny Elfman', year: 1989, description: 'リディアンモード（#4）の浮遊感が特徴的。不思議でコミカルな印象を生んでいます。' },
      { title: 'Norwegian Wood', artist: 'The Beatles', year: 1965, description: 'ミクソリディアンモードの♭7thがフォーキーで温かみのある響きを作り出している。' },
      { title: 'Get Lucky', artist: 'Daft Punk (feat. Pharrell Williams)', year: 2013, description: 'Bドリアンモードのファンキーなコード進行。モードの現代的な活用例。' },
    ],
    audioDemo: {
      type: 'scale',
      notes: [[62], [64], [65], [67], [69], [71], [72], [74]],
      labels: ['レ', 'ミ', 'ファ', 'ソ', 'ラ', 'シ', 'ド', 'レ'],
      duration: 400,
    },
  },
  {
    slug: 'blues-scale',
    title: 'ブルーススケール',
    category: 'scales',
    shortDescription: 'ブルーノートを含むスケール',
    description: `ブルーススケールは、マイナーペンタトニックスケールに♭5（ブルーノート）を追加したスケールです。

**構成音**（Aブルーススケール）：A - C - D - E♭ - E - G
**音程**: 短3度-全音-半音-半音-短3度-全音

♭5の音（E♭）が独特のブルージーな響きを生み出します。これを**ブルーノート**と呼びます。

ブルース、ロック、ジャズの即興演奏に不可欠なスケールです。ペンタトニックと合わせて覚えると、表現の幅が大きく広がります。`,
    relatedTerms: ['pentatonic', 'minor-scale'],
    songExamples: [
      { title: 'The Thrill Is Gone', artist: 'B.B. King', year: 1969, description: 'ブルーススケールを極限まで歌い上げた名演。ブルーノートの使い方が教科書的。' },
      { title: 'Crossroads', artist: 'Cream (Eric Clapton)', year: 1968, description: 'ブルーススケールを駆使した伝説的なライブギターソロ。' },
      { title: 'Pride and Joy', artist: 'Stevie Ray Vaughan', year: 1983, description: 'テキサスブルースの名曲。ブルーススケールのアグレッシブな使い方の好例。' },
      { title: 'Red House', artist: 'Jimi Hendrix', year: 1967, description: 'ブルーススケールとペンタトニックを自在に行き来する革新的なギタープレイ。' },
    ],
    audioDemo: {
      type: 'scale',
      notes: [[69], [72], [74], [75], [76], [79], [81]],
      labels: ['ラ', 'ド', 'レ', 'ミ♭', 'ミ', 'ソ', 'ラ'],
      duration: 400,
    },
    demoSongs: [
      {
        title: '12小節ブルース',
        description: 'ブルーススケールを使った典型的な12小節ブルースのメロディ。♭5（ブルーノート）が効いています。',
        bpm: 100,
        tracks: [
          {
            name: 'ブルースリック',
            instrument: 'lead',
            notes: [
              [[69], 0.5], [[72], 0.5], [[74], 0.5], [[75], 0.25], [[76], 0.75],
              null,
              [[79], 0.5], [[76], 0.5], [[75], 0.25], [[74], 0.75], [[72], 0.5],
              [[69], 1.5],
              [[74], 0.5], [[75], 0.25], [[76], 0.75], [[79], 0.5], [[76], 0.5],
              [[74], 0.5], [[72], 0.5], [[69], 2],
            ],
          },
          {
            name: 'シャッフルコード',
            instrument: 'piano',
            notes: [
              [[57, 60, 64], 2], [[57, 60, 64], 2],
              [[62, 65, 69], 2], [[57, 60, 64], 2],
              [[64, 67, 71], 1], [[62, 65, 69], 1], [[57, 60, 64], 2],
            ],
          },
          {
            name: 'ウォーキングベース',
            instrument: 'bass',
            notes: [
              [[45], 1], [[47], 1], [[48], 1], [[50], 1],
              [[50], 1], [[52], 1], [[45], 1], [[47], 1],
              [[52], 1], [[50], 1], [[45], 1], [[45], 1],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'chromatic-scale',
    title: 'クロマティックスケール（半音階）',
    category: 'scales',
    shortDescription: '12の半音全てを含むスケール',
    description: `クロマティックスケール（半音階）は、1オクターブ内の12の半音全てを順番に並べたスケールです。

**構成**: 全ての音が半音間隔
C - C# - D - D# - E - F - F# - G - G# - A - A# - B - C

クロマティックスケール自体をメロディの主軸にすることは稀ですが、**経過音**（パッシングトーン）や**アプローチノート**として半音階的な動きは頻繁に使われます。

**活用場面**：
- ジャズの即興で半音階アプローチ
- クラシック音楽の半音階的和声
- 映画音楽の緊張感の演出
- ギターやベースのランニングフレーズ`,
    relatedTerms: ['major-scale', 'interval', 'blues-scale'],
    songExamples: [
      { title: 'Flight of the Bumblebee', artist: 'リムスキー＝コルサコフ', year: 1900, description: '高速の半音階パッセージで蜂の飛翔を表現した名曲。クロマティックスケールの代表例。' },
      { title: 'The Entertainer', artist: 'Scott Joplin', year: 1902, description: 'ラグタイムの名曲。半音階的な装飾が軽快なユーモアを生み出しています。' },
      { title: 'Jaws Theme', artist: 'John Williams', year: 1975, description: '半音ずつ上がる2音のモチーフが恐怖感を演出。クロマティックの緊張感の好例。' },
    ],
    audioDemo: {
      type: 'scale',
      notes: [[60], [61], [62], [63], [64], [65], [66], [67], [68], [69], [70], [71], [72]],
      labels: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
      duration: 250,
    },
  },
  {
    slug: 'whole-tone-scale',
    title: 'ホールトーンスケール（全音音階）',
    category: 'scales',
    shortDescription: '全音のみで構成される浮遊感のあるスケール',
    description: `ホールトーンスケール（全音音階）は、全ての音程が全音（2半音）で構成される6音スケールです。

**構成音**（Cホールトーン）：C - D - E - F# - G# - A#
**音程**: 全て全音

**特徴**：
- 半音がないため、解決感（トニック感）がない
- 夢のような浮遊感、不思議な雰囲気を生む
- ドビュッシーら印象派の作曲家が多用
- 12音中6音なので、ホールトーンスケールは2つしか存在しない
- オーギュメントトライアド（増三和音）と密接に関連

映画音楽やゲーム音楽で「夢の中」「異世界」を表現する際にも使われます。`,
    relatedTerms: ['chromatic-scale', 'major-scale', 'aug-chord'],
    songExamples: [
      { title: 'Voiles (帆)', artist: 'Claude Debussy', year: 1910, description: 'ホールトーンスケールを主題として使った印象派音楽の代表作。浮遊感ある響きを堪能できます。' },
      { title: 'You Are the Sunshine of My Life', artist: 'Stevie Wonder', year: 1973, description: 'イントロでホールトーンスケールが使われ、夢見るような導入を演出。' },
      { title: 'Zelda "Lost Woods" テーマ', artist: '近藤浩治', year: 1998, description: 'ゲーム音楽でのホールトーン的な響きの活用。不思議な森の雰囲気を表現。' },
    ],
    audioDemo: {
      type: 'scale',
      notes: [[60], [62], [64], [66], [68], [70], [72]],
      labels: ['C', 'D', 'E', 'F#', 'G#', 'A#', 'C'],
      duration: 500,
    },
  },
  // ===== コード =====
  {
    slug: 'major-triad',
    title: 'メジャートライアド（長三和音）',
    category: 'chords',
    shortDescription: '明るい響きの基本和音',
    description: `メジャートライアド（長三和音）は、ルート・長3度・完全5度の3音で構成される和音です。最も基本的なコードであり、明るく安定した響きが特徴です。

**構成**：ルート + 長3度(4半音) + 完全5度(7半音)

例：Cメジャー = C - E - G

メジャートライアドは安定感と明るさを表現し、楽曲の主要なハーモニーの土台となります。`,
    relatedTerms: ['minor-triad', 'interval', 'diatonic-chord', 'seventh-chord'],
    songExamples: [
      { title: 'Twist and Shout', artist: 'The Beatles', year: 1963, description: 'D-G-Aのメジャートライアド3つだけで構成されたシンプルだが強力なロックナンバー。' },
      { title: 'Three Little Birds', artist: 'Bob Marley', year: 1977, description: 'A-D-Eのメジャートライアドで構成された楽観的なレゲエナンバー。' },
      { title: 'Country Roads', artist: 'John Denver', year: 1971, description: 'メジャートライアドの温かみのある響きがカントリーの雰囲気を作り出す名曲。' },
    ],
    audioDemo: {
      type: 'chord',
      notes: [[60, 64, 67], [65, 69, 72], [67, 71, 74], [60, 64, 67]],
      labels: ['C', 'F', 'G', 'C'],
      duration: 800,
    },
  },
  {
    slug: 'minor-triad',
    title: 'マイナートライアド（短三和音）',
    category: 'chords',
    shortDescription: '暗い響きの基本和音',
    description: `マイナートライアド（短三和音）は、ルート・短3度・完全5度の3音で構成される和音です。暗く哀愁のある響きが特徴です。

**構成**：ルート + 短3度(3半音) + 完全5度(7半音)

例：Cマイナー = C - E♭ - G

メジャートライアドとの違いは3度の音が半音低いだけですが、印象は大きく変わります。この「長3度 vs 短3度」がメジャー/マイナーの響きを決定づけています。`,
    relatedTerms: ['major-triad', 'interval', 'diatonic-chord'],
    songExamples: [
      { title: 'Losing My Religion', artist: 'R.E.M.', year: 1991, description: 'Amを中心としたマイナートライアドが楽曲全体の切ない雰囲気を作り出している。' },
      { title: 'Mad World', artist: 'Gary Jules', year: 2001, description: 'Em-G-D-Aの進行でマイナートライアドの暗さが楽曲のダークな世界観を表現。' },
      { title: 'Summertime', artist: 'George Gershwin', year: 1935, description: 'マイナーコードの哀愁漂う響きがジャズスタンダードとしての深みを生んでいる。' },
    ],
    audioDemo: {
      type: 'chord',
      notes: [[60, 63, 67], [65, 68, 72], [67, 70, 74], [60, 63, 67]],
      labels: ['Cm', 'Fm', 'Gm', 'Cm'],
      duration: 800,
    },
  },
  {
    slug: 'seventh-chord',
    title: 'セブンスコード（七の和音）',
    category: 'chords',
    shortDescription: '4音で構成されるリッチなコード',
    description: `セブンスコード（七の和音）は、トライアドに7度の音を追加した4音構成の和音です。

**主要なセブンスコード**：
- **メジャーセブンス (△7)**: 明るく透明感のある響き
  CM7 = C - E - G - B
- **ドミナントセブンス (7)**: 緊張感がありトニックへ解決したがる
  G7 = G - B - D - F
- **マイナーセブンス (m7)**: 柔らかく落ち着いた響き
  Am7 = A - C - E - G
- **マイナーセブンフラットファイブ (m7♭5)**: 不安定でミステリアス
  Bm7♭5 = B - D - F - A

ジャズやポップスでは、セブンスコードがハーモニーの基本単位として使われます。`,
    relatedTerms: ['major-triad', 'minor-triad', 'diatonic-chord', 'tension-chord'],
    songExamples: [
      { title: 'Don\'t Know Why', artist: 'Norah Jones', year: 2002, description: 'メジャーセブンスの透明感が楽曲全体の柔らかいムードを演出。' },
      { title: 'Just the Two of Us', artist: 'Grover Washington Jr.', year: 1981, description: 'セブンスコードを多用したスムースジャズの名曲。D♭M7→C7→Fm7の進行が美しい。' },
      { title: 'Isn\'t She Lovely', artist: 'Stevie Wonder', year: 1976, description: 'ドミナント7thとマイナー7thの組み合わせがファンキーかつ温かい響きを作る。' },
      { title: '丸の内サディスティック', artist: '椎名林檎', year: 1999, description: 'セブンスコードを多用したジャジーなJ-POP。E♭M7→D7→Gm7等の洗練された進行。' },
    ],
    audioDemo: {
      type: 'chord',
      notes: [[60, 64, 67, 71], [67, 71, 74, 77], [69, 72, 76, 79], [60, 64, 67, 71]],
      labels: ['CM7', 'G7', 'Am7', 'CM7'],
      duration: 1000,
    },
    demoSongs: [
      {
        title: 'セブンスコードで作るジャジーな響き',
        description: 'セブンスコードを使ったラウンジ風の楽曲。三和音との響きの違いを感じてみてください。',
        bpm: 85,
        tracks: [
          {
            name: 'メロディ',
            instrument: 'lead',
            notes: [
              [[71], 1], [[72], 0.5], [[74], 0.5], [[76], 1], [[74], 1],
              [[72], 1], [[71], 0.5], [[69], 0.5], [[67], 2],
              [[69], 1], [[71], 0.5], [[72], 0.5], [[74], 1], [[72], 1],
              [[71], 1], [[69], 1], [[67], 2],
            ],
          },
          {
            name: 'セブンスコード',
            instrument: 'piano',
            notes: [
              [[60, 64, 67, 71], 4],
              [[65, 69, 72, 76], 4],
              [[62, 65, 69, 72], 4],
              [[55, 59, 62, 65], 4],
            ],
          },
          {
            name: 'ベース',
            instrument: 'bass',
            notes: [
              [[48], 2], [[47], 1], [[48], 1],
              [[53], 2], [[52], 1], [[53], 1],
              [[50], 2], [[48], 1], [[50], 1],
              [[43], 2], [[45], 1], [[43], 1],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'tension-chord',
    title: 'テンションコード',
    category: 'chords',
    shortDescription: '9th, 11th, 13thを含む拡張コード',
    description: `テンションコードは、セブンスコードにさらに9度・11度・13度の音（テンション）を追加したコードです。

**主なテンション**：
- **9th**: ルートの全音上（オクターブ上の2度）
- **11th**: ルートの完全4度上（オクターブ上の4度）
- **13th**: ルートの長6度上（オクターブ上の6度）

**変化テンション（オルタード）**：
♭9, #9, #11, ♭13 なども使われます。

例：C9 = C - E - G - B♭ - D
例：Cm11 = C - E♭ - G - B♭ - D - F

テンションはコードに色彩と緊張感を加え、ジャズ・フュージョン・ネオソウルなどで重要な役割を果たします。`,
    relatedTerms: ['seventh-chord', 'diatonic-chord'],
    songExamples: [
      { title: 'Deacon Blues', artist: 'Steely Dan', year: 1977, description: 'テンションコードを巧みに活用した高度なポップス。#11やadd9などが随所に。' },
      { title: 'Billie Jean', artist: 'Michael Jackson', year: 1982, description: 'add9コードの響きがファンキーでモダンな雰囲気を演出。' },
      { title: 'Butterfly', artist: '木村カエラ', year: 2009, description: 'テンションコードがポップスに洗練された響きを加えている好例。' },
      { title: 'Spain', artist: 'Chick Corea', year: 1972, description: 'テンションコードを駆使したフュージョンの傑作。13thや#11が多用されています。' },
    ],
    audioDemo: {
      type: 'chord',
      notes: [[60, 64, 67, 70, 74], [60, 64, 67, 71, 74], [60, 63, 67, 70, 74, 77]],
      labels: ['C9', 'CM9', 'Cm11'],
      duration: 1200,
    },
  },
  {
    slug: 'sus-chord',
    title: 'サスペンデッドコード (sus)',
    category: 'chords',
    shortDescription: '3度を2度や4度に置き換えた浮遊感のあるコード',
    description: `サスペンデッドコード（sus）は、通常のトライアドの3度の音を2度や4度に置き換えたコードです。

**sus4**: ルート + 完全4度 + 完全5度
  Csus4 = C - F - G（3度のEがFに上がる）

**sus2**: ルート + 長2度 + 完全5度
  Csus2 = C - D - G（3度のEがDに下がる）

**特徴**：
- 長3度も短3度もないため、メジャーでもマイナーでもない浮遊感
- 解決したがる性質（sus4 → メジャー/マイナーなど）
- 「保留された」（suspended）という名前の由来
- ポップス・ロックではsus4→メジャーの解決が定番

7thを加えた**7sus4**（例：C7sus4 = C-F-G-B♭）もよく使われます。`,
    relatedTerms: ['major-triad', 'minor-triad', 'seventh-chord'],
    songExamples: [
      { title: 'Pinball Wizard', artist: 'The Who', year: 1969, description: 'sus4コードの解決を繰り返す印象的なイントロ。ロックにおけるsusの定番使用例。' },
      { title: 'Every Breath You Take', artist: 'The Police', year: 1983, description: 'Asus4→Aの解決がイントロのアルペジオで効果的に使われている。' },
      { title: 'Tom Sawyer', artist: 'Rush', year: 1981, description: 'sus4コードのパワフルなリフが楽曲の推進力を生んでいる。' },
      { title: 'Hard to Say I\'m Sorry', artist: 'Chicago', year: 1982, description: 'sus4→メジャーの解決が感情的なサビを演出するバラード。' },
    ],
    audioDemo: {
      type: 'chord',
      notes: [[60, 65, 67], [60, 64, 67], [60, 62, 67], [60, 64, 67]],
      labels: ['Csus4', 'C (解決)', 'Csus2', 'C (解決)'],
      duration: 800,
    },
  },
  {
    slug: 'dim-chord',
    title: 'ディミニッシュコード (dim)',
    category: 'chords',
    shortDescription: '短3度を重ねた緊張感のあるコード',
    description: `ディミニッシュコード（dim）は、短3度を等間隔に重ねた対称的な構造を持つコードです。

**ディミニッシュトライアド (dim)**: ルート + 短3度 + 減5度
  Cdim = C - E♭ - G♭

**ディミニッシュセブンス (dim7)**: ルート + 短3度 + 減5度 + 減7度
  Cdim7 = C - E♭ - G♭ - B♭♭(=A)

**特徴**：
- dim7は短3度の等間隔で構成されるため、3つの転回形が全て同じ構造
- 12音中、dim7コードは実質3種類しか存在しない
- 経過和音やドミナント代理として頻用
- クラシック、ジャズ、映画音楽で緊張感・不安感の演出に活躍

**使い方**：パッシングディミニッシュ（例：C → C#dim7 → Dm7）が定番。`,
    relatedTerms: ['seventh-chord', 'diatonic-chord', 'secondary-dominant'],
    songExamples: [
      { title: 'Michelle', artist: 'The Beatles', year: 1965, description: 'ディミニッシュコードが半音階的な動きの中で使われ、フランス的な洗練された雰囲気を演出。' },
      { title: 'God Only Knows', artist: 'The Beach Boys', year: 1966, description: 'パッシングディミニッシュが楽曲に複雑で美しいハーモニーを与えている。' },
      { title: 'Still Got the Blues', artist: 'Gary Moore', year: 1990, description: 'ディミニッシュコードがブルース進行の中で緊張感のあるアクセントとして機能。' },
    ],
    audioDemo: {
      type: 'chord',
      notes: [[60, 63, 66], [60, 63, 66, 69], [61, 64, 67, 70], [60, 64, 67]],
      labels: ['Cdim', 'Cdim7', 'C#dim7→', 'C (解決)'],
      duration: 900,
    },
  },
  {
    slug: 'aug-chord',
    title: 'オーギュメントコード (aug)',
    category: 'chords',
    shortDescription: '増5度を持つ不思議な響きのコード',
    description: `オーギュメントコード（aug / +）は、メジャートライアドの5度を半音上げた（増5度にした）コードです。

**構成**: ルート + 長3度 + 増5度
  Caug = C - E - G#

**特徴**：
- 長3度の等間隔で構成される対称的なコード
- 12音中、augコードは実質4種類しか存在しない（Caug = Eaug = G#aug）
- ホールトーンスケールとの関連が深い
- 上行する半音階的なベースラインの中で経過和音として使われることが多い

**使い方**：
- I → Iaug → IV の進行（5度が半音ずつ上がる）
- ドミナントの代理として
- クリシェ（内声の半音移動）の中で`,
    relatedTerms: ['major-triad', 'whole-tone-scale', 'dim-chord'],
    songExamples: [
      { title: 'Oh! Darling', artist: 'The Beatles', year: 1969, description: 'E→E+→Aの進行でオーギュメントが使われ、切迫感のある響きを演出。' },
      { title: 'Crying', artist: 'Roy Orbison', year: 1961, description: 'augコードがクリシェラインの中で感情的なクライマックスを生み出している。' },
      { title: '(Sittin\' On) The Dock of the Bay', artist: 'Otis Redding', year: 1968, description: 'メロディアスな進行の中でaugが使われ、どこか浮遊感のある独特の雰囲気を演出。' },
    ],
    audioDemo: {
      type: 'chord',
      notes: [[60, 64, 67], [60, 64, 68], [60, 65, 69], [60, 64, 67]],
      labels: ['C', 'Caug', 'F', 'C'],
      duration: 800,
    },
  },
  {
    slug: 'power-chord',
    title: 'パワーコード',
    category: 'chords',
    shortDescription: 'ルートと5度だけの力強いコード',
    description: `パワーコード（5thコード）は、ルートと完全5度の2音だけで構成されるコードです。3度がないため、メジャーでもマイナーでもない中立的な響きです。

**構成**: ルート + 完全5度（+オクターブ上のルートも多い）
  C5 = C - G（- C）

**特徴**：
- 3度がないため長短の区別がない
- ディストーションとの相性が抜群
- ロック・メタルのエレキギターで最も多用されるコード形
- シンプルだが力強い響き
- 並行移動（全てのポジションで同じ指の形）が可能

パンクロックからヘヴィメタルまで、ロック系ジャンルの基盤となるコードです。`,
    relatedTerms: ['major-triad', 'minor-triad', 'interval'],
    songExamples: [
      { title: 'Smells Like Teen Spirit', artist: 'Nirvana', year: 1991, description: 'パワーコードのリフが90年代グランジの象徴。F5-B♭5-A♭5-D♭5の進行。' },
      { title: 'Smoke on the Water', artist: 'Deep Purple', year: 1972, description: 'ロック史上最も有名なリフ。パワーコードの力強さを体現した楽曲。' },
      { title: 'Iron Man', artist: 'Black Sabbath', year: 1970, description: 'ヘヴィなパワーコードリフがメタルの原型を作り上げた名曲。' },
      { title: 'Blitzkrieg Bop', artist: 'Ramones', year: 1976, description: 'パンクロックの定番。4つのパワーコードの高速チェンジ。' },
    ],
    audioDemo: {
      type: 'chord',
      notes: [[48, 55], [53, 60], [50, 57], [48, 55]],
      labels: ['C5', 'F5', 'D5', 'C5'],
      duration: 600,
    },
  },
  // ===== コード進行 =====
  {
    slug: 'diatonic-chord',
    title: 'ダイアトニックコード',
    category: 'progressions',
    shortDescription: 'スケール上に構築される7つの和音',
    description: `ダイアトニックコードは、スケールの各音をルートとして、そのスケール内の音だけで3度ずつ積み重ねて作るコードです。

**Cメジャーのダイアトニックコード（三和音）**：
| 度数 | コード | 機能 |
|------|--------|------|
| I    | C      | トニック |
| II   | Dm     | サブドミナント |
| III  | Em     | トニック代理 |
| IV   | F      | サブドミナント |
| V    | G      | ドミナント |
| VI   | Am     | トニック代理 |
| VII  | Bdim   | ドミナント代理 |

コードはトニック（安定）、ドミナント（緊張）、サブドミナント（中間）の3つの**機能**に分類され、これがコード進行の基盤となります。`,
    relatedTerms: ['major-scale', 'major-triad', 'minor-triad', 'cadence', 'two-five-one'],
    songExamples: [
      { title: 'Stand By Me', artist: 'Ben E. King', year: 1961, description: 'I-VI-IV-Vの典型的なダイアトニック進行。50年代ポップスの定番パターン。' },
      { title: '世界に一つだけの花', artist: 'SMAP', year: 2003, description: 'ダイアトニックコードのみで構成された親しみやすいJ-POPの名曲。' },
      { title: 'All of Me', artist: 'John Legend', year: 2013, description: 'ダイアトニックコードを基本にした現代のウェディングソングの定番。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 64, 67],
        [62, 65, 69],
        [64, 67, 71],
        [65, 69, 72],
        [67, 71, 74],
        [69, 72, 76],
        [71, 74, 77],
        [72, 76, 79],
      ],
      labels: ['I: C', 'II: Dm', 'III: Em', 'IV: F', 'V: G', 'VI: Am', 'VII: Bdim', 'I: C'],
      duration: 800,
    },
  },
  {
    slug: 'cadence',
    title: 'ケーデンス（終止形）',
    category: 'progressions',
    shortDescription: 'フレーズを締めくくるコード進行パターン',
    description: `ケーデンス（終止形）は、フレーズや楽曲を締めくくるコード進行のパターンです。

**主要なケーデンス**：

- **完全終止（V → I）**: 最も強い解決感。曲の終わりに使われる
  G → C

- **変格終止（IV → I）**: 「アーメン終止」とも。穏やかな解決
  F → C

- **半終止（→ V）**: ドミナントで止まり、続きを期待させる
  C → G（で一時停止）

- **偽終止（V → VI）**: 予想を裏切る意外な展開
  G → Am

ケーデンスを理解すると、楽曲の構造やフレーズ感を意識した作曲ができるようになります。`,
    relatedTerms: ['diatonic-chord', 'two-five-one', 'major-triad'],
    songExamples: [
      { title: 'Hey Jude', artist: 'The Beatles', year: 1968, description: 'V→Iの完全終止とIV→Iの変格終止が効果的に使い分けられた名曲。' },
      { title: 'Creep', artist: 'Radiohead', year: 1992, description: '偽終止（V→VI的な動き）が楽曲の「裏切り感」を生み出している。I→III→IV→ivの進行。' },
      { title: 'Let It Be', artist: 'The Beatles', year: 1970, description: '変格終止（IV→I: F→C）がゴスペル的な「アーメン」の響きを生む。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [67, 71, 74],
        [60, 64, 67],
        [65, 69, 72],
        [60, 64, 67],
        [67, 71, 74],
        [69, 72, 76],
      ],
      labels: ['V: G', 'I: C (完全終止)', 'IV: F', 'I: C (変格終止)', 'V: G', 'VI: Am (偽終止)'],
      duration: 1000,
    },
  },
  {
    slug: 'two-five-one',
    title: 'ツーファイブワン（II-V-I）',
    category: 'progressions',
    shortDescription: '最も重要なコード進行パターン',
    description: `ツーファイブワン（II-V-I）は、ジャズで最も頻出するコード進行であり、ポップスでも広く使われます。

**基本形**（Cメジャー）：Dm7 → G7 → CM7

**なぜ重要か**：
- IIm7 → V7 の動きで強い「解決への期待感」を生む
- V7 → I の動きで完全な解決感を得る
- ルートが4度ずつ上行（D→G→C）する**強進行**

**マイナーII-V-I**：
Dm7♭5 → G7(♭9) → Cm7

ジャズのスタンダード曲を分析すると、大部分がII-V-Iの連続で構成されていることがわかります。`,
    relatedTerms: ['diatonic-chord', 'cadence', 'seventh-chord', 'circle-of-fifths'],
    songExamples: [
      { title: 'Autumn Leaves', artist: 'Joseph Kosma', year: 1945, description: 'ジャズスタンダードの定番中の定番。II-V-I進行が繰り返し現れる教科書的な例。' },
      { title: 'Fly Me to the Moon', artist: 'Bart Howard', year: 1954, description: 'Am7→Dm7→G7→CM7というII-V-Iが楽曲の核。世界で最も有名なジャズスタンダードの一つ。' },
      { title: 'All the Things You Are', artist: 'Jerome Kern', year: 1939, description: '複数のキーにまたがるII-V-Iの連続で構成された、ジャズハーモニーの教科書。' },
      { title: 'Sunny', artist: 'Bobby Hebb', year: 1966, description: 'マイナーII-V-Iの繰り返しで構成されたポップスの名曲。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [62, 65, 69, 72],
        [67, 71, 74, 77],
        [60, 64, 67, 71],
      ],
      labels: ['IIm7: Dm7', 'V7: G7', 'IM7: CM7'],
      duration: 1000,
    },
    demoSongs: [
      {
        title: 'II-V-I ジャズスタンダード風',
        description: 'ジャズの基本進行II-V-Iを使ったスタンダード風の楽曲。転調を交えたII-V-Iの連続を体感できます。',
        bpm: 140,
        tracks: [
          {
            name: 'テーマ',
            instrument: 'lead',
            notes: [
              [[72], 0.5], [[74], 0.5], [[76], 1], [[74], 0.5], [[72], 0.5],
              [[71], 1], [[69], 1], [[67], 2],
              [[69], 0.5], [[71], 0.5], [[72], 1], [[71], 0.5], [[69], 0.5],
              [[67], 1], [[65], 1], [[64], 2],
            ],
          },
          {
            name: 'コンピング',
            instrument: 'piano',
            notes: [
              [[62, 65, 69, 72], 2], [[67, 71, 74, 77], 2],
              [[60, 64, 67, 71], 4],
              [[62, 65, 69, 72], 2], [[67, 71, 74, 77], 2],
              [[60, 64, 67, 71], 4],
            ],
          },
          {
            name: 'ウォーキングベース',
            instrument: 'bass',
            notes: [
              [[50], 1], [[52], 1], [[55], 1], [[53], 1],
              [[48], 1], [[50], 1], [[52], 1], [[50], 1],
              [[50], 1], [[48], 1], [[55], 1], [[53], 1],
              [[48], 1], [[50], 1], [[48], 1], [[47], 1],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'circle-of-fifths',
    title: '五度圏（サークル・オブ・フィフス）',
    category: 'progressions',
    shortDescription: '12のキーの関係を表す円環図',
    description: `五度圏は、12のキーを完全5度（7半音）の関係で円環状に配置した図です。音楽理論で最も重要なツールの一つです。

**時計回り**（5度上行）：C → G → D → A → E → B → F#/G♭ → D♭ → A♭ → E♭ → B♭ → F → C

**活用法**：
- **調号の把握**: 時計回りに#が1つずつ増え、反時計回りに♭が1つずつ増える
- **近親調**: 隣り合うキーは近い関係（転調しやすい）
- **コード進行**: 反時計回り（4度進行）は最も自然なルートモーション
- **II-V-I**: 反時計回りに3つ連続 = ツーファイブワン

五度圏を覚えると、キー・コード進行・転調の理解が一気に深まります。`,
    relatedTerms: ['two-five-one', 'cadence', 'diatonic-chord', 'key-signature'],
    songExamples: [
      { title: 'I Will Survive', artist: 'Gloria Gaynor', year: 1978, description: '五度圏を反時計回りに進むコード進行（Am→Dm→G→C→F→Bdim→E）が見事。' },
      { title: 'Fly Me to the Moon', artist: 'Frank Sinatra', year: 1964, description: '4度進行（五度圏の反時計回り）で構成された美しいコード進行の教科書。' },
      { title: '白日', artist: 'King Gnu', year: 2019, description: '転調を多用した楽曲。五度圏上で近い関係のキーへの転調が自然な流れを作っている。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 64, 67],
        [65, 69, 72],
        [58, 62, 65],
        [63, 67, 70],
        [56, 60, 63],
      ],
      labels: ['C', 'F', 'B♭', 'E♭', 'A♭'],
      duration: 800,
    },
  },
  {
    slug: 'canon-progression',
    title: 'カノン進行',
    category: 'progressions',
    shortDescription: 'パッヘルベルのカノンに由来する王道進行',
    description: `カノン進行は、パッヘルベルの「カノン ニ長調」に由来する、最もポピュラーなコード進行の一つです。

**基本形**（Cメジャー）：I → V → VIm → IIIm → IV → I → IV → V
C → G → Am → Em → F → C → F → G

**なぜ人気なのか**：
- ベースラインが順次下行（C→B→A→G→F→E→F→G）し、美しい対旋律を形成
- 明るく感動的な響き
- サビで使うと「王道感」が出る
- J-POPでは「カノンコード」として知られ、数えきれないヒット曲に使用

**バリエーション**：
- IIImをIII（メジャー）にしてよりポップに
- ベースラインをクリシェとして活用
- IVの代わりにIImを使う`,
    relatedTerms: ['diatonic-chord', 'royal-road', 'cadence'],
    songExamples: [
      { title: 'Canon in D', artist: 'パッヘルベル', year: 1680, description: 'この進行の原点。バロック時代から現代まで愛される普遍的な美しさ。' },
      { title: 'さくら (独唱)', artist: '森山直太朗', year: 2003, description: 'カノン進行の王道的な使い方。サビの感動的な展開を支えている。' },
      { title: 'Love Story', artist: 'Taylor Swift', year: 2008, description: 'カノン進行をアレンジしたカントリーポップの大ヒット。' },
      { title: 'Let It Be', artist: 'The Beatles', year: 1970, description: '変形カノン進行（C-G-Am-F）がゴスペル的な感動を生む。' },
      { title: 'マリーゴールド', artist: 'あいみょん', year: 2018, description: 'サビでカノン進行を使用。J-POPにおけるカノン進行の代表的な活用例。' },
      { title: 'Graduation (Friends Forever)', artist: 'Vitamin C', year: 1999, description: 'パッヘルベルのカノンを直接引用した卒業ソング。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 64, 67], [55, 59, 62], [57, 60, 64], [52, 56, 59],
        [53, 57, 60], [48, 52, 55], [53, 57, 60], [55, 59, 62],
      ],
      labels: ['I: C', 'V: G/B', 'VIm: Am', 'IIIm: Em/G', 'IV: F', 'I: C/E', 'IV: F', 'V: G'],
      duration: 700,
    },
  },
  {
    slug: 'royal-road',
    title: '王道進行（IV→V→IIIm→VIm）',
    category: 'progressions',
    shortDescription: 'J-POPで最も使われる感動的な進行',
    description: `王道進行は、J-POPのサビで最も頻繁に使われるコード進行です。

**基本形**（Cメジャー）：F → G → Em → Am
IV → V → IIIm → VIm

**特徴**：
- サブドミナント(IV)から始まるため、いきなり「動き」がある
- V→IIIm で偽終止的な意外性
- IIIm→VIm で哀愁のある解決
- 明るさと切なさが同居する、日本人好みの響き

**バリエーション**：
- IV → V → IIIm7 → VI（VIをメジャーにして明るく）
- IVmaj7 → V7 → IIIm7 → VIm7（セブンスで洗練）
- IV → V/IV → IIIm → VIm（ベースペダル）

この進行を知るだけで、J-POPの半分以上のサビが理解できるとも言われます。`,
    relatedTerms: ['diatonic-chord', 'canon-progression', 'subdominant-minor'],
    songExamples: [
      { title: '小さな恋のうた', artist: 'MONGOL800', year: 2001, description: '王道進行を使ったストレートなロックナンバー。青春感あふれるサビの定番。' },
      { title: '残酷な天使のテーゼ', artist: '高橋洋子', year: 1995, description: 'サビで王道進行を使用。アニメソングの金字塔。' },
      { title: '瞳をとじて', artist: '平井堅', year: 2004, description: '王道進行の切なさを最大限に活かしたバラード。' },
      { title: 'HANABI', artist: 'Mr.Children', year: 2008, description: 'サビの王道進行にテンションを加えた洗練されたアレンジ。' },
      { title: '紅蓮華', artist: 'LiSA', year: 2019, description: '王道進行のバリエーションを使った力強いアニメソング。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [65, 69, 72], [67, 71, 74], [64, 67, 71], [57, 60, 64],
      ],
      labels: ['IV: F', 'V: G', 'IIIm: Em', 'VIm: Am'],
      duration: 900,
    },
  },
  {
    slug: 'subdominant-minor',
    title: 'サブドミナントマイナー',
    category: 'progressions',
    shortDescription: 'メジャーキーに切なさを加える借用コード',
    description: `サブドミナントマイナーは、メジャーキーの楽曲で同主短調（同じルートのマイナーキー）からIVm（サブドミナントマイナー）を借用するテクニックです。

**基本例**（Cメジャー）：
通常のIV = F（F-A-C）
サブドミナントマイナー = Fm（F-A♭-C）

**使い方**：
- **IV → IVm → I**: サビの最後で切なさを加える
- **I → IVm**: 一気に哀愁を呼ぶ
- A♭の音（♭6th）が独特の切なさの正体

**関連するコード**：
- **♭VI (A♭)**: 同じ♭6thの音を含む
- **♭VII (B♭)**: 同主短調からの借用
- **IVm7 (Fm7)**: セブンスを加えてよりジャジーに

J-POPの「泣きサビ」の最終兵器とも呼ばれるテクニックです。`,
    relatedTerms: ['diatonic-chord', 'royal-road', 'cadence'],
    songExamples: [
      { title: 'Creep', artist: 'Radiohead', year: 1992, description: 'G→B→C→Cmの進行でサブドミナントマイナー（Cm）が楽曲の「不気味な切なさ」を生んでいる。' },
      { title: 'In My Life', artist: 'The Beatles', year: 1965, description: 'IVmが使われ、ノスタルジックな切なさが印象に残る名バラード。' },
      { title: 'Space Oddity', artist: 'David Bowie', year: 1969, description: 'Fmajor→Fminorの動きが宇宙の孤独感を表現。サブドミナントマイナーの名使用例。' },
      { title: 'ひまわりの約束', artist: '秦基博', year: 2014, description: 'サビ終わりでサブドミナントマイナーが使われ、切ない余韻を残すJ-POPバラード。' },
      { title: 'Yesterday', artist: 'The Beatles', year: 1965, description: 'F→Fmに一瞬移る部分が楽曲の切なさのピーク。ビートルズはこの手法の名手。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 64, 67], [65, 69, 72], [65, 68, 72], [60, 64, 67],
      ],
      labels: ['I: C', 'IV: F', 'IVm: Fm', 'I: C'],
      duration: 1000,
    },
  },
  {
    slug: 'secondary-dominant',
    title: 'セカンダリードミナント',
    category: 'progressions',
    shortDescription: 'ダイアトニック外のドミナントで色彩を加える',
    description: `セカンダリードミナント（副属七）は、ダイアトニックコードのいずれかをI（トニック）と見立て、そのV7を挿入するテクニックです。

**基本例**（Cメジャー）：
- **V7/II (A7)**: Dm7へ解決 → A7 → Dm7
- **V7/III (B7)**: Em7へ解決 → B7 → Em7
- **V7/IV (C7)**: Fへ解決 → C7 → F
- **V7/V (D7)**: G7へ解決 → D7 → G7
- **V7/VI (E7)**: Amへ解決 → E7 → Am

**効果**：
- ダイアトニックだけでは得られない「引力」と「色彩」を加える
- 一瞬だけ転調したような鮮やかな響き
- 特にV7/Vは「ダブルドミナント」と呼ばれ、非常に多用される

セカンダリードミナントを使いこなすと、コード進行の色彩が一気に豊かになります。`,
    relatedTerms: ['diatonic-chord', 'two-five-one', 'cadence', 'modulation'],
    songExamples: [
      { title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', year: 1987, description: 'D→C→G→Dの進行中にセカンダリードミナントが使われ、ロックに高揚感を加えている。' },
      { title: 'I Got Rhythm', artist: 'George Gershwin', year: 1930, description: 'セカンダリードミナントの連続で色彩豊かな進行を実現したジャズスタンダード。' },
      { title: 'Georgia on My Mind', artist: 'Ray Charles', year: 1960, description: '各コードへのセカンダリードミナントが楽曲に深みと温かさを与えている。' },
      { title: 'Dancing Queen', artist: 'ABBA', year: 1976, description: 'ダブルドミナント（V/V）が使われ、サビの高揚感を増幅。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 64, 67], [69, 73, 76, 79], [62, 65, 69, 72], [67, 71, 74, 77], [60, 64, 67, 71],
      ],
      labels: ['I: C', 'V7/II: A7', 'IIm7: Dm7', 'V7: G7', 'IM7: CM7'],
      duration: 900,
    },
  },
  {
    slug: 'modulation',
    title: '転調（モジュレーション）',
    category: 'progressions',
    shortDescription: '楽曲の途中でキーを変える技法',
    description: `転調（モジュレーション）は、楽曲の途中でキー（調）を変えるテクニックです。

**主な転調方法**：

- **直接転調（ダイレクト）**: 何の準備もなく新しいキーに移る
  ラストサビで半音上げる手法が典型例

- **ピボットコード転調**: 2つのキーに共通するコード（ピボット）を経由
  CメジャーのAmは、GメジャーのIImでもある→Gメジャーへ

- **ドミナント転調**: 新しいキーのV7を挟んで転調
  D7 → Gメジャーへ

- **同主調転調**: CメジャーからCマイナーへ（同じルート）

**転調の距離**：
- **半音上（例: C→D♭）**: 劇的な盛り上がり
- **全音上（例: C→D）**: 開放的な広がり
- **短3度上（例: C→E♭）**: ドラマティック
- **4度上（例: C→F）**: 自然で滑らか`,
    relatedTerms: ['circle-of-fifths', 'diatonic-chord', 'secondary-dominant'],
    songExamples: [
      { title: 'Love on Top', artist: 'Beyonce', year: 2011, description: 'サビが4回繰り返され、その度に半音ずつ転調する驚異的な楽曲構成。' },
      { title: 'Man in the Mirror', artist: 'Michael Jackson', year: 1988, description: 'ラストサビでの半音上げ転調の最も有名な例の一つ。メッセージの力強さが増幅。' },
      { title: '天体観測', artist: 'BUMP OF CHICKEN', year: 2001, description: 'サビで転調し、感情的なクライマックスを作り出すJ-ROCKの名曲。' },
      { title: 'My Heart Will Go On', artist: 'Celine Dion', year: 1997, description: 'ラストで半音上がる転調が映画の壮大さを最高潮に。' },
      { title: 'Bohemian Rhapsody', artist: 'Queen', year: 1975, description: '複数回の大胆な転調がオペラ的なドラマを実現した史上最も野心的なロック曲。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 64, 67], [65, 69, 72], [67, 71, 74], [60, 64, 67],
        [62, 66, 69], [67, 71, 74], [69, 73, 76], [62, 66, 69],
      ],
      labels: ['C: I', 'C: IV', 'C: V', 'C: I', 'D: I (転調!)', 'D: IV', 'D: V', 'D: I'],
      duration: 800,
    },
  },
  // ===== リズム =====
  {
    slug: 'time-signature',
    title: '拍子記号',
    category: 'rhythm',
    shortDescription: '楽曲のリズム構造を定義する記号',
    description: `拍子記号は、1小節あたりの拍数と、1拍の音価を表す記号です。

**主な拍子**：
- **4/4拍子**: 最も一般的。4分音符が4つで1小節。ロック、ポップスの標準
- **3/4拍子**: ワルツのリズム。4分音符が3つで1小節
- **6/8拍子**: 2拍子系の複合拍子。付点4分音符が2つで1小節
- **2/4拍子**: マーチ（行進曲）に多い
- **5/4拍子**: 変拍子。テイク・ファイブ(Dave Brubeck)が有名
- **7/8拍子**: 変拍子。プログレやバルカン音楽に見られる

拍子を理解すると、楽曲のグルーヴ感やノリの正体が見えてきます。`,
    relatedTerms: ['syncopation', 'polyrhythm'],
    songExamples: [
      { title: 'Take Five', artist: 'Dave Brubeck', year: 1959, description: '5/4拍子の最も有名な楽曲。変拍子でありながら自然にスウィングする名演。' },
      { title: 'Money', artist: 'Pink Floyd', year: 1973, description: '7/4拍子（メインリフ）→4/4拍子（ソロ）の切り替えが巧みな変拍子ロック。' },
      { title: 'Blue Rondo a la Turk', artist: 'Dave Brubeck', year: 1959, description: '9/8拍子（2+2+2+3の分割）が使われたジャズの名曲。トルコ音楽の影響。' },
      { title: '美しく青きドナウ', artist: 'ヨハン・シュトラウス2世', year: 1867, description: '3/4拍子（ワルツ）の最も有名な例。優雅な3拍子の揺れを体感できます。' },
      { title: 'Schism', artist: 'Tool', year: 2001, description: '5/8、7/8など複数の変拍子が入り組んだプログレッシブメタルの傑作。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 64, 67], [60, 64, 67], [60, 64, 67], [60, 64, 67],
        [60, 64, 67], [60, 64, 67], [60, 64, 67],
        [60, 64, 67], [60, 64, 67], [60, 64, 67], [60, 64, 67], [60, 64, 67],
      ],
      labels: ['4/4: 1', '2', '3', '4', '3/4: 1', '2', '3', '6/8: 1', '2', '3', '4', '5'],
      duration: 500,
    },
    demoSongs: [
      {
        title: '4/4拍子 vs 3/4拍子',
        description: '4/4拍子（行進的）と3/4拍子（ワルツ的）の違いを聴き比べてみましょう。',
        bpm: 120,
        tracks: [
          {
            name: '4/4 メロディ',
            instrument: 'piano',
            notes: [
              [[60], 1], [[64], 1], [[67], 1], [[64], 1],
              [[60], 1], [[64], 1], [[67], 1], [[64], 1],
            ],
          },
          {
            name: '4/4 ベース',
            instrument: 'bass',
            notes: [
              [[48], 1], null, [[48], 1], null,
              [[48], 1], null, [[48], 1], null,
            ],
          },
          {
            name: '3/4 メロディ',
            instrument: 'lead',
            notes: [
              [[72], 1], [[76], 1], [[79], 1],
              [[72], 1], [[76], 1], [[79], 1],
              [[72], 1], [[76], 1], [[79], 1],
            ],
          },
          {
            name: '3/4 ベース',
            instrument: 'bass',
            notes: [
              [[60], 1], null, null,
              [[60], 1], null, null,
              [[60], 1], null, null,
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'syncopation',
    title: 'シンコペーション',
    category: 'rhythm',
    shortDescription: '強拍をずらしてグルーヴを生む技法',
    description: `シンコペーションは、本来の強拍（アクセント）の位置をずらすことでリズムに推進力や意外性を生み出す技法です。

**基本的なパターン**：
- **裏拍アクセント**: 2拍目・4拍目にアクセントを置く（ロックの基本）
- **先取り**: 次の拍の音を半拍早く出す（ポップスで多用）
- **タイ**: 弱拍から強拍にタイで繋ぐ

シンコペーションは、ファンク・ジャズ・ラテン音楽の生命線です。これがないと音楽は機械的で平坦な印象になります。

16ビートのファンクではほぼ全てのフレーズがシンコペーションで構成されています。`,
    relatedTerms: ['time-signature', 'polyrhythm'],
    songExamples: [
      { title: 'Superstition', artist: 'Stevie Wonder', year: 1972, description: 'クラビネットのシンコペーションが強烈なグルーヴを生み出すファンクの名曲。' },
      { title: 'Billie Jean', artist: 'Michael Jackson', year: 1982, description: 'ベースラインのシンコペーションが独特のドライブ感を生む。裏拍の使い方が見事。' },
      { title: 'Get Lucky', artist: 'Daft Punk', year: 2013, description: 'ギターのカッティングがシンコペーションの教科書的な例。Nile Rodgersのプレイ。' },
      { title: 'Oye Como Va', artist: 'Santana', year: 1970, description: 'ラテンロックのシンコペーション。チャチャのリズムパターンが基盤。' },
      { title: 'Chameleon', artist: 'Herbie Hancock', year: 1973, description: 'ファンクジャズの傑作。全てのパートがシンコペーションで絡み合うグルーヴ。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60], [], [60], [],
        [60], [60], [], [60],
      ],
      labels: ['●', '○', '●', '○', '●', '●', '○', '●'],
      duration: 300,
    },
    demoSongs: [
      {
        title: 'シンコペーションの効果',
        description: 'ストレートなリズムとシンコペーションを比較。裏拍にアクセントが来ると一気にグルーヴィーに。',
        bpm: 110,
        tracks: [
          {
            name: 'ストレート',
            instrument: 'piano',
            notes: [
              [[60, 64, 67], 1], [[60, 64, 67], 1], [[60, 64, 67], 1], [[60, 64, 67], 1],
              [[65, 69, 72], 1], [[65, 69, 72], 1], [[65, 69, 72], 1], [[65, 69, 72], 1],
            ],
          },
          {
            name: 'シンコペーション',
            instrument: 'synth',
            notes: [
              null, [[60, 64, 67], 1], null, [[60, 64, 67], 1],
              [[65, 69, 72], 1], null, [[65, 69, 72], 1], null,
            ],
          },
          {
            name: 'ベース',
            instrument: 'bass',
            notes: [
              [[48], 1], null, [[48], 1], null,
              [[53], 1], null, [[53], 1], null,
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'polyrhythm',
    title: 'ポリリズム',
    category: 'rhythm',
    shortDescription: '複数のリズムパターンを同時に重ねる技法',
    description: `ポリリズムは、異なるリズムパターンを同時に演奏する技法です。

**基本的なポリリズム**：
- **2対3（ヘミオラ）**: 2拍子と3拍子を同時に → 最も基本的
- **3対4**: 3連符と4分音符を同時に
- **4対3**: 4つ割と3連符

**身近な例**：
- 右手で3拍子、左手で2拍子を叩くと「タカタ・タカタ」
- 6/8拍子と3/4拍子は同じ長さだが分割が違う（ヘミオラ）

**活用される音楽**：
- アフリカ音楽（ポリリズムの宝庫）
- ラテン音楽（クラーベのパターン）
- プログレッシブロック
- ミニマルミュージック（Steve Reich等）

複数のリズムが交錯して生まれる独特の揺れが、音楽にダイナミックな立体感を与えます。`,
    relatedTerms: ['time-signature', 'syncopation'],
    songExamples: [
      { title: 'ポリリズム', artist: 'Perfume', year: 2007, description: 'タイトル通りポリリズムをテーマにしたJ-POPヒット。イントロで3対4のポリリズムが体感できる。' },
      { title: 'Kashmir', artist: 'Led Zeppelin', year: 1975, description: 'ギターの3拍子フレーズとドラムの4拍子が交錯するロックにおけるポリリズムの名例。' },
      { title: 'Clapping Music', artist: 'Steve Reich', year: 1972, description: '2人の手拍子によるミニマルミュージック。フェイズシフトによるポリリズムの原理を体験。' },
      { title: 'Africa', artist: 'Toto', year: 1982, description: 'イントロのマリンバがポリリズム的パターンを演奏。アフリカ音楽へのオマージュ。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60], [], [60], [60], [], [60],
        [67], [67], [67], [67], [67], [67],
      ],
      labels: ['3: ●', '○', '●', '3: ●', '○', '●', '2: ●', '●', '2: ●', '●', '2: ●', '●'],
      duration: 250,
    },
    demoSongs: [
      {
        title: '2対3のポリリズム（ヘミオラ）',
        description: '上のパートが3拍子、下のパートが2拍子。同時に鳴ると独特のうねりが生まれます。',
        bpm: 100,
        tracks: [
          {
            name: '3拍子パート',
            instrument: 'marimba',
            notes: [
              [[72], 2], [[72], 2], [[72], 2],
              [[72], 2], [[72], 2], [[72], 2],
            ],
          },
          {
            name: '2拍子パート',
            instrument: 'piano',
            notes: [
              [[60, 64], 3], [[60, 64], 3],
              [[60, 64], 3], [[60, 64], 3],
            ],
          },
          {
            name: 'ベース',
            instrument: 'bass',
            notes: [
              [[48], 6], [[48], 6],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'shuffle',
    title: 'シャッフル / スウィング',
    category: 'rhythm',
    shortDescription: '跳ねるリズムでグルーヴを生み出す',
    description: `シャッフル（スウィング）は、均等な8分音符を「長-短」のペアにして跳ねさせるリズムフィールです。

**ストレート vs シャッフル**：
- ストレート: ♪♪ = 等分（1:1）
- シャッフル: ♪.♪ = 3連符の1・3番目（2:1程度）

**度合い**：
- **ハードスウィング**: ほぼ付点8分+16分（ジャズ）
- **ミディアムスウィング**: 少し跳ねる（ブルース）
- **ライトスウィング**: わずかに不均等（ヒップホップ、ネオソウル）

**ジャンル別の特徴**：
- ジャズ: スウィングと呼ぶ。テンポによって跳ね方が変わる
- ブルース: シャッフルと呼ぶ。12/8的なグルーヴ
- ファンク: 16分音符のシャッフル（ハーフタイムシャッフル）

Jeff PorcaloのRosannaシャッフル（ハーフタイムシャッフル）はドラマーの間で伝説的です。`,
    relatedTerms: ['syncopation', 'time-signature'],
    songExamples: [
      { title: 'Rosanna', artist: 'Toto', year: 1982, description: 'Jeff Porcaroによるハーフタイムシャッフルの最も有名な例。ドラム教材の定番。' },
      { title: 'Pride and Joy', artist: 'Stevie Ray Vaughan', year: 1983, description: 'テキサスブルースシャッフルの完璧な例。跳ねるリズムが強烈なグルーヴを生む。' },
      { title: 'Fool in the Rain', artist: 'Led Zeppelin', year: 1979, description: 'John Bonhamのハーフタイムシャッフルが炸裂するロック曲。' },
      { title: 'Ain\'t Misbehavin\'', artist: 'Fats Waller', year: 1929, description: 'スウィングジャズの代表曲。自然で心地よいスウィング感の教科書。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60], [64], [67], [64],
        [60], [64], [67], [64],
      ],
      labels: ['ストレート→', '', '', '', 'シャッフル→', '', '', ''],
      duration: 350,
    },
    demoSongs: [
      {
        title: 'シャッフルビート',
        description: 'シャッフル（跳ねる）リズムの雰囲気。3連符ベースのスウィング感を体感してみましょう。',
        bpm: 120,
        tracks: [
          {
            name: 'メロディ',
            instrument: 'piano',
            notes: [
              [[60], 2], [[64], 1], [[67], 2], [[64], 1],
              [[65], 2], [[69], 1], [[72], 2], [[69], 1],
            ],
          },
          {
            name: 'ベース',
            instrument: 'bass',
            notes: [
              [[48], 2], [[48], 1], [[48], 2], [[48], 1],
              [[53], 2], [[53], 1], [[53], 2], [[53], 1],
            ],
          },
        ],
      },
    ],
  },
  // ===== アレンジ =====
  {
    slug: 'voice-leading',
    title: 'ボイスリーディング（声部連結）',
    category: 'arrangement',
    shortDescription: 'コード間の音の動きを滑らかにする技法',
    description: `ボイスリーディング（声部連結）は、コードチェンジの際に各声部（パート）の音をなるべく近い音に移動させる技法です。

**基本原則**：
- **共通音保持**: 2つのコードに共通する音はそのまま残す
- **最小移動**: 各声部はなるべく近い音へ（2度以内が理想）
- **反行・斜行**: 声部同士が反対方向か片方だけ動くのが美しい
- **平行5度・8度の禁則**: クラシックでは避けるべきとされる

例（C → F）：
- ソプラノ: E → F（半音上行）
- アルト: G → A（全音上行）
- バス: C → C（共通音保持）→ F

ボイスリーディングが上手いと、コード進行が自然に繋がり、各パートがメロディアスに響きます。`,
    relatedTerms: ['diatonic-chord', 'cadence', 'seventh-chord', 'counterpoint'],
    songExamples: [
      { title: 'Something', artist: 'The Beatles', year: 1969, description: '各声部が滑らかに半音移動するボイスリーディングの教科書的な例。George Harrisonの名曲。' },
      { title: 'Clair de Lune', artist: 'Claude Debussy', year: 1905, description: '声部が微細に動くことで生まれる繊細な色彩変化。印象派和声のボイスリーディング。' },
      { title: 'Blackbird', artist: 'The Beatles', year: 1968, description: '2声のボイスリーディングでギター1本でハーモニーの動きを表現した名曲。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 64, 67],
        [60, 65, 69],
        [59, 62, 67],
        [60, 64, 67],
      ],
      labels: ['C (E,G,C)', 'F (F,A,C)', 'G (D,G,B)', 'C (E,G,C)'],
      duration: 1000,
    },
    demoSongs: [
      {
        title: '滑らかなボイスリーディング',
        description: '各声部が最小限の動きで次のコードに移行する例。上段がボイスリーディングあり、比較してみてください。',
        bpm: 72,
        tracks: [
          {
            name: 'ソプラノ',
            instrument: 'lead',
            notes: [
              [[67], 4], [[69], 4], [[67], 4], [[67], 4],
            ],
          },
          {
            name: 'アルト＆テナー',
            instrument: 'piano',
            notes: [
              [[60, 64], 4], [[60, 65], 4], [[59, 62], 4], [[60, 64], 4],
            ],
          },
          {
            name: 'バス',
            instrument: 'bass',
            notes: [
              [[48], 4], [[53], 4], [[43], 4], [[48], 4],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'counterpoint',
    title: '対位法（カウンターポイント）',
    category: 'arrangement',
    shortDescription: '独立した複数の旋律を同時に響かせる技法',
    description: `対位法（カウンターポイント）は、複数の独立したメロディ（声部）を同時に鳴らしながら、美しいハーモニーを作り出す技法です。

**基本的な種類**：

- **1:1対位法（1対1）**: 各声部が同じリズムで動く
- **1:2対位法**: 1つの全音符に対して2つの2分音符
- **自由対位法**: リズムが自由な実践的対位法
- **模倣対位法**: 1つの旋律を他の声部が追いかける（カノン、フーガ）

**基本ルール**：
- 各声部が独立したメロディとして成立すること
- 声部間で美しいハーモニーが生まれること
- 平行5度・8度を避ける
- 反行（逆方向）・斜行（片方だけ動く）を多用

J.S.バッハは対位法の最高の達人として知られています。`,
    relatedTerms: ['voice-leading', 'bass-line'],
    songExamples: [
      { title: 'Fugue in G minor (BWV 578)', artist: 'J.S. Bach', year: 1708, description: '「小フーガ」として知られるバッハの名作。4声部の対位法が見事に展開。' },
      { title: 'Eleanor Rigby', artist: 'The Beatles', year: 1966, description: 'ボーカルと弦楽器の対位法的な動きが楽曲にクラシカルな深みを与えている。' },
      { title: 'Scarborough Fair', artist: 'Simon & Garfunkel', year: 1966, description: '2つのボーカルメロディが対位法的に絡み合う美しいアレンジ。' },
      { title: 'Invention No.1 in C major', artist: 'J.S. Bach', year: 1723, description: '2声のインヴェンション。対位法学習の入門として最適な教材。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 72], [62, 71], [64, 69], [65, 67],
        [67, 65], [69, 64], [71, 62], [72, 60],
      ],
      labels: ['C+C5', 'D+B4', 'E+A4', 'F+G4', 'G+F4', 'A+E4', 'B+D4', 'C5+C4'],
      duration: 600,
    },
    demoSongs: [
      {
        title: '2声の対位法（カノン風）',
        description: '上のパートを下のパートが2拍遅れで追いかける。同じ旋律が重なり合う美しさを体感。',
        bpm: 100,
        tracks: [
          {
            name: '第1声部',
            instrument: 'lead',
            notes: [
              [[72], 1], [[74], 1], [[76], 1], [[77], 1],
              [[79], 2], [[76], 1], [[72], 1],
              [[74], 2], null, null,
            ],
          },
          {
            name: '第2声部',
            instrument: 'piano',
            notes: [
              null, null,
              [[60], 1], [[62], 1], [[64], 1], [[65], 1],
              [[67], 2], [[64], 1], [[60], 1],
            ],
          },
          {
            name: '持続低音',
            instrument: 'pad',
            notes: [
              [[48], 4], [[48], 4], [[48], 2],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'bass-line',
    title: 'ベースライン',
    category: 'arrangement',
    shortDescription: '楽曲の低音部を構成するメロディ',
    description: `ベースラインは、楽曲の最低音域を担当するパートのメロディで、コードのルートを示すと同時にリズムの骨格を形成します。

**主なベースラインのタイプ**：

- **ルート弾き**: コードのルート音を弾く最もシンプルな形
- **ルート＋5度**: ルートと5度を交互に弾く（カントリー、ロック）
- **ウォーキングベース**: 4分音符で滑らかに動くジャズの定番
- **ペダルポイント**: 同じ音を持続（緊張感の演出）
- **カウンターメロディ**: メロディに対する対旋律として機能
- **スラップベース**: ファンクで多用されるパーカッシブな奏法

**良いベースラインの条件**：
- コードの響きを支える
- リズムの推進力を生む
- メロディと対位法的に美しく動く
- グルーヴ感を生み出す`,
    relatedTerms: ['voice-leading', 'counterpoint', 'diatonic-chord'],
    songExamples: [
      { title: 'Another One Bites the Dust', artist: 'Queen', year: 1980, description: 'John Deaconによる印象的なベースリフ。シンプルだが圧倒的に記憶に残る。' },
      { title: 'Come Together', artist: 'The Beatles', year: 1969, description: 'スライドするベースラインがファンキーなグルーヴを生む。McCartney屈指の名演。' },
      { title: 'YYZ', artist: 'Rush', year: 1981, description: 'Geddy Leeの技巧的なベースラインがプログレロックの頂点を示す。' },
      { title: 'Hysteria', artist: 'Muse', year: 2003, description: '高速アルペジオのベースラインが楽曲を支配する現代ロックの名曲。' },
      { title: 'What\'s Going On', artist: 'Marvin Gaye', year: 1971, description: 'James Jamersonのウォーキングベースが楽曲全体に温かいグルーヴを与えている。' },
      { title: 'Teen Town', artist: 'Weather Report', year: 1977, description: 'Jaco Pastoriusの超絶技巧ベースライン。ジャズフュージョンの金字塔。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [48], [50], [52], [53],
        [55], [53], [52], [50],
      ],
      labels: ['C', 'D', 'E', 'F', 'G', 'F', 'E', 'D'],
      duration: 400,
    },
    demoSongs: [
      {
        title: 'ウォーキングベースライン',
        description: '4分音符で滑らかに動くジャズの定番ベースライン。コードとの関係に注目。',
        bpm: 130,
        tracks: [
          {
            name: 'コード',
            instrument: 'piano',
            notes: [
              [[60, 64, 67], 4], [[65, 69, 72], 4],
              [[55, 59, 62], 4], [[60, 64, 67], 4],
            ],
          },
          {
            name: 'ウォーキングベース',
            instrument: 'bass',
            notes: [
              [[48], 1], [[50], 1], [[52], 1], [[53], 1],
              [[53], 1], [[55], 1], [[57], 1], [[55], 1],
              [[55], 1], [[53], 1], [[52], 1], [[50], 1],
              [[48], 1], [[52], 1], [[55], 1], [[48], 1],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'song-structure',
    title: '楽曲構成（ソングストラクチャー）',
    category: 'arrangement',
    shortDescription: 'Aメロ・Bメロ・サビなど楽曲の骨組み',
    description: `楽曲構成は、曲全体の流れを決めるセクションの並び方です。

**一般的なセクション**：
- **イントロ (Intro)**: 楽曲の導入部
- **Aメロ (Verse)**: 物語の展開部。比較的抑えめ
- **Bメロ (Pre-Chorus)**: サビへの橋渡し。期待感を高める
- **サビ (Chorus)**: 楽曲のクライマックス。最もキャッチーな部分
- **Cメロ (Bridge)**: サビ後の別展開。新しい視点を提供
- **間奏 (Interlude)**: 楽器ソロやブレイク
- **アウトロ (Outro)**: 楽曲の終結部

**定番の構成パターン**：
- **J-POP標準**: イントロ→Aメロ→Bメロ→サビ→Aメロ→Bメロ→サビ→Cメロ→大サビ→アウトロ
- **洋楽標準**: Verse→Chorus→Verse→Chorus→Bridge→Chorus
- **AABA形式**: ジャズスタンダードの基本。A(8小節)×2→B(8小節)→A(8小節)

構成を意識することで、リスナーの感情の起伏をコントロールできます。`,
    relatedTerms: ['cadence', 'modulation'],
    songExamples: [
      { title: 'Bohemian Rhapsody', artist: 'Queen', year: 1975, description: 'バラード→オペラ→ハードロック→バラードという破格の構成。楽曲構成の常識を覆した。' },
      { title: 'A Day in the Life', artist: 'The Beatles', year: 1967, description: 'ジョンとポールの異なる2曲をオーケストラで繋ぐ実験的構成。' },
      { title: 'Stairway to Heaven', artist: 'Led Zeppelin', year: 1971, description: 'アコースティック→エレクトリック→ハードロックと段階的にビルドアップする構成の教科書。' },
      { title: '夜に駆ける', artist: 'YOASOBI', year: 2019, description: 'J-POP典型のAメロ→Bメロ→サビ構成。Bメロからサビへの盛り上がりが秀逸。' },
    ],
    demoSongs: [
      {
        title: 'Aメロ→Bメロ→サビの構成例',
        description: 'Aメロは控えめ、Bメロで期待感を高め、サビで全パートが鳴る。エネルギーの対比を体感。',
        bpm: 120,
        tracks: [
          {
            name: 'メロディ',
            instrument: 'lead',
            notes: [
              // Aメロ（控えめ）
              [[60], 1], [[62], 1], [[64], 1], [[60], 1],
              // Bメロ（上昇）
              [[65], 1], [[67], 1], [[69], 1], [[71], 1],
              // サビ（高音域）
              [[72], 2], [[71], 1], [[69], 1], [[72], 2], [[67], 2],
            ],
          },
          {
            name: 'コード',
            instrument: 'piano',
            notes: [
              // Aメロ
              [[48, 60, 64], 2], [[53, 57, 60], 2],
              // Bメロ
              [[55, 59, 62], 2], [[53, 57, 60], 2],
              // サビ
              [[48, 60, 64], 2], [[53, 57, 60], 2], [[55, 59, 62], 2], [[48, 60, 64], 2],
            ],
          },
          {
            name: 'ベース',
            instrument: 'bass',
            notes: [
              // Aメロ
              [[36], 2], [[41], 2],
              // Bメロ
              [[43], 2], [[41], 2],
              // サビ
              [[36], 1], [[36], 1], [[41], 1], [[41], 1], [[43], 1], [[43], 1], [[36], 2],
            ],
          },
          {
            name: 'パッド',
            instrument: 'strings',
            notes: [
              // Aメロ - 休み
              null, null, null, null,
              // Bメロ - 少し入る
              [[67, 72], 4],
              // サビ - フル
              [[67, 72, 76], 4], [[67, 72, 76], 4],
            ],
          },
        ],
      },
    ],
  },
]

export function useTheoryDictionary() {
  const getCategories = () => categories

  const getEntries = () => entries

  const getEntry = (slug: string) => entries.find((e) => e.slug === slug)

  const getEntriesByCategory = (categoryId: string) => entries.filter((e) => e.category === categoryId)

  const getCategory = (id: string) => categories.find((c) => c.id === id)

  const searchEntries = (query: string) => {
    const q = query.toLowerCase()
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.shortDescription.toLowerCase().includes(q) ||
        e.slug.toLowerCase().includes(q) ||
        e.songExamples?.some(
          (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
        )
    )
  }

  const getRelatedEntries = (slug: string) => {
    const entry = getEntry(slug)
    if (!entry) return []
    return entry.relatedTerms.map((t) => getEntry(t)).filter(Boolean) as TheoryEntry[]
  }

  return {
    getCategories,
    getEntries,
    getEntry,
    getEntriesByCategory,
    getCategory,
    searchEntries,
    getRelatedEntries,
  }
}
