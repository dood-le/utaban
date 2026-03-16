<template>
  <div class="app-layout">
    <header class="app-header">
      <nav class="nav-container">
        <NuxtLink to="/" class="logo">
          <span class="logo-icon">♪</span>
          <span class="logo-text">音楽理論辞典</span>
        </NuxtLink>
        <div class="nav-right">
          <div class="nav-links">
            <NuxtLink to="/" class="nav-link">ホーム</NuxtLink>
            <NuxtLink to="/dictionary" class="nav-link">用語辞典</NuxtLink>
            <NuxtLink to="/dtm" class="nav-link nav-link-dtm">🎛️ DTM</NuxtLink>
            <NuxtLink to="/songs" class="nav-link">MIDIライブラリ</NuxtLink>
            <NuxtLink to="/community" class="nav-link">コミュニティ</NuxtLink>
          </div>
          <div class="nav-actions">
            <NuxtLink v-if="!user" to="/login" class="login-btn">ログイン</NuxtLink>
            <div v-else class="user-menu">
              <div class="user-avatar" @click="showUserMenu = !showUserMenu">
                {{ user.name.charAt(0) }}
              </div>
              <div v-if="showUserMenu" class="user-dropdown" @click="showUserMenu = false">
                <span class="dropdown-name">{{ user.name }}</span>
                <button class="dropdown-item" @click="logout">ログアウト</button>
              </div>
            </div>
            <button class="theme-toggle" @click="toggle" :title="colorMode === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替'">
              <span v-if="colorMode === 'dark'" class="theme-icon">☀️</span>
              <span v-else class="theme-icon">🌙</span>
            </button>
          </div>
        </div>
        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">☰</button>
      </nav>
      <div v-if="mobileMenuOpen" class="mobile-menu" @click="mobileMenuOpen = false">
        <NuxtLink to="/" class="mobile-link">ホーム</NuxtLink>
        <NuxtLink to="/dictionary" class="mobile-link">用語辞典</NuxtLink>
        <NuxtLink to="/dtm" class="mobile-link">🎛️ DTM</NuxtLink>
        <NuxtLink to="/songs" class="mobile-link">MIDIライブラリ</NuxtLink>
        <NuxtLink to="/community" class="mobile-link">コミュニティ</NuxtLink>
        <NuxtLink v-if="!user" to="/login" class="mobile-link">ログイン</NuxtLink>
      </div>
    </header>
    <main class="app-main">
      <slot />
    </main>
    <footer class="app-footer">
      <p>音楽理論辞典 — 作曲・DTMを学ぼう</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { colorMode, toggle, init } = useTheme()
const { user, logout } = useAuth()
const mobileMenuOpen = ref(false)
const showUserMenu = ref(false)

onMounted(() => {
  init()
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-secondary);
  transition: background 0.3s, color 0.3s;
}

.app-header {
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: background 0.3s, border-color 0.3s;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.logo-icon { font-size: 26px; color: var(--accent); }

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.nav-right { display: flex; align-items: center; gap: 16px; }

.nav-links { display: flex; gap: 4px; }

.nav-link {
  text-decoration: none;
  color: var(--nav-link-color);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover { color: var(--text-primary); background: var(--hover-bg); }

.nav-link.router-link-active {
  color: var(--accent);
  background: var(--accent-bg);
  font-weight: 600;
}

.nav-link-dtm {
  background: var(--accent-bg);
  color: var(--accent) !important;
  font-weight: 600 !important;
}

.nav-actions { display: flex; align-items: center; gap: 8px; }

.login-btn {
  display: inline-block;
  padding: 6px 16px;
  background: var(--accent);
  color: #fff !important;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.login-btn:hover { opacity: 0.9; transform: translateY(-1px); }

.user-menu { position: relative; }

.user-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}

.user-avatar:hover { transform: scale(1.1); }

.user-dropdown {
  position: absolute; top: 40px; right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 8px; min-width: 150px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  z-index: 200;
}

.dropdown-name {
  display: block; padding: 6px 10px;
  font-size: 13px; font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 4px;
}

.dropdown-item {
  display: block; width: 100%;
  padding: 6px 10px;
  background: none; border: none;
  color: var(--text-muted); font-size: 13px;
  cursor: pointer; border-radius: 6px;
  text-align: left; transition: all 0.15s;
}

.dropdown-item:hover { background: var(--hover-bg); color: var(--text-primary); }

.theme-toggle {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s;
}

.theme-toggle:hover { border-color: var(--accent); transform: scale(1.1); }

.theme-icon { font-size: 15px; }

.mobile-menu-btn {
  display: none;
  background: none; border: none;
  font-size: 22px; color: var(--text-primary);
  cursor: pointer;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 8px 24px 16px;
  border-top: 1px solid var(--border-color);
}

.mobile-link {
  display: block; padding: 10px 0;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 15px; font-weight: 500;
  border-bottom: 1px solid var(--border-color);
}

.app-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  width: 100%;
  box-sizing: border-box;
}

.app-footer {
  text-align: center;
  padding: 24px;
  color: var(--footer-color);
  font-size: 13px;
  border-top: 1px solid var(--border-color);
  transition: color 0.3s, border-color 0.3s;
}

@media (max-width: 768px) {
  .nav-links, .nav-actions .login-btn, .user-menu { display: none; }
  .mobile-menu-btn { display: block; }
  .mobile-menu { display: flex; }
  .app-main { padding: 20px 16px; }
}
</style>
