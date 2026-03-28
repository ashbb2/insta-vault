"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { ImportAdapter } from './ImportAdapter'
import { usePosts } from './PostsProvider'
import type { Post } from '../types/data.d'

const FALLBACK_THUMBNAIL = 'https://placehold.co/600x600/e2e8f0/475569?text=Saved+Post'

function normalizeAuthor(authorHandle?: string) {
  const clean = (authorHandle || '').trim()
  if (!clean) return '@imported'
  return clean.startsWith('@') ? clean : `@${clean}`
}

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export default function ImportPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const autoImportStartedRef = useRef(false)

  const initialUrl = searchParams.get('url') || ''

  const [url, setUrl] = useState(initialUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importedPost, setImportedPost] = useState<Post | null>(null)

  const { addPost, setSelectedPostId } = usePosts()

  async function importAndSave(rawUrl?: string) {
    const candidate = (rawUrl ?? url).trim()

    if (!candidate) {
      setError('Paste a post link first.')
      return
    }

    if (!isValidHttpUrl(candidate)) {
      setError('Please use a valid http(s) URL.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await ImportAdapter.importFromInstagramUrl(candidate)

      const newPost: Post = {
        id: `p-${Date.now()}`,
        thumbnail: result.thumbnail || FALLBACK_THUMBNAIL,
        author: normalizeAuthor(result.authorHandle),
        caption: result.caption || `Imported from ${candidate}`,
        transcript: result.transcript,
        categoryId: 'c-unsorted',
        collectionIds: [],
        sourceUrl: candidate,
        savedAt: new Date().toISOString()
      }

      addPost(newPost)
      setImportedPost(newPost)
    } catch {
      setError('Import failed. Try another public post URL.')
    } finally {
      setLoading(false)
    }
  }

  function resetForAnother() {
    setImportedPost(null)
    setError(null)
    setUrl('')
    router.replace('/import')
  }

  function openSavedPost() {
    if (importedPost) setSelectedPostId(importedPost.id)
    router.push('/')
  }

  useEffect(() => {
    if (!initialUrl || autoImportStartedRef.current) return
    autoImportStartedRef.current = true
    void importAndSave(initialUrl)
  }, [initialUrl])

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 shadow-sm">
        <h1 className="text-xl md:text-2xl font-semibold">Quick Save Link</h1>
        <p className="mt-2 text-sm text-slate-600">
          Paste a post link and save it to your vault in one step.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <label htmlFor="import-url" className="text-xs font-medium text-slate-700">Post URL</label>
          <input
            id="import-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://instagram.com/p/..."
            className="w-full border rounded-md px-3 py-2 text-sm"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void importAndSave()}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm disabled:opacity-60"
          >
            {loading ? 'Importing...' : 'Import and Save'}
          </button>
          <button
            type="button"
            onClick={resetForAnother}
            className="px-4 py-2 rounded-md border border-slate-300 text-sm"
          >
            Clear
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {importedPost && (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm font-medium text-emerald-800">Saved successfully</p>
            <p className="mt-1 text-sm text-emerald-700 line-clamp-2">{importedPost.caption}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openSavedPost}
                className="px-3 py-1.5 rounded-md bg-emerald-700 text-white text-sm"
              >
                Open vault
              </button>
              <button
                type="button"
                onClick={resetForAnother}
                className="px-3 py-1.5 rounded-md border border-emerald-300 text-emerald-900 text-sm"
              >
                Save another link
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
          <p>iPhone flow: Share - Copy Link - open this page - paste - Import and Save.</p>
          <p>Shortcut URL format: /import?url=&lt;encoded_link&gt;</p>
        </div>
      </div>
    </div>
  )
}
