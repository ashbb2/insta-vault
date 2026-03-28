// Stub adapter that "imports" data from an Instagram URL. Returns mocked data.
export type ImportResult = {
  caption: string
  transcript?: string
  thumbnail: string
  authorHandle: string
}

export const ImportAdapter = {
  async importFromInstagramUrl(url: string): Promise<ImportResult> {
    // Try server-side import first (returns og:description, og:image, author)
    try {
      const resp = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      if (resp.ok) {
        const json = await resp.json()
        return {
          caption: json.caption || `Imported caption from ${url}`,
          transcript: json.transcript || undefined,
          thumbnail: json.thumbnail || `https://picsum.photos/600/600?random=${Math.floor(Math.random() * 1000)}`,
          authorHandle: json.authorHandle || '@imported'
        }
      }
    } catch (e) {
      // fallthrough to client-side mock
    }

    // Fallback mocked data when server import fails
    const rnd = Math.floor(Math.random() * 1000)
    return {
      caption: `Imported caption from ${url}`,
      transcript: `Transcript for ${url}`,
      thumbnail: `https://picsum.photos/600/600?random=${rnd}`,
      authorHandle: `@imported_${rnd}`
    }
  }
}
