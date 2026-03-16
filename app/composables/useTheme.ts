export function useTheme() {
  const colorMode = useState<'dark' | 'light'>('colorMode', () => 'light')

  function toggle() {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', colorMode.value)
      localStorage.setItem('theme', colorMode.value)
    }
  }

  function init() {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
      if (saved) {
        colorMode.value = saved
      }
      document.documentElement.setAttribute('data-theme', colorMode.value)
    }
  }

  return { colorMode, toggle, init }
}
