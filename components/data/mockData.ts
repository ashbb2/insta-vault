import type { Post, Category, Collection } from '../../types/data.d'

// Categories (Unsorted is the default catch-all)
export const categories: Category[] = [
  { id: 'c-unsorted',     name: 'Unsorted',     icon: '📋' },
  { id: 'c-recipes',     name: 'Recipes',      icon: '🍳' },
  { id: 'c-movies',      name: 'Movies',       icon: '🎬' },
  { id: 'c-figma',       name: 'Figma',        icon: '◈' },
  { id: 'c-vscode',      name: 'VS Code',      icon: '⌨' },
  { id: 'c-claude',      name: 'Claude',       icon: '◆' },
  { id: 'c-chatgpt',     name: 'ChatGPT',      icon: '◉' },
  { id: 'c-toronto',     name: 'Toronto',      icon: '🏙' },
  { id: 'c-cafes',       name: 'Cafes',        icon: '☕' },
  { id: 'c-restaurants', name: 'Restaurants',  icon: '🍽' },
  { id: 'c-homehacks',   name: 'Home Hacks',   icon: '🔧' },
]

export const collections: Collection[] = [
  { id: 'col-favs',  name: 'Favorites',    description: 'Favourites and bookmarks' },
  { id: 'col-inspo', name: 'Inspo',        description: 'Creative inspiration' },
]

const now = Date.now()

function daysAgo(n: number) {
  return new Date(now - n * 24 * 60 * 60 * 1000).toISOString()
}

export const posts: Post[] = [
  {
    id: 'p1',
    thumbnail: 'https://picsum.photos/400/400?random=10',
    author: '@cookinwithclay',
    caption: 'Creamy paneer butter masala at home. One pan, 30 mins.',
    categoryId: 'c-recipes',
    collectionIds: [],
    tags: ['indian', 'quick'],
    savedAt: daysAgo(1)
  },
  {
    id: 'p2',
    thumbnail: 'https://picsum.photos/400/400?random=20',
    author: '@pastavibes',
    caption: 'Brown butter miso pasta — this has 4M views for a reason.',
    categoryId: 'c-recipes',
    collectionIds: ['col-favs'],
    tags: ['pasta', 'viral'],
    savedAt: daysAgo(3)
  },
  {
    id: 'p3',
    thumbnail: 'https://picsum.photos/400/400?random=30',
    author: '@a24films',
    caption: 'Past Lives. Best film of the year. Watch without reading anything first.',
    categoryId: 'c-movies',
    collectionIds: ['col-favs'],
    tags: ['a24', 'drama'],
    savedAt: daysAgo(5)
  },
  {
    id: 'p4',
    thumbnail: 'https://picsum.photos/400/400?random=40',
    author: '@figmatips',
    caption: 'Auto layout masterclass — everything from basics to advanced spacing tricks.',
    categoryId: 'c-figma',
    collectionIds: ['col-inspo'],
    tags: ['auto layout', 'tutorial'],
    savedAt: daysAgo(2)
  },
  {
    id: 'p5',
    thumbnail: 'https://picsum.photos/400/400?random=50',
    author: '@vscodedaily',
    caption: '10 VS Code extensions I use every day for React + TypeScript.',
    categoryId: 'c-vscode',
    collectionIds: [],
    tags: ['extensions', 'react'],
    savedAt: daysAgo(4)
  },
  {
    id: 'p6',
    thumbnail: 'https://picsum.photos/400/400?random=60',
    author: '@promptcraft',
    caption: 'Prompt chaining with Claude — multi-step workflows made easy.',
    categoryId: 'c-claude',
    collectionIds: ['col-inspo'],
    tags: ['prompting', 'workflow'],
    savedAt: daysAgo(6)
  },
  {
    id: 'p7',
    thumbnail: 'https://picsum.photos/400/400?random=70',
    author: '@torontofood',
    caption: 'Full Kensington Market guide — where to eat, what to skip.',
    categoryId: 'c-toronto',
    collectionIds: [],
    tags: ['kensington', 'weekend'],
    savedAt: daysAgo(8)
  },
  {
    id: 'p8',
    thumbnail: 'https://picsum.photos/400/400?random=80',
    author: '@cafehops',
    caption: 'Pilot Coffee Roasters — genuinely one of the best flat whites in the city.',
    categoryId: 'c-cafes',
    collectionIds: ['col-favs'],
    tags: ['coffee', 'west end'],
    savedAt: daysAgo(7)
  },
  {
    id: 'p9',
    thumbnail: 'https://picsum.photos/400/400?random=90',
    author: '@torontoeats',
    caption: 'Simit & Chai — Turkish breakfast in Toronto. Go before noon.',
    categoryId: 'c-restaurants',
    collectionIds: [],
    tags: ['breakfast', 'turkish'],
    savedAt: daysAgo(9)
  },
  {
    id: 'p10',
    thumbnail: 'https://picsum.photos/400/400?random=100',
    author: '@deskhacks',
    caption: 'Cable management with raceways — how to make your desk look completely clean.',
    categoryId: 'c-homehacks',
    collectionIds: [],
    tags: ['desk', 'cables'],
    savedAt: daysAgo(10)
  },
]
