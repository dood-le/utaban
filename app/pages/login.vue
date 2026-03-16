<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">ログイン</h1>
      <p class="login-desc">コミュニティに参加して、音楽理論の知識を共有しよう</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label class="form-label">ユーザー名</label>
          <input
            v-model="name"
            type="text"
            class="form-input"
            placeholder="例: たくみ"
            required
            minlength="1"
            maxlength="20"
          />
        </div>
        <div class="form-group">
          <label class="form-label">メールアドレス</label>
          <input
            v-model="email"
            type="email"
            class="form-input"
            placeholder="例: user@example.com"
            required
          />
        </div>
        <p v-if="error" class="form-error">{{ error }}</p>
        <button type="submit" class="submit-btn">ログイン</button>
      </form>

      <p class="login-note">
        ※ デモ用のローカル認証です。任意のユーザー名・メールで利用できます。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const router = useRouter()

const name = ref('')
const email = ref('')
const error = ref('')

function handleLogin() {
  if (!name.value.trim()) {
    error.value = 'ユーザー名を入力してください'
    return
  }
  if (!email.value.trim()) {
    error.value = 'メールアドレスを入力してください'
    return
  }
  error.value = ''
  login(name.value.trim(), email.value.trim())
  router.push('/community')
}

useHead({ title: 'ログイン - 音楽理論辞典' })
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  padding-top: 40px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 40px 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.login-desc {
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
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

.form-input:focus {
  border-color: var(--accent);
}

.form-input::placeholder {
  color: var(--text-dimmed);
}

.form-error {
  color: #e74c3c;
  font-size: 13px;
}

.submit-btn {
  padding: 12px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.login-note {
  margin-top: 24px;
  font-size: 12px;
  color: var(--text-dimmed);
  text-align: center;
}
</style>
