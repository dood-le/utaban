export interface User {
  name: string
  email: string
}

export function useAuth() {
  const user = useState<User | null>('auth-user', () => null)

  function login(name: string, email: string) {
    user.value = { name, email }
    if (import.meta.client) {
      localStorage.setItem('auth-user', JSON.stringify(user.value))
    }
  }

  function logout() {
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth-user')
    }
  }

  function initAuth() {
    if (import.meta.client) {
      const saved = localStorage.getItem('auth-user')
      if (saved) {
        try {
          user.value = JSON.parse(saved)
        } catch {
          localStorage.removeItem('auth-user')
        }
      }
    }
  }

  return { user, login, logout, initAuth }
}
