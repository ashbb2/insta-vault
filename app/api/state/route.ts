import { NextResponse } from 'next/server'
import type { Category, Collection, Post } from '../../../types/data.d'

type VaultState = {
  posts: Post[]
  categories: Category[]
  collections: Collection[]
}

const STATE_ROW_ID = 'default'

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

export async function GET() {
  try {
    const cfg = getSupabaseConfig()
    if (!cfg) {
      return NextResponse.json({ error: 'Cloud sync is not configured' }, { status: 501 })
    }

    const res = await supabaseRequest(`/rest/v1/vault_state?id=eq.${STATE_ROW_ID}&select=payload&limit=1`)
    if (!res.ok) {
      const msg = await res.text()
      return NextResponse.json({ error: `Supabase read failed: ${msg}` }, { status: 502 })
    }

    const rows = (await res.json()) as Array<{ payload?: VaultState }>
    const state = rows[0]?.payload

    return NextResponse.json({ state: state ?? null })
  } catch (err: any) {
    if (err?.message === 'SUPABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'Cloud sync is not configured' }, { status: 501 })
    }
    return NextResponse.json({ error: 'Failed to load cloud state' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cfg = getSupabaseConfig()
    if (!cfg) {
      return NextResponse.json({ error: 'Cloud sync is not configured' }, { status: 501 })
    }

    const body = await request.json()
    const payload = body as VaultState

    if (!Array.isArray(payload.posts) || !Array.isArray(payload.categories) || !Array.isArray(payload.collections)) {
      return NextResponse.json({ error: 'Invalid payload shape' }, { status: 400 })
    }

    const res = await supabaseRequest('/rest/v1/vault_state?on_conflict=id', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify([{ id: STATE_ROW_ID, payload }])
    })

    if (!res.ok) {
      const msg = await res.text()
      return NextResponse.json({ error: `Supabase write failed: ${msg}` }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    if (err?.message === 'SUPABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'Cloud sync is not configured' }, { status: 501 })
    }
    return NextResponse.json({ error: 'Failed to save cloud state' }, { status: 500 })
  }
}
