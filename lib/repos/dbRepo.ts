import type { Post, Category, Collection } from '../../types/data.d'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/^file:\/\//, '') : path.join(process.cwd(), 'dev.sqlite')

function ensureDb() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const db = new Database(DB_PATH)

  // schema
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

export async function loadAll() {
  const db = ensureDb()
  const postsRaw = db.prepare('SELECT * FROM posts ORDER BY savedAt DESC').all()
  const categoriesRaw = db.prepare('SELECT * FROM categories').all()
  const collectionsRaw = db.prepare('SELECT * FROM collections').all()

  const posts: Post[] = postsRaw.map((p: any) => {
    const collectionRows = db.prepare('SELECT collectionId FROM post_collections WHERE postId = ?').all(p.id)
    const tagRows = db.prepare('SELECT t.name FROM post_tags pt JOIN tags t ON pt.tagId = t.id WHERE pt.postId = ?').all(p.id)
    return {
      id: p.id,
      thumbnail: p.thumbnail,
      author: p.author,
      caption: p.caption,
      transcript: p.transcript || undefined,
      notes: p.notes || undefined,
      sourceUrl: p.sourceUrl || undefined,
      categoryId: p.categoryId,
      collectionIds: collectionRows.map((r: any) => r.collectionId),
      tags: tagRows.map((r: any) => r.name),
      savedAt: p.savedAt,
      editedAt: p.editedAt || undefined
    }
  })

  db.close()
  return { posts, categories: categoriesRaw as Category[], collections: collectionsRaw as Collection[] }
}

export async function saveAll(payload: { posts: Post[]; categories: Category[]; collections: Collection[] }) {
  const db = ensureDb()
  const insertCategory = db.prepare('INSERT OR REPLACE INTO categories (id, name) VALUES (?, ?)')
  const insertCollection = db.prepare('INSERT OR REPLACE INTO collections (id, name, description) VALUES (?, ?, ?)')
  const insertPost = db.prepare('INSERT OR REPLACE INTO posts (id, thumbnail, author, caption, transcript, notes, sourceUrl, categoryId, savedAt, editedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
  const insertTag = db.prepare('INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)')
  const insertPostTag = db.prepare('INSERT OR REPLACE INTO post_tags (id, postId, tagId) VALUES (?, ?, ?)')
  const insertPostCollection = db.prepare('INSERT OR REPLACE INTO post_collections (id, postId, collectionId) VALUES (?, ?, ?)')

  const tx = db.transaction(() => {
    for (const c of payload.categories) {
      insertCategory.run(c.id, c.name)
    }
    for (const col of payload.collections) {
      insertCollection.run(col.id, col.name, col.description || null)
    }

    for (const p of payload.posts) {
      insertPost.run(p.id, p.thumbnail, p.author, p.caption, p.transcript ?? null, p.notes ?? null, p.sourceUrl ?? null, p.categoryId, p.savedAt, p.editedAt ?? null)

      // tags: ensure tag exists and link
      if (p.tags && p.tags.length) {
        for (const t of p.tags) {
          const tagId = `tag-${t.replace(/\s+/g, '-').toLowerCase()}`
          insertTag.run(tagId, t)
          insertPostTag.run(`${p.id}-${tagId}`, p.id, tagId)
        }
      }

      // collections
      if (p.collectionIds && p.collectionIds.length) {
        for (const colId of p.collectionIds) {
          insertPostCollection.run(`${p.id}-${colId}`, p.id, colId)
        }
      }
    }
  })

  tx()
  db.close()
}

export const dbRepo = { loadAll, saveAll }

export default dbRepo
