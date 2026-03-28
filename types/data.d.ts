export type Category = {
  id: string
  name: string
  icon?: string
}

export type Collection = {
  id: string
  name: string
  description?: string
}

export type Post = {
  id: string
  thumbnail: string
  author: string
  caption: string
  categoryId: string
  collectionIds: string[]
  savedAt: string // ISO date
  transcript?: string
  notes?: string
  tags?: string[]
  sourceUrl?: string
  editedAt?: string
}
