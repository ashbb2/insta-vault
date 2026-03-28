import type { Post, Category, Collection } from '../../types/data.d'
import { posts as mockPosts, categories as mockCategories, collections as mockCollections } from '../../components/data/mockData'
import { loadState, saveState } from '../storage'

function loadAll(): { posts: Post[]; categories: Category[]; collections: Collection[] } {
  try {
    const saved = loadState()
    if (saved) return { posts: saved.posts, categories: saved.categories, collections: saved.collections }
  } catch (e) {
    // ignore
  }
  return { posts: mockPosts, categories: mockCategories, collections: mockCollections }
}

function saveAll(payload: { posts: Post[]; categories: Category[]; collections: Collection[] }) {
  saveState({ posts: payload.posts, categories: payload.categories, collections: payload.collections })
}

export const localRepo = {
  loadAll,
  saveAll
}

export default localRepo
