import type { Post, Category, Collection } from '../../../types/data.d'

// Categories (include Unsorted)
export const categories: Category[] = [
  { id: 'c-unsorted', name: 'Unsorted' },
  { id: 'c-photo', name: 'Photography' },
  { id: 'c-food', name: 'Food' },
  { id: 'c-design', name: 'Design' },
  { id: 'c-travel', name: 'Travel' }
]

export const collections: Collection[] = [
  { id: 'col-summer', name: 'Summer 2024', description: 'Summer shots and travel' },
  { id: 'col-inspo', name: 'Inspo', description: 'Creative inspiration' },
  { id: 'col-favs', name: 'Favorites', description: 'Favorites and bookmarks' }
]

const now = Date.now()

function daysAgo(n: number) {
  return new Date(now - n * 24 * 60 * 60 * 1000).toISOString()
}

export const posts: Post[] = [
  {
    id: 'p1',
    thumbnail: 'https://picsum.photos/400/400?random=1',
    author: '@alice',
    caption: 'Sunset over the hills',
    categoryId: 'c-photo',
    collectionIds: ['col-summer'],
    savedAt: daysAgo(2)
  },
  {
    id: 'p2',
    thumbnail: 'https://picsum.photos/400/400?random=2',
    author: '@bob',
    caption: 'Delicious brunch',
    categoryId: 'c-food',
    collectionIds: ['col-inspo'],
    savedAt: daysAgo(5)
  },
  {
    id: 'p3',
    thumbnail: 'https://picsum.photos/400/400?random=3',
    author: '@carla',
    caption: 'Modern poster design',
    categoryId: 'c-design',
    collectionIds: ['col-inspo', 'col-favs'],
    savedAt: daysAgo(7)
  },
  {
    id: 'p4',
    thumbnail: 'https://picsum.photos/400/400?random=4',
    author: '@dan',
    caption: 'City skyline',
    categoryId: 'c-photo',
    collectionIds: [],
    savedAt: daysAgo(10)
  },
  {
    id: 'p5',
    thumbnail: 'https://picsum.photos/400/400?random=5',
    author: '@ella',
    caption: 'Tasty pasta',
    categoryId: 'c-food',
    collectionIds: ['col-favs'],
    savedAt: daysAgo(1)
  },
  {
    id: 'p6',
    thumbnail: 'https://picsum.photos/400/400?random=6',
    author: '@felix',
    caption: 'Minimal layout',
    categoryId: 'c-design',
    collectionIds: [],
    savedAt: daysAgo(3)
  },
  {
    id: 'p7',
    thumbnail: 'https://picsum.photos/400/400?random=7',
    author: '@gina',
    caption: 'Mountain trail',
    categoryId: 'c-travel',
    collectionIds: ['col-summer'],
    savedAt: daysAgo(15)
  },
  {
    id: 'p8',
    thumbnail: 'https://picsum.photos/400/400?random=8',
    author: '@harry',
    caption: 'Street food corner',
    categoryId: 'c-food',
    collectionIds: [],
    savedAt: daysAgo(12)
  },
  {
    id: 'p9',
    thumbnail: 'https://picsum.photos/400/400?random=9',
    author: '@iris',
    caption: 'Architectural detail',
    categoryId: 'c-design',
    collectionIds: ['col-inspo'],
    savedAt: daysAgo(20)
  },
  {
    id: 'p10',
    thumbnail: 'https://picsum.photos/400/400?random=10',
    author: '@jack',
    caption: 'Cafe vibes',
    categoryId: 'c-unsorted',
    collectionIds: [],
    savedAt: daysAgo(4)
  }
]
