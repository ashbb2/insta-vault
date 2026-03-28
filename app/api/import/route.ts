import { NextResponse } from 'next/server'

function extractMeta(html: string, key: string) {
  const reProp = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']+)["']`, 'i')
  const match = html.match(reProp)
  if (match) return match[1]
  return null
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const url = String(body?.url || '')
    if (!url || !/^https?:\/\//i.test(url)) return NextResponse.json({ error: 'invalid url' }, { status: 400 })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)

    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Insta-Vault/1.0' } })
    clearTimeout(timeout)
    if (!res.ok) return NextResponse.json({ error: 'fetch failed' }, { status: 502 })

    const html = await res.text()
    const caption = extractMeta(html, 'og:description') || extractMeta(html, 'description') || extractMeta(html, 'og:title') || ''
    const thumbnail = extractMeta(html, 'og:image') || extractMeta(html, 'twitter:image') || ''
    const authorHandle = extractMeta(html, 'author') || extractMeta(html, 'og:site_name') || ''

    return NextResponse.json({ caption, transcript: null, thumbnail, authorHandle })
  } catch (err: any) {
    if (err?.name === 'AbortError') return NextResponse.json({ error: 'fetch timeout' }, { status: 504 })
    return NextResponse.json({ error: 'import failed' }, { status: 500 })
  }
}
