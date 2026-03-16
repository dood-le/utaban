<template>
  <div :data-theme="theme">
    <!-- Navbar -->
    <nav class="navbar">
      <a href="#" class="navbar-brand">
        <span>🎵</span> Music Theory Lab
      </a>
      <ul class="navbar-links">
        <li><a href="#scales">スケール</a></li>
        <li><a href="#diatonic">コード</a></li>
        <li><a href="#progressions">進行</a></li>
        <li><a href="#rhythm">リズム</a></li>
        <li><a href="#arrangement">構成</a></li>
      </ul>
      <button class="theme-toggle" @click="toggleTheme" :title="theme === 'light' ? 'ダークモードに切替' : 'ライトモードに切替'">
        {{ theme === 'light' ? '🌙' : '☀️' }}
      </button>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1>音楽理論を<br>楽曲で学ぼう</h1>
        <p>コード進行、スケール、リズムなど、音楽理論の基礎から応用まで。<br>実際の楽曲を例に、理論がどう使われているか体感しよう。</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-number">{{ techniques.length }}</div>
            <div class="hero-stat-label">トピック</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-number">{{ totalSongs }}+</div>
            <div class="hero-stat-label">楽曲例</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-number">3</div>
            <div class="hero-stat-label">難易度レベル</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Table of Contents -->
    <div class="toc-section">
      <div class="toc-card">
        <div class="toc-title">📑 目次</div>
        <div class="toc-grid">
          <a
            v-for="(tech, i) in techniques"
            :key="tech.id"
            :href="'#' + tech.id"
            class="toc-item"
          >
            <span class="toc-num">{{ String(i + 1).padStart(2, '0') }}</span>
            {{ tech.name }}
          </a>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <section
        v-for="tech in techniques"
        :key="tech.id"
        :id="tech.id"
        class="theory-section"
      >
        <!-- Section Header -->
        <div class="section-header">
          <div class="section-icon">{{ tech.icon }}</div>
          <div class="section-title-group">
            <h2 class="section-title">{{ tech.name }}</h2>
            <div class="section-subtitle">{{ tech.subtitle }}</div>
          </div>
          <span
            class="difficulty-badge"
            :class="'difficulty-' + tech.difficulty"
          >
            {{ difficultyLabel(tech.difficulty) }}
          </span>
        </div>

        <!-- Section Body -->
        <div class="section-body">
          <p><TermLinkedText :html="tech.description" /></p>

          <!-- Chips (e.g. diatonic chords) -->
          <div v-if="tech.chips" class="chip-list">
            <span v-for="chip in tech.chips" :key="chip" class="chip">{{ chip }}</span>
          </div>

          <!-- Detail Cards -->
          <div class="detail-grid">
            <div v-for="d in tech.details" :key="d.title" class="detail-card">
              <div class="detail-card-title">{{ d.icon }} {{ d.title }}</div>
              <div class="detail-card-body"><TermLinkedText :html="d.body" /></div>
            </div>
          </div>

          <!-- Tip callout -->
          <div v-if="tech.tip" class="callout">
            <div class="callout-title">💡 ポイント</div>
            {{ tech.tip }}
          </div>

          <!-- Audio Demo -->
          <AudioPlayer v-if="tech.audioDemo" :audio-demo="tech.audioDemo" />

          <!-- Demo Songs -->
          <div v-if="tech.demoSongs?.length" class="demo-songs-section">
            <div class="demo-songs-header">🎶 デモ曲</div>
            <DemoSongPlayer
              v-for="(song, si) in tech.demoSongs"
              :key="si"
              :song="song"
            />
          </div>

          <!-- Song Examples -->
          <div class="song-examples">
            <div class="song-examples-header">🎧 この技術を使った楽曲</div>
            <ul class="song-list">
              <li v-for="song in tech.songs" :key="song.title + song.artist" class="song-item">
                <div>
                  <div class="song-name">{{ song.title }}</div>
                  <div class="song-artist">{{ song.artist }}</div>
                  <div class="song-desc">{{ song.description }}</div>
                </div>
                <span class="song-genre">{{ song.genre }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <p>Music Theory Lab — 音楽理論を楽曲で学ぼう</p>
      <p style="margin-top: 0.5rem; font-size: 0.8rem;">Built with Nuxt 4 + Vue 3</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { techniques } from '../music-techniques-data'

const theme = ref<'light' | 'dark'>('light')

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function difficultyLabel(d: string) {
  return d === 'beginner' ? '初級' : d === 'intermediate' ? '中級' : '上級'
}

const totalSongs = computed(() =>
  techniques.reduce((sum, t) => sum + t.songs.length, 0)
)
</script>

<style scoped>
/* Most styles come from /app.css loaded globally */
.demo-songs-section {
  margin-top: 1.5rem;
}
.demo-songs-header {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: var(--text-primary, #333);
}
</style>
