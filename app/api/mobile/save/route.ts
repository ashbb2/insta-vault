import { NextResponse } from 'next/server'
import type { Category, Collection, Post } from '../../../../types/data.d'

type VaultState = {
  posts: Post[]
  categories: Category[]
  collections: Collection[]
}

type ImportedMeta = {
  caption: string
  transcript: string | null
  thumbnail: string
  authorHandle: string
}

const STATE_ROW_ID = 'default'
const FALLBACK_THUMBNAIL = 'https://placehold.co/600x600/e2e8f0/475569?text=Saved+Post'

function getSupabaseConfig() {
  const baseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!baseUrl || !serviceRoleKey) return null

  return {
    baseUrl: baseUrl.replace(/\/$/, ''),
    serviceRoleKey
  }
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const cfg = getSupabaseConfig()
  if (!cfg) throw new Error('SUPABASE_NOT_CONFIGURED')

  const headers = new Headers(init.headers)
  headers.set('apikey', cfg.serviceRoleKey)
  headers.set('Authorization', `Bearer ${cfg.serviceRoleKey}`)

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(`${cfg.baseUrl}${path}`, {
    ...init,
    headers,
    cache: 'no-store'
  })
}

function normalizeAuthor(authorHandle: string) {
  const clean = (authorHandle || '').trim()
  if (!clean) return '@imported'
  return clean.startsWith('@') ? clean : `@${clean}`
}

async function importMetaFromUrl(url: string, originFallback: string): Promise<ImportedMeta> {
  const host = process.env.URL || originFallback
  if (!host) {
    return {
      caption: `Imported from ${url}`,
      transcript: null,
      thumbnail: FALLBACK_THUMBNAIL,
      authorHandle: '@imported'
    }
  }

  try {
    const importResp = await fetch(`${host}/api/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })

    if (!importResp.ok) throw new Error('import failed')

    const json = await importResp.json()
    return {
      caption: json.caption || `Imported from ${url}`,
      transcript: json.transcript || null,
      thumbnail: json.thumbnail || FALLBACK_THUMBNAIL,
      authorHandle: json.authorHandle || '@imported'
    }
  } catch {
    return {
      caption: `Imported from ${url}`,
      transcript: null,
      thumbnail: FALLBACK_THUMBNAIL,
      authorHandle: '@imported'
    }
  }
}

async function loadState(): Promise<VaultState | null> {
  const res = await supabaseRequest(`/rest/v1/vault_state?id=eq.${STATE_ROW_ID}&select=payload&limit=1`)
  if (!res.ok) throw new Error(`Supabase read failed: ${await res.text()}`)

  const rows = (await res.json()) as Array<{ payload?: VaultState }>
  return rows[0]?.payload ?? null
}

async function saveState(state: VaultState) {
  const res = await supabaseRequest('/rest/v1/vault_state?on_conflict=id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify([{ id: STATE_ROW_ID, payload: state }])
  })

  if (!res.ok) throw new Error(`Supabase write failed: ${await res.text()}`)
}

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  try {
    if (!getSupabaseConfig()) {
      return NextResponse.json({ error: 'Cloud sync is not configured' }, { status: 501 })
    }

    const body = await request.json()
    const rawUrl = String(body?.url || '').trim()
    const rawCategoryId = typeof body?.categoryId === 'string' ? body.categoryId.trim() : ''

    if (!isValidHttpUrl(rawUrl)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const originFallback = new URL(request.url).origin
    const meta = await importMetaFromUrl(rawUrl, originFallback)
    const existing = (await loadState()) ?? { posts: [], categories: [], collections: [] }

    const createdPost: Post = {
      id: `p-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      thumbnail: meta.thumbnail || FALLBACK_THUMBNAIL,
      author: normalizeAuthor(meta.authorHandle),
      caption: meta.caption,
      transcript: meta.transcript ?? undefined,
      sourceUrl: rawUrl,
      categoryId: rawCategoryId || 'c-unsorted',
      collectionIds: [],
      tags: [],
      savedAt: new Date().toISOString()
    }

    const nextState: VaultState = {
      ...existing,
      posts: [createdPost, ...existing.posts]
    }

    await saveState(nextState)

    return NextResponse.json({ ok: true, post: createdPost })
  } catch (err: any) {
    if (err?.message === 'SUPABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'Cloud sync is not configured' }, { status: 501 })
    }
    return NextResponse.json({ error: 'Failed to save URL' }, { status: 500 })
  }
}
