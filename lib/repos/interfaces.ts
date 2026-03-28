import type { Post, Category, Collection } from '../../types/data.d'

export interface PostRepository {
  load(): Post[]
  save(posts: Post[]): void
}

export interface CategoryRepository {
  load(): Category[]
  save(categories: Category[]): void
}

export interface CollectionRepository {
  load(): Collection[]
  save(collections: Collection[]): void
}

export interface ReposBundle {
  posts: PostRepository
  categories: CategoryRepository
  collections: CollectionRepository
}
