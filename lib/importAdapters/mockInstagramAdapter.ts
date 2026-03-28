import type { Post } from '../../types/data.d'
import type { ImportAdapter } from './interfaces'

// Very small mock adapter used in the UI while backend integration is pending.
export const mockInstagramAdapter: ImportAdapter = {
  async importFromInstagramUrl(url: string) {
    // Create a tiny stub Post using the URL as source and a short caption.
    const id = `p-${Date.now()}`
    const now = new Date().toISOString()
    const post: Post = {
      id,
      thumbnail: 'https://placehold.co/600x600/e2e8f0/475569?text=Saved+Post',
      author: '@imported',
      sourceUrl: url,
      caption: `Imported from ${url}`,
      savedAt: now,
      collectionIds: [],
      categoryId: 'c-unsorted',
      tags: []
    }

    return post
  }
}

export default mockInstagramAdapter
