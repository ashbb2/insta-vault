import type { Post, Category, Collection } from '../types/data.d'

const STORAGE_KEY = 'insta-vault:v1'
const SCHEMA_VERSION = 1

export type PersistedState = {
  version: number
  posts: Post[]
  categories: Category[]
  collections: Collection[]
}

export function loadState(): PersistedState | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (parsed.version !== SCHEMA_VERSION) return null
    return parsed as PersistedState
  } catch (e) {
    console.warn('loadState failed', e)
    return null
  }
}

// Debounced save to avoid excessive writes
export const saveState = (() => {
  let timer: number | null = null
  return (state: Omit<PersistedState, 'version'>, delay = 500) => {
    try {
      if (typeof window === 'undefined') return
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        try {
          const payload: PersistedState = { version: SCHEMA_VERSION, ...state }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        } catch (err) {
          console.warn('saveState failed', err)
        }
        timer = null
      }, delay)
    } catch (err) {
      console.warn('saveState scheduling failed', err)
    }
  }
})()

export function clearState() {
  try {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('clearState failed', e)
  }
}
