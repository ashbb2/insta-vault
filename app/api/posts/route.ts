import { NextResponse } from 'next/server'

// Lightweight API route that proxies to dbRepo when DATABASE_URL is present, otherwise returns 501
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { dbRepo } = require('../../../lib/repos/dbRepo')
    const data = await dbRepo.loadAll()
    return NextResponse.json({ posts: data.posts })
  } catch (err) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 501 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // simple create flow using dbRepo.saveAll: load existing, prepend new, save
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { dbRepo } = require('../../../lib/repos/dbRepo')
    const existing = await dbRepo.loadAll()
    const newPost = body
    await dbRepo.saveAll({ posts: [newPost, ...existing.posts], categories: existing.categories, collections: existing.collections })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'DB not configured or bad payload' }, { status: 500 })
  }
}
