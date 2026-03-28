const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const DB_PATH = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/^file:\/\//, '') : path.join(process.cwd(), 'dev.sqlite')

function ensureDb() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const db = new Database(DB_PATH)
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT);
    CREATE TABLE IF NOT EXISTS collections (id TEXT PRIMARY KEY, name TEXT, description TEXT);
    CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, thumbnail TEXT, author TEXT, caption TEXT, transcript TEXT, notes TEXT, sourceUrl TEXT, categoryId TEXT, savedAt TEXT, editedAt TEXT);
    CREATE TABLE IF NOT EXISTS post_collections (id TEXT PRIMARY KEY, postId TEXT, collectionId TEXT);
    CREATE TABLE IF NOT EXISTS tags (id TEXT PRIMARY KEY, name TEXT UNIQUE);
    CREATE TABLE IF NOT EXISTS post_tags (id TEXT PRIMARY KEY, postId TEXT, tagId TEXT);
  `)
  return db
}

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()
}

const categories = [
  { id: 'c-unsorted', name: 'Unsorted' },
  { id: 'c-photo', name: 'Photography' },
  { id: 'c-food', name: 'Food' },
  { id: 'c-design', name: 'Design' },
  { id: 'c-travel', name: 'Travel' }
]

const collections = [
  { id: 'col-summer', name: 'Summer 2024', description: 'Summer shots and travel' },
  { id: 'col-inspo', name: 'Inspo', description: 'Creative inspiration' },
  { id: 'col-favs', name: 'Favorites', description: 'Favorites and bookmarks' }
]

const posts = [
  { id: 'p1', thumbnail: 'https://picsum.photos/400/400?random=1', author: '@alice', caption: 'Sunset over the hills', categoryId: 'c-photo', collectionIds: ['col-summer'], savedAt: daysAgo(2) },
  { id: 'p2', thumbnail: 'https://picsum.photos/400/400?random=2', author: '@bob', caption: 'Delicious brunch', categoryId: 'c-food', collectionIds: ['col-inspo'], savedAt: daysAgo(5) },
  { id: 'p3', thumbnail: 'https://picsum.photos/400/400?random=3', author: '@carla', caption: 'Modern poster design', categoryId: 'c-design', collectionIds: ['col-inspo','col-favs'], savedAt: daysAgo(7) },
  { id: 'p4', thumbnail: 'https://picsum.photos/400/400?random=4', author: '@dan', caption: 'City skyline', categoryId: 'c-photo', collectionIds: [], savedAt: daysAgo(10) },
  { id: 'p5', thumbnail: 'https://picsum.photos/400/400?random=5', author: '@ella', caption: 'Tasty pasta', categoryId: 'c-food', collectionIds: ['col-favs'], savedAt: daysAgo(1) },
  { id: 'p6', thumbnail: 'https://picsum.photos/400/400?random=6', author: '@felix', caption: 'Minimal layout', categoryId: 'c-design', collectionIds: [], savedAt: daysAgo(3) },
  { id: 'p7', thumbnail: 'https://picsum.photos/400/400?random=7', author: '@gina', caption: 'Mountain trail', categoryId: 'c-travel', collectionIds: ['col-summer'], savedAt: daysAgo(15) },
  { id: 'p8', thumbnail: 'https://picsum.photos/400/400?random=8', author: '@harry', caption: 'Street food corner', categoryId: 'c-food', collectionIds: [], savedAt: daysAgo(12) },
  { id: 'p9', thumbnail: 'https://picsum.photos/400/400?random=9', author: '@iris', caption: 'Architectural detail', categoryId: 'c-design', collectionIds: ['col-inspo'], savedAt: daysAgo(20) },
  { id: 'p10', thumbnail: 'https://picsum.photos/400/400?random=10', author: '@jack', caption: 'Cafe vibes', categoryId: 'c-unsorted', collectionIds: [], savedAt: daysAgo(4) }
]

function run() {
  const db = ensureDb()
  const insertCategory = db.prepare('INSERT OR REPLACE INTO categories (id, name) VALUES (?, ?)')
  const insertCollection = db.prepare('INSERT OR REPLACE INTO collections (id, name, description) VALUES (?, ?, ?)')
  const insertPost = db.prepare('INSERT OR REPLACE INTO posts (id, thumbnail, author, caption, transcript, notes, sourceUrl, categoryId, savedAt, editedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
  const insertTag = db.prepare('INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)')
  const insertPostTag = db.prepare('INSERT OR REPLACE INTO post_tags (id, postId, tagId) VALUES (?, ?, ?)')
  const insertPostCollection = db.prepare('INSERT OR REPLACE INTO post_collections (id, postId, collectionId) VALUES (?, ?, ?)')

  const tx = db.transaction(() => {
    for (const c of categories) insertCategory.run(c.id, c.name)
    for (const col of collections) insertCollection.run(col.id, col.name, col.description || null)
    for (const p of posts) {
      insertPost.run(p.id, p.thumbnail, p.author, p.caption, null, null, null, p.categoryId, p.savedAt, null)
      if (p.collectionIds && p.collectionIds.length) {
        for (const colId of p.collectionIds) insertPostCollection.run(`${p.id}-${colId}`, p.id, colId)
      }
    }
  })

  tx()
  db.close()
  console.log('Migration complete — inserted mock data')
}

run()
