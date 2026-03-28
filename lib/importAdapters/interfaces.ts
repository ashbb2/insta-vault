import type { Post } from '../../types/data.d'

export interface ImportAdapter {
  importFromInstagramUrl(url: string): Promise<Post>
}
