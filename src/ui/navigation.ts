import { watch, type Ref } from 'vue'

export type Screen = 'home' | 'birthplace' | 'reveal' | 'life' | 'memorial' | 'collection'

const validScreens = new Set<Screen>(['home', 'birthplace', 'reveal', 'life', 'memorial', 'collection'])

export function screenFromHash(hash: string): Screen | null {
  const path = hash.replace(/^#\/?/, '')
  if (!path) return null
  return validScreens.has(path as Screen) ? path as Screen : 'home'
}

export function hashForScreen(screen: Screen): string {
  return `#/${screen}`
}

export function bindScreenNavigation(
  screen: Ref<Screen>,
  canVisit: (target: Screen) => boolean,
): () => void {
  let handlingHash = false

  const normalize = (target: Screen) => canVisit(target) ? target : 'home'
  const syncFromHash = () => {
    const target = screenFromHash(window.location.hash)
    const next = normalize(target ?? screen.value)
    handlingHash = true
    screen.value = next
    if (window.location.hash !== hashForScreen(next)) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hashForScreen(next)}`)
    }
    queueMicrotask(() => { handlingHash = false })
  }

  const stopWatch = watch(screen, (next, previous) => {
    if (handlingHash) return
    const target = normalize(next)
    if (target !== next) {
      screen.value = target
      return
    }
    const method = previous === 'reveal' && next === 'life' || previous === 'life' && next === 'memorial'
      ? 'replaceState'
      : 'pushState'
    window.history[method](null, '', `${window.location.pathname}${window.location.search}${hashForScreen(next)}`)
  }, { flush: 'sync' })

  window.addEventListener('hashchange', syncFromHash)
  syncFromHash()
  return () => {
    stopWatch()
    window.removeEventListener('hashchange', syncFromHash)
  }
}
