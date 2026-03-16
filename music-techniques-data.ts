export interface Song {
  title: string
  artist: string
  genre: string
  description: string
}

export interface DetailCard {
  icon: string
  title: string
  body: string
}

export interface AudioDemo {
  type: 'chord' | 'scale' | 'interval' | 'progression'
  notes: number[][]
  labels?: string[]
  duration?: number
}

export interface DemoTrack {
  name: string
  instrument: 'piano' | 'bass' | 'lead' | 'pad' | 'strings' | 'organ' | 'marimba' | 'synth'
  notes: ([number[], number] | null)[]
}

export interface DemoSong {
  title: string
  description: string
  bpm: number
  tracks: DemoTrack[]
}

export interface MusicTechnique {
  id: string
  icon: string
  name: string
  subtitle: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  details: DetailCard[]
  chips?: string[]
  tip?: string
  songs: Song[]
  audioDemo?: AudioDemo
  demoSongs?: DemoSong[]
}

export const techniques: MusicTechnique[] = [
  {
    id: 'intervals',
    icon: '📏',
    name: '音程（インターバル）',
    subtitle: 'Intervals — 2つの音の距離を測る',
    difficulty: 'beginner',
    description: '音程とは、2つの音の高さの隔たりのこと。すべてのメロディーとハーモニーの基礎であり、音楽理論を理解する出発点です。半音（ピアノの隣り合う鍵盤）を最小単位として数えます。',
    details: [
      { icon: '🎯', title: '完全音程', body: '完全1度（ユニゾン）、完全4度、完全5度、完全8度（オクターブ）。最も安定した響きを持ち、ハーモニーの骨格を形成します。パワーコードは完全5度を使った代表例です。' },
      { icon: '🔶', title: '長音程・短音程', body: '長2度/短2度、長3度/短3度、長6度/短6度、長7度/短7度。長音程は明るく、短音程は暗い響き。メジャーとマイナーの違いは3度の音程で決まります。' },
      { icon: '⚡', title: 'トライトーン（三全音）', body: '増4度/減5度にあたる6半音の音程。最も不安定で緊張感のある響き。ドミナント7thコードの中に含まれ、解決への強い推進力を生みます。「悪魔の音程」とも呼ばれた歴史があります。' },
    ],
    songs: [
      { title: 'Somewhere Over the Rainbow', artist: 'Judy Garland', genre: 'Musical', description: '冒頭のメロディーがオクターブ跳躍（完全8度）で始まる最も有名な例。虹の大きさを音程で表現。' },
      { title: 'Smoke on the Water', artist: 'Deep Purple', genre: 'Rock', description: 'ギターリフが完全4度の平行移動で構成。パワーコードの原型的な使い方。' },
      { title: 'Maria (West Side Story)', artist: 'Leonard Bernstein', genre: 'Musical', description: '「Maria」の歌い出しがトライトーンの上行。禁じられた恋の緊張感を音程で描写。' },
      { title: 'Here Comes the Sun', artist: 'The Beatles', genre: 'Pop / Rock', description: 'メロディーが長2度・長3度の順次進行を多用。穏やかで明るい雰囲気を生んでいます。' },
    ],
    audioDemo: {
      type: 'interval',
      notes: [[60, 60], [60, 61], [60, 62], [60, 64], [60, 65], [60, 67], [60, 72]],
      labels: ['完全1度', '短2度', '長2度', '長3度', '完全4度', '完全5度', '完全8度'],
      duration: 800,
    },
  },
  {
    id: 'scales',
    icon: '🎹',
    name: 'メジャースケールとマイナースケール',
    subtitle: 'Major & Minor Scales — 音楽の基本色',
    difficulty: 'beginner',
    description: 'スケール（音階）は、メロディーやコードの素材となる音の並び。メジャースケールは「全全半全全全半」、ナチュラルマイナースケールは「全半全全半全全」の音程パターンで構成されます。',
    details: [
      { icon: '☀️', title: 'メジャースケール', body: '明るく開放的な響き。ポップスの大半はメジャーキーで書かれています。Cメジャースケール: C-D-E-F-G-A-B。ドレミファソラシドそのものです。' },
      { icon: '🌙', title: 'ナチュラルマイナースケール', body: '哀愁や深みのある響き。Aマイナースケール: A-B-C-D-E-F-G。Cメジャーと同じ音を使いますが、始まる音が違うだけで印象が一変します（平行調）。' },
      { icon: '🔥', title: 'ハーモニックマイナー', body: 'ナチュラルマイナーの第7音を半音上げたスケール。V7コード（ドミナント）を作れるようになり、クラシカルでエキゾチックな響き。ネオクラシカルメタルでも多用。' },
      { icon: '💫', title: 'メロディックマイナー', body: '上行時に第6・7音を半音上げるスケール。ジャズではこれを上行・下行とも同じ形で使い、多くのジャズスケールの母体になっています。' },
    ],
    tip: 'すべてのメジャーキーには「平行短調」（相対マイナー）があり、同じ音を共有しています。例: CメジャーとAマイナー。これを知ると転調やコード借用の理解が一気に進みます。',
    songs: [
      { title: 'Let It Be', artist: 'The Beatles', genre: 'Pop / Rock', description: 'Cメジャースケールの典型的な使用例。シンプルなダイアトニックコードの美しさが際立つ名曲。' },
      { title: 'Lose Yourself', artist: 'Eminem', genre: 'Hip-Hop', description: 'Dマイナースケールベースのリフとメロディー。マイナーキーの緊迫感がリリックの緊張感と完璧にマッチ。' },
      { title: '紅', artist: 'X JAPAN', genre: 'Rock / Metal', description: 'ハーモニックマイナースケールを駆使したギターソロ。クラシカルで劇的な響きの代表例。' },
      { title: 'Donna Lee', artist: 'Charlie Parker', genre: 'Jazz', description: 'メロディックマイナー由来のフレーズが随所に。ビバップの必修曲。' },
      { title: '丸の内サディスティック', artist: '椎名林檎', genre: 'J-Pop', description: 'メジャーとマイナーを巧みに行き来し、独特の浮遊感を生み出しています。' },
    ],
    audioDemo: {
      type: 'scale',
      notes: [[60], [62], [64], [65], [67], [69], [71], [72]],
      labels: ['ド', 'レ', 'ミ', 'ファ', 'ソ', 'ラ', 'シ', 'ド'],
      duration: 400,
    },
    demoSongs: [
      {
        title: 'メジャー vs マイナースケール',
        description: 'メジャースケール（明るい）とマイナースケール（暗い）の響きの違いを聴き比べ。',
        bpm: 120,
        tracks: [
          {
            name: 'Cメジャー',
            instrument: 'piano',
            notes: [
              [[60], 1], [[62], 1], [[64], 1], [[65], 1],
              [[67], 1], [[69], 1], [[71], 1], [[72], 2],
            ],
          },
          {
            name: 'Aマイナー',
            instrument: 'piano',
            notes: [
              null, null, null, null, null, null, null, null, null,
              [[57], 1], [[59], 1], [[60], 1], [[62], 1],
              [[64], 1], [[65], 1], [[67], 1], [[69], 2],
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'modes',
    icon: '🌈',
    name: 'モード（教会旋法）',
    subtitle: 'Church Modes — 7つの色彩',
    difficulty: 'intermediate',
    description: 'メジャースケールの各音を起点に並べ替えると7つのモードが生まれます。それぞれ独特の「色」を持ち、ジャズ、映画音楽、ゲーム音楽などで幅広く活用されています。',
    details: [
      { icon: 'Ⅰ', title: 'アイオニアン', body: 'メジャースケールと同じ。最も明るく安定した響き。ポップスの基本。' },
      { icon: 'Ⅱ', title: 'ドリアン', body: 'マイナーだが♮6thを持ち、哀しさの中に温かみがある。ファンク・フュージョンで人気。' },
      { icon: 'Ⅲ', title: 'フリジアン', body: '♭2ndが特徴。スパニッシュ、フラメンコ風のエキゾチックな響き。メタルでも頻出。' },
      { icon: 'Ⅳ', title: 'リディアン', body: '#4thが特徴。浮遊感のある夢幻的な響き。映画音楽（ジョン・ウィリアムズ）で多用。' },
      { icon: 'Ⅴ', title: 'ミクソリディアン', body: 'メジャーだが♭7thを持つ。ブルージーでロック的。ギターソロの定番。' },
      { icon: 'Ⅵ', title: 'エオリアン', body: 'ナチュラルマイナーと同じ。最も一般的なマイナーの響き。' },
      { icon: 'Ⅶ', title: 'ロクリアン', body: '♭2nd・♭5thで最も不安定。実用例は少ないが、メタルやプログレで使われることも。' },
    ],
    songs: [
      { title: 'So What', artist: 'Miles Davis', genre: 'Jazz', description: 'モーダルジャズの金字塔。Dドリアンとe♭ドリアンの2つのモードだけで全曲を構成。' },
      { title: 'Oye Como Va', artist: 'Santana', genre: 'Latin Rock', description: 'Aドリアンモードのラテンロック。マイナーなのにどこか明るい独特のグルーヴ。' },
      { title: 'Flying in a Blue Dream', artist: 'Joe Satriani', genre: 'Instrumental Rock', description: 'リディアンモードの浮遊感を最大限に活かしたギターインスト。#4thの響きが空を飛ぶような感覚。' },
      { title: 'Norwegian Wood', artist: 'The Beatles', genre: 'Folk Rock', description: 'ミクソリディアンモードの代表例。♭7thがフォーキーで独特の浮遊感を生む。' },
      { title: 'White Rabbit', artist: 'Jefferson Airplane', genre: 'Psychedelic Rock', description: 'フリジアンモードのベースラインが不思議の国のアリスの世界観を表現。' },
    ],
  },
  {
    id: 'pentatonic',
    icon: '🎸',
    name: 'ペンタトニック & ブルーススケール',
    subtitle: 'Pentatonic & Blues Scale — 5音の万能スケール',
    difficulty: 'beginner',
    description: 'ペンタトニックスケールは5音で構成される、世界中の音楽で見られるスケール。半音がないため不協和が起きにくく、即興演奏の入門にも最適です。',
    details: [
      { icon: '🎵', title: 'メジャーペンタトニック', body: '1-2-3-5-6の5音。カントリー、ポップ、民謡に多い。明るく牧歌的な響き。アメイジンググレイスがこのスケールだけで作られています。' },
      { icon: '🎶', title: 'マイナーペンタトニック', body: '1-♭3-4-5-♭7の5音。ロック・ブルースギターの基本。ほとんどのギターソロはここから始まります。' },
      { icon: '🔵', title: 'ブルーススケール', body: 'マイナーペンタ+♭5th（ブルーノート）。6音。ブルースの「泣き」の正体。ジャズ、ロック、R&Bすべてに影響。' },
    ],
    songs: [
      { title: 'My Girl', artist: 'The Temptations', genre: 'Soul / R&B', description: 'イントロのギターフレーズはメジャーペンタトニックの教科書的な例。明るく温かい響き。' },
      { title: 'Stairway to Heaven (Solo)', artist: 'Led Zeppelin', genre: 'Rock', description: 'ギターソロはAマイナーペンタトニックの名演中の名演。ロックギターの到達点。' },
      { title: 'The Thrill Is Gone', artist: 'B.B. King', genre: 'Blues', description: 'ブルーススケールの魅力が凝縮。ブルーノートの「泣き」が圧巻。' },
      { title: 'Enter Sandman', artist: 'Metallica', genre: 'Metal', description: 'Eマイナーペンタトニックベースのリフ。ヘヴィメタルでもペンタトニックは大活躍。' },
      { title: '津軽海峡冬景色', artist: '石川さゆり', genre: '演歌', description: '日本の演歌はマイナーペンタトニック（ヨナ抜き音階）を基本としています。' },
    ],
    audioDemo: {
      type: 'scale',
      notes: [[60], [62], [64], [67], [69], [72]],
      labels: ['ド', 'レ', 'ミ', 'ソ', 'ラ', 'ド'],
      duration: 400,
    },
  },
  {
    id: 'diatonic',
    icon: '🧱',
    name: 'ダイアトニックコード',
    subtitle: 'Diatonic Chords — スケールから生まれる7つのコード',
    difficulty: 'beginner',
    description: 'スケールの各音を根音として3度ずつ積み重ねると、そのキーで自然に使えるコード群（ダイアトニックコード）が得られます。これがコード進行の基盤です。',
    chips: ['I: C (Maj)', 'ii: Dm (min)', 'iii: Em (min)', 'IV: F (Maj)', 'V: G (Maj)', 'vi: Am (min)', 'vii°: Bdim'],
    details: [
      { icon: '🏠', title: 'トニック（I, iii, vi）', body: '安定・解決の機能。曲の始まりや終わりに多い。「家に帰ってきた」感覚。' },
      { icon: '🚶', title: 'サブドミナント（IV, ii）', body: 'やや不安定で「どこかに行きたい」感覚。トニックからドミナントへの橋渡し役。' },
      { icon: '⚡', title: 'ドミナント（V, vii°）', body: '最も不安定で、トニックに戻りたい強い力を持つ。V→Iの解決が音楽の最も基本的な動き。' },
    ],
    songs: [
      { title: 'Stand By Me', artist: 'Ben E. King', genre: 'R&B / Pop', description: 'I-vi-IV-Vの循環コード。ダイアトニックコードだけで作られた永遠の名曲。' },
      { title: 'Twist and Shout', artist: 'The Beatles', genre: 'Rock', description: 'I-IV-Vの3コードのみ。ダイアトニックの基本3コードでこれだけのエネルギーが出せる好例。' },
      { title: 'マリーゴールド', artist: 'あいみょん', genre: 'J-Pop', description: 'ダイアトニックコードを中心とした王道進行。IV-V-iii-viの日本的な進行が光ります。' },
    ],
    audioDemo: {
      type: 'chord',
      notes: [
        [60, 64, 67], [62, 65, 69], [64, 67, 71], [65, 69, 72],
        [67, 71, 74], [69, 72, 76], [71, 74, 77],
      ],
      labels: ['I: C', 'ii: Dm', 'iii: Em', 'IV: F', 'V: G', 'vi: Am', 'vii°: Bdim'],
      duration: 800,
    },
  },
  {
    id: 'extended-chords',
    icon: '🏗️',
    name: 'セブンスコード & テンションコード',
    subtitle: '7th & Tension Chords — コードに深みを加える',
    difficulty: 'intermediate',
    description: '3和音（トライアド）に7th、9th、11th、13thなどの音を加えることで、コードの表情が格段に豊かになります。ジャズ、R&B、ネオソウル、シティポップには欠かせない要素です。',
    details: [
      { icon: '7️⃣', title: 'セブンスコード', body: 'Maj7（甘く浮遊感）、m7（温かく落ち着き）、7（ブルージーで解決欲求）、m7♭5（切なさ）。トライアドにもう1音加えるだけで世界が広がります。' },
      { icon: '9️⃣', title: 'テンション（9th, 11th, 13th）', body: '更に上の倍音を加えるテンションコード。add9は爽やかさ、#11は浮遊感、13thはゴージャスさ。ネオソウルやシティポップの「おしゃれ」の正体。' },
      { icon: '🔄', title: 'オルタードテンション', body: '♭9, #9, #11, ♭13など変化テンション。ドミナント7thに付加して最大限の緊張感を作り、解決時のカタルシスを増幅。ジャズの上級テクニック。' },
    ],
    songs: [
      { title: "Isn't She Lovely", artist: 'Stevie Wonder', genre: 'R&B / Pop', description: '全編にわたりセブンスコードを使用。特にドミナント7thの扱いが絶妙。' },
      { title: 'Plastic Love', artist: '竹内まりや', genre: 'City Pop', description: 'Maj7やm7が多用されたシティポップの金字塔。テンションの使い方が都会的な空気感を作っています。' },
      { title: 'Neon', artist: 'John Mayer', genre: 'Neo Soul / Pop', description: '9thや13thを駆使したコードワーク。ギター1本でネオソウル的なハーモニーを実現。' },
      { title: 'Giant Steps', artist: 'John Coltrane', genre: 'Jazz', description: 'オルタードテンション満載のコード進行。ジャズハーモニーの極北。' },
    ],
  },
  {
    id: 'progressions',
    icon: '🔄',
    name: '定番コード進行パターン',
    subtitle: 'Chord Progressions — 名曲を支える「型」',
    difficulty: 'beginner',
    description: 'コード進行にはよく使われる「型」があります。これらのパターンを知ることで、作曲や耳コピが格段に楽になります。',
    details: [
      { icon: '👑', title: 'カノン進行 (I-V-vi-iii-IV-I-IV-V)', body: 'パッヘルベルのカノンに由来。J-POPで最も多用される王道進行。「卒業」「結婚式」定番曲の多くがこれ。' },
      { icon: '🎸', title: 'I-V-vi-IV（4コード進行）', body: '洋楽ポップ・ロックの最頻出パターン。明るく前向きで、無数のヒット曲で使用。' },
      { icon: '🇯🇵', title: '王道進行 (IV-V-iii-vi)', body: '日本のポップス特有の進行。切なくも美しい、J-POPらしい響き。小室哲哉が多用したことでも有名。' },
      { icon: '💿', title: '小室進行 (♭VI-♭VII-V-I)', body: '90年代J-POPを席巻。ユーロビートやトランスにも頻出するキャッチーな進行。' },
      { icon: '🔵', title: '12小節ブルース', body: 'I-I-I-I / IV-IV-I-I / V-IV-I-V。ブルース、ロックンロール、ジャズブルースの基本形。' },
      { icon: '💃', title: 'レゲトン進行 (i-VII-VI-V)', body: '近年のラテンポップ、レゲトンの定番。Am-G-F-Eのような進行。世界的ヒット曲に多い。' },
    ],
    songs: [
      { title: '愛をこめて花束を', artist: 'Superfly', genre: 'J-Pop', description: 'カノン進行の代表的なJ-POP。サビの高揚感はこの進行ならでは。' },
      { title: 'Someone Like You', artist: 'Adele', genre: 'Pop', description: 'I-V-vi-IVの4コード進行。ピアノ弾き語りでこの進行の力を証明した世界的ヒット。' },
      { title: '残酷な天使のテーゼ', artist: '高橋洋子', genre: 'Anime / J-Pop', description: '小室進行を使ったアニソンの金字塔。キャッチーさと疾走感が両立。' },
      { title: 'Johnny B. Goode', artist: 'Chuck Berry', genre: "Rock'n'Roll", description: '12小節ブルース進行のロックンロール。ロックの原点。' },
      { title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', genre: 'Reggaeton', description: 'i-VII-VI-Vのレゲトン進行。世界で最も再生されたラテンポップ。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 64, 67], [67, 71, 74], [69, 72, 76], [64, 67, 71],
        [65, 69, 72], [60, 64, 67], [65, 69, 72], [67, 71, 74],
      ],
      labels: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'],
      duration: 700,
    },
    demoSongs: [
      {
        title: 'カノン進行デモ',
        description: 'パッヘルベルのカノンに由来する王道コード進行。J-POPで最も多用されるパターン。',
        bpm: 80,
        tracks: [
          {
            name: 'メロディ',
            instrument: 'lead',
            notes: [
              [[72], 2], [[71], 2], [[69], 2], [[67], 2],
              [[65], 2], [[64], 2], [[65], 2], [[67], 2],
            ],
          },
          {
            name: 'コード',
            instrument: 'piano',
            notes: [
              [[60, 64, 67], 2], [[55, 59, 62], 2],
              [[57, 60, 64], 2], [[52, 55, 59], 2],
              [[53, 57, 60], 2], [[48, 52, 55], 2],
              [[53, 57, 60], 2], [[55, 59, 62], 2],
            ],
          },
          {
            name: 'ベース',
            instrument: 'bass',
            notes: [
              [[48], 2], [[43], 2], [[45], 2], [[40], 2],
              [[41], 2], [[36], 2], [[41], 2], [[43], 2],
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'secondary-dominant',
    icon: '🎯',
    name: 'セカンダリードミナント',
    subtitle: 'Secondary Dominants — 一時的な緊張と解決',
    difficulty: 'intermediate',
    description: 'ダイアトニック上の任意のコードを一時的にIと見なし、そのV7を挿入するテクニック。例えばCキーでAmに進む前にE7を入れる（V7/vi）。曲に「色気」や「引き」が生まれます。',
    details: [
      { icon: '🔶', title: 'V7/V（ダブルドミナント）', body: '最も一般的。CキーならD7→G。V（G）に向かう力を強化。ドミナントのドミナント。' },
      { icon: '🔶', title: 'V7/vi', body: 'CキーならE7→Am。マイナーコードへの解決がドラマチック。ポップスでも頻出。' },
      { icon: '🔶', title: 'V7/IV', body: 'CキーならC7→F。ブルース的な色気。トニックがドミナント7th化する面白さ。' },
    ],
    songs: [
      { title: 'I Got Rhythm', artist: 'George Gershwin', genre: 'Jazz', description: 'セカンダリードミナントの連鎖（ドミナントモーション）が曲を推進。ジャズスタンダードの基本形。' },
      { title: 'Yesterday', artist: 'The Beatles', genre: 'Pop', description: 'サビでV7/viを効果的に使用。切なさの秘密はセカンダリードミナントにあり。' },
      { title: '夜に駆ける', artist: 'YOASOBI', genre: 'J-Pop', description: 'セカンダリードミナントを巧みに使ったコード進行が疾走感と切なさを両立。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 64, 67], [62, 66, 69, 72], [55, 59, 62], [60, 64, 67],
      ],
      labels: ['C (I)', 'D7 (V7/V)', 'G (V)', 'C (I)'],
      duration: 900,
    },
  },
  {
    id: 'tritone-sub',
    icon: '🔀',
    name: '裏コード（トリトーン・サブスティテューション）',
    subtitle: 'Tritone Substitution — V7の代理コード',
    difficulty: 'advanced',
    description: 'ドミナント7thコードを、トライトーン（増4度/減5度）離れた別のドミナント7thで置き換えるテクニック。例: G7の代わりにD♭7を使う。半音下行するベースラインが生まれ、ジャズ的な洗練された響きになります。',
    details: [
      { icon: '🔄', title: '基本原理', body: 'ドミナント7thコードに含まれるトライトーン（3rdと7th）は、トリトーン離れたドミナント7thと共有されます。G7のB-FはD♭7のF-Cと同じ音。だから代理できるのです。' },
      { icon: '📉', title: '半音下行ベースライン', body: 'II-V-IでDm7-G7-CMaj7をDm7-D♭7-CMaj7にすると、ベースがD→D♭→Cと半音で下行。この滑らかさがジャズの醍醐味。' },
      { icon: '🎨', title: '応用', body: 'セカンダリードミナントの裏コード化、連続裏コード（コルトレーンチェンジ）など、組み合わせ次第で無限の可能性。' },
    ],
    songs: [
      { title: 'Fly Me to the Moon', artist: 'Frank Sinatra', genre: 'Jazz', description: '裏コードが随所に使われたジャズスタンダード。洗練されたハーモニーの教科書。' },
      { title: 'Autumn Leaves', artist: 'Cannonball Adderley', genre: 'Jazz', description: 'アドリブ中に裏コードを多用するのが定番。リハーモナイズの入門曲。' },
      { title: 'Spain', artist: 'Chick Corea', genre: 'Jazz / Fusion', description: 'フュージョンの名曲。裏コードを含む複雑なハーモニーがスパニッシュな雰囲気と融合。' },
      { title: 'Girl from Ipanema', artist: 'Antonio Carlos Jobim', genre: 'Bossa Nova', description: 'ボサノバの代表曲。裏コードの自然な使い方がブラジリアンハーモニーの特徴。' },
    ],
  },
  {
    id: 'modulation',
    icon: '🚀',
    name: '転調（モジュレーション）',
    subtitle: 'Modulation — キーを変えてドラマを作る',
    difficulty: 'intermediate',
    description: '曲の途中でキー（調）を変えることを転調と言います。エネルギーの上昇、場面転換、感情の変化を劇的に演出できる強力なテクニックです。',
    details: [
      { icon: '⬆️', title: '半音上げ転調', body: 'ラストサビで半音上げる定番テクニック。高揚感とクライマックス感を一瞬で生み出します。' },
      { icon: '🔀', title: '平行調転調', body: 'メジャー↔マイナー（同じ調号）の行き来。CメジャーとAマイナーなど。自然で滑らかな転調。' },
      { icon: '🔗', title: 'ピボットコード転調', body: '両方のキーに共通するコードを経由点として転調。最も自然で気づかれにくい手法。' },
      { icon: '💥', title: '直接転調', body: '準備なしにいきなりキーを変える。衝撃的な効果。ドラマチックな場面転換に使用。' },
    ],
    songs: [
      { title: 'Love On Top', artist: 'Beyoncé', genre: 'R&B / Pop', description: 'ラストで4回連続半音上げ転調。高揚感が天井知らずに上がっていく圧巻のアレンジ。' },
      { title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock', description: '6分間で複数回転調。バラード→オペラ→ハードロックと場面ごとにキーが変わるロック史上最大のドラマ。' },
      { title: 'I Will Always Love You', artist: 'Whitney Houston', genre: 'Pop / R&B', description: 'ラストサビの半音上げ転調が感動を最大化。ポップバラード転調の金字塔。' },
      { title: '天城越え', artist: '石川さゆり', genre: '演歌', description: 'サビでの劇的な転調が演歌の情念を倍増させています。' },
      { title: '恋', artist: '星野源', genre: 'J-Pop', description: '巧みな転調で曲全体の流れにメリハリをつけている好例。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60, 64, 67], [55, 59, 62], [60, 64, 67],
        [61, 65, 68], [56, 60, 63], [61, 65, 68],
      ],
      labels: ['C (I)', 'G (V)', 'C (I)', 'D♭ (I)', 'A♭ (V)', 'D♭ (I)'],
      duration: 800,
    },
  },
  {
    id: 'modal-interchange',
    icon: '🎨',
    name: 'モーダルインターチェンジ（借用和音）',
    subtitle: 'Modal Interchange — 平行世界からコードを借りる',
    difficulty: 'intermediate',
    description: '同主調（同じルートのメジャー/マイナー）や他のモードからコードを一時的に借りるテクニック。メジャーキーの中にマイナーの色を差し込むことで、切なさや意外性を生みます。',
    details: [
      { icon: '🌧️', title: 'サブドミナントマイナー (IVm)', body: '最も一般的な借用。CキーでのFm。「泣きのサブドミナント」とも。J-POPのサビ終わりで頻出し、切ない余韻を残します。' },
      { icon: '🌫️', title: '♭VII', body: 'CキーでのB♭。ミクソリディアンからの借用。ロックで非常に多く使われ、力強くも浮遊感のある響き。' },
      { icon: '🌑', title: '♭VI', body: 'CキーでのA♭。映画音楽的な壮大さ。マイナーキーからの借用で、突然の景色の変化を感じさせます。' },
    ],
    songs: [
      { title: 'Creep', artist: 'Radiohead', genre: 'Alternative Rock', description: 'I-III-IV-ivの進行。IVからIVm（サブドミナントマイナー）への切り替わりが「切なさ」の正体。' },
      { title: 'Just the Two of Us', artist: 'Grover Washington Jr.', genre: 'Jazz / R&B', description: '♭VIMaj7を含む進行（丸サ進行の原型）。モーダルインターチェンジが生む都会的な浮遊感。' },
      { title: 'Hey Jude', artist: 'The Beatles', genre: 'Rock / Pop', description: '♭VIIコードの使用がビートルズらしい独特の響きを生んでいます。' },
      { title: 'First Love', artist: '宇多田ヒカル', genre: 'J-Pop / R&B', description: 'サブドミナントマイナーが効果的に使われ、初恋の甘くて切ない感情を表現。' },
      { title: 'Blackbird', artist: 'The Beatles', genre: 'Folk / Pop', description: '巧みなモーダルインターチェンジで曲に深みと陰影を与えています。' },
    ],
  },
  {
    id: 'two-five-one',
    icon: '🎷',
    name: 'ツーファイブワン（II-V-I）',
    subtitle: 'ii-V-I — ジャズハーモニーの基本単位',
    difficulty: 'intermediate',
    description: 'ii-V-Iはジャズにおける最も重要なコード進行。サブドミナント→ドミナント→トニックの最も強力な流れで、ジャズのスタンダード曲のほぼ全てに登場します。',
    details: [
      { icon: '🎵', title: 'メジャーII-V-I', body: 'Dm7 → G7 → CMaj7。明るく解決感のある進行。ポップスでもよく使われます。' },
      { icon: '🎶', title: 'マイナーII-V-I', body: 'Dm7♭5 → G7(♭9) → Cm。ハーフディミニッシュからの流れが哀愁たっぷり。' },
      { icon: '🔗', title: 'II-V連鎖（バックサイクル）', body: '解決せずにII-Vを連鎖させる技法。Giant Stepsのような複雑な進行の骨格。' },
    ],
    songs: [
      { title: 'Fly Me to the Moon', artist: 'Frank Sinatra', genre: 'Jazz', description: 'II-V-Iの連続で全曲が構成されたジャズスタンダードの教科書。' },
      { title: 'Autumn Leaves', artist: 'Joseph Kosma', genre: 'Jazz', description: 'メジャーII-V-IとマイナーII-V-Iの両方が登場する学習に最適なスタンダード。' },
      { title: 'All The Things You Are', artist: 'Jerome Kern', genre: 'Jazz', description: 'II-V-Iが様々なキーに転調しながら連鎖。ジャズスタンダードの最高峰。' },
      { title: 'Someday My Prince Will Come', artist: 'Miles Davis', genre: 'Jazz', description: '3/4拍子のII-V-I進行。ワルツジャズの定番。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [62, 65, 69, 72], [55, 59, 62, 65], [60, 64, 67, 71],
      ],
      labels: ['Dm7 (ii)', 'G7 (V)', 'CMaj7 (I)'],
      duration: 1000,
    },
  },
  {
    id: 'rhythm',
    icon: '🥁',
    name: 'リズム & 拍子',
    subtitle: 'Rhythm & Time Signatures — 音楽の骨格',
    difficulty: 'beginner',
    description: 'リズムは音楽の時間的な構造。拍子、テンポ、シンコペーション、グルーヴなど、音楽を「ノれる」ものにする要素です。',
    details: [
      { icon: '4️⃣', title: '4/4拍子', body: '最も一般的。ロック、ポップ、ヒップホップなど大半の音楽。「コモンタイム」とも呼ばれます。' },
      { icon: '3️⃣', title: '3/4拍子（ワルツ）', body: '「ズン・チャッ・チャッ」。ワルツ、一部のバラード。優雅で揺れるような感覚。' },
      { icon: '🔀', title: 'シンコペーション', body: '弱拍や裏拍にアクセントを置く技法。ファンク、レゲエ、ジャズのグルーヴの源泉。' },
      { icon: '🌊', title: 'スウィングとシャッフル', body: '8分音符を均等でなく「長-短」で演奏。ジャズのスウィング、ブルースのシャッフル。「ハネる」リズム。' },
      { icon: '🔢', title: '変拍子', body: '5/4、7/8、11/8など不規則な拍子。プログレッシブロック、現代ジャズで多用。' },
      { icon: '🎤', title: 'ポリリズム', body: '2つ以上の異なるリズムパターンが同時に鳴る。アフリカ音楽に起源を持ち、現代ポップスやEDMにも波及。' },
    ],
    songs: [
      { title: 'Take Five', artist: 'Dave Brubeck', genre: 'Jazz', description: '5/4拍子のジャズの名曲。変拍子が自然に聴こえることを証明した歴史的作品。' },
      { title: 'Superstition', artist: 'Stevie Wonder', genre: 'Funk', description: 'シンコペーションとファンクグルーヴの教科書。クラビネットのリフが強烈。' },
      { title: 'Money', artist: 'Pink Floyd', genre: 'Progressive Rock', description: '7/4拍子のメインリフ。レジの音をサンプリングしたイントロから変拍子に突入。' },
      { title: 'ポリリズム', artist: 'Perfume', genre: 'Electro Pop', description: 'タイトル通りポリリズムをテーマにした楽曲。中田ヤスタカの巧みなリズムプログラミング。' },
      { title: '美しく青きドナウ', artist: 'Johann Strauss II', genre: 'Classical', description: '3/4拍子ワルツの最高峰。優雅に揺れる拍子が「踊り」を誘います。' },
    ],
    audioDemo: {
      type: 'progression',
      notes: [
        [60], [60], [60], [60],
        [60], [60], [60],
        [60], [60], [60], [60], [60],
      ],
      labels: ['4/4: 1', '2', '3', '4', '3/4: 1', '2', '3', '6/8: 1', '2', '3', '4', '5'],
      duration: 400,
    },
  },
  {
    id: 'bassline',
    icon: '🎸',
    name: 'ベースラインとヴォイスリーディング',
    subtitle: 'Bass Lines & Voice Leading — 滑らかな声部の動き',
    difficulty: 'intermediate',
    description: 'コードチェンジの際に各声部（特にベース音）をなるべく近い音に動かすことで、滑らかで美しい進行が生まれます。クリシェライン（半音ずつ動くベース）は特に効果的です。',
    details: [
      { icon: '📉', title: 'ベースクリシェ', body: 'ベース音が半音ずつ下降/上行する技法。Am-Am/G#-Am/G-Am/F#のような動き。映画音楽やバラードで感動を演出。' },
      { icon: '🔄', title: 'ペダルポイント', body: 'ベース音を固定したまま上のコードを動かす技法。緊張感の持続やドラマチックな盛り上がりに効果的。' },
      { icon: '🚶', title: 'ウォーキングベース', body: '4分音符でスケールやアルペジオを繋ぐベースライン。ジャズの基本。音楽に推進力と立体感を与えます。' },
    ],
    songs: [
      { title: 'Stairway to Heaven (Intro)', artist: 'Led Zeppelin', genre: 'Rock', description: 'イントロのAmベースクリシェ（A→G#→G→F#）は世界で最も有名なクリシェライン。' },
      { title: 'Dear Prudence', artist: 'The Beatles', genre: 'Rock', description: 'Dからベースが半音ずつ下降するクリシェ。サイケデリックな浮遊感の秘密。' },
      { title: 'Billie Jean', artist: 'Michael Jackson', genre: 'Pop / Funk', description: 'アイコニックなベースリフが曲全体を支配。ベースラインが主役になった歴史的楽曲。' },
      { title: 'My Romance', artist: 'Bill Evans', genre: 'Jazz', description: 'ウォーキングベースの名演。Scott LaFaroのベースが対旋律的に動きます。' },
    ],
  },
  {
    id: 'counterpoint',
    icon: '🎻',
    name: '対位法（カウンターポイント）',
    subtitle: 'Counterpoint — 複数の旋律を織り合わせる',
    difficulty: 'advanced',
    description: '対位法は、2つ以上の独立した旋律を同時に鳴らして美しいハーモニーを作る技法。バッハが大成し、現代でもポップス、映画音楽、ゲーム音楽で広く使われています。',
    details: [
      { icon: '🔄', title: 'フーガ', body: '一つの主題が時間差で複数の声部に現れる形式。バッハのフーガの技法は対位法の最高到達点。' },
      { icon: '🎵', title: 'カノン', body: '同じ旋律を時間差で追いかける形式。「かえるのうた」の輪唱が最もシンプルな例。' },
      { icon: '🎼', title: '対旋律', body: '主旋律に対して独立した別の旋律を重ねる。ポップスのギターリフ、ストリングスアレンジで多用。' },
    ],
    songs: [
      { title: 'フーガ ト短調 BWV 578', artist: 'J.S. Bach', genre: 'Classical', description: '「小フーガ」として有名。4声のフーガで対位法の美しさを堪能できます。' },
      { title: 'Eleanor Rigby', artist: 'The Beatles', genre: 'Pop / Chamber', description: '弦楽四重奏のアレンジが対位法的。ヴォーカルとストリングスが独立して動きます。' },
      { title: 'God Only Knows', artist: 'The Beach Boys', genre: 'Pop', description: 'アウトロで複数のメロディーが重なり合うカノン的手法。ポップス史上最高のアレンジとも。' },
    ],
  },
  {
    id: 'arrangement',
    icon: '🏛️',
    name: '楽曲構成（フォーム）',
    subtitle: 'Song Form & Arrangement — 曲の設計図',
    difficulty: 'beginner',
    description: '楽曲にはイントロ、Aメロ、Bメロ、サビなどのセクションがあり、その並べ方（フォーム）が曲全体の印象を決めます。',
    details: [
      { icon: '🇯🇵', title: 'J-POP標準形', body: 'イントロ→Aメロ→Bメロ→サビ→間奏→Aメロ→Bメロ→サビ→Cメロ→大サビ→アウトロ。Bメロで溜めてサビで爆発する構成。' },
      { icon: '🇺🇸', title: 'Verse-Chorus形式', body: 'Verse→Chorus→Verse→Chorus→Bridge→Chorus。洋楽ポップの基本形。シンプルで覚えやすい。' },
      { icon: '🎷', title: 'AABA形式', body: 'ジャズスタンダードの定番。32小節（各8小節×4）。Bセクション（ブリッジ）が対比を作ります。' },
      { icon: '🔁', title: 'ループ/ビルドアップ形式', body: 'EDMやヒップホップで多い。短いループを基本に、音を足し引きしてダイナミクスを作る。ドロップが最大の盛り上がり。' },
    ],
    tip: '各セクションの「音数」と「エネルギー」をコントロールすることが重要。Aメロは控えめに、サビで全楽器が鳴る、といった対比が聴く人を飽きさせません。「引き算の美学」も大切です。',
    songs: [
      { title: '夜に駆ける', artist: 'YOASOBI', genre: 'J-Pop', description: 'J-POP標準形の教科書。BメロからCメロ→落ちサビ→大サビの流れが完璧。' },
      { title: 'Smells Like Teen Spirit', artist: 'Nirvana', genre: 'Grunge / Rock', description: 'Verse-Chorus形式のダイナミクス（静→爆）がグランジの美学。' },
      { title: 'Strobe', artist: 'Deadmau5', genre: 'Progressive House', description: '10分以上にわたるビルドアップ形式。EDMにおける「溜めと解放」の金字塔。' },
      { title: 'Over the Rainbow', artist: 'Harold Arlen', genre: 'Musical', description: 'AABA形式の完璧な例。Bセクションの対比が曲にドラマを与えています。' },
    ],
  },
  {
    id: 'dynamics',
    icon: '📊',
    name: 'ダイナミクスとテクスチャー',
    subtitle: 'Dynamics & Texture — 音の強弱と密度',
    difficulty: 'beginner',
    description: 'ダイナミクス（強弱）とテクスチャー（音の密度・厚み）は、楽曲に感情の起伏と立体感を与える重要な要素です。同じメロディーやコードでも、ダイナミクスの変化だけで全く違う印象になります。',
    details: [
      { icon: '🔊', title: 'クレッシェンド/デクレッシェンド', body: 'だんだん大きく/小さく。緊張の高まりや収束を表現。オーケストラの最も強力なツール。' },
      { icon: '🎭', title: 'モノフォニー/ポリフォニー', body: '単旋律から複数旋律へ。テクスチャーを変えることで場面転換を演出。' },
      { icon: '🌊', title: 'テラスダイナミクス', body: '急激な強弱の切り替え。バロック音楽の特徴。ロックの「静と動」にも応用。' },
    ],
    songs: [
      { title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock', description: 'ピアニッシモのバラードからフォルティッシモのオペラセクションまで極端なダイナミクスレンジ。' },
      { title: 'In the Air Tonight', artist: 'Phil Collins', genre: 'Pop / Rock', description: '3分以上の抑制された静寂から突如炸裂するドラムフィル。テラスダイナミクスの極致。' },
      { title: 'ボレロ', artist: 'Maurice Ravel', genre: 'Classical', description: '15分間ずっとクレッシェンドし続ける驚異。同じメロディーがダイナミクスとテクスチャーの変化だけで壮大に。' },
    ],
  },
]
