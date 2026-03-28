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
      sourceUrl: url,
      caption: `Imported from ${url}`,
      savedAt: now,
      collectionIds: [],
      categoryId: 'c-unsorted',
      tags: [],
    } as Post

    return post
  }
}

export default mockInstagramAdapter
