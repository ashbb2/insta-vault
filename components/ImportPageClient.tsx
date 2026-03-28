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
    <div className="flex flex-col h-screen bg-vault-bg overflow-hidden max-w-[430px] mx-auto">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-8">
        {/* Header */}
        <div className="mb-1">
          <div className="text-[22px] font-semibold tracking-[-0.5px] text-vault-text mb-1">
            vault<span className="text-vault-accent">.</span>
          </div>
          <div className="font-mono text-[12px] text-vault-text3">save a link</div>
        </div>

        <div className="mt-8 bg-vault-surface border border-vault-border2 rounded-2xl p-[14px] mb-4">
          <div className="flex gap-2">
            <input
              id="import-url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="paste your link..."
              className="flex-1 bg-vault-surface2 border border-vault-border rounded-[10px] px-3 py-[9px] text-[13px] text-vault-text font-mono outline-none placeholder:text-vault-text3"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              onKeyDown={e => { if (e.key === 'Enter') void importAndSave() }}
            />
            <button
              type="button"
              onClick={() => void importAndSave()}
              disabled={loading}
              className="bg-vault-accent text-white rounded-[10px] px-[14px] text-[11px] font-mono disabled:opacity-50 flex-shrink-0"
            >
              {loading ? '...' : 'save'}
            </button>
          </div>

          {importedPost && (
            <div className="flex gap-[10px] items-start mt-[10px] bg-vault-surface2 rounded-[10px] p-[10px]">
              {importedPost.thumbnail ? (
                <img
                  src={importedPost.thumbnail}
                  alt=""
                  className="w-[38px] h-[38px] rounded-[9px] object-cover flex-shrink-0 border border-vault-border"
                />
              ) : (
                <div className="w-[38px] h-[38px] rounded-[9px] bg-vault-surface border border-vault-border flex items-center justify-center flex-shrink-0 text-xl">📎</div>
              )}
              <p className="text-[12px] text-vault-text2 leading-[1.5] line-clamp-2">{importedPost.caption}</p>
            </div>
          )}
        </div>

        {error && (
          <p className="font-mono text-[12px] text-red-600 mb-4 px-1">{error}</p>
        )}

        {importedPost && (
          <div className="flex flex-col gap-2 mb-4">
            <button
              type="button"
              onClick={openSavedPost}
              className="w-full bg-vault-accent text-white rounded-xl py-3 text-sm font-medium"
            >
              open vault
            </button>
            <button
              type="button"
              onClick={resetForAnother}
              className="w-full bg-vault-surface border border-vault-border text-vault-text2 rounded-xl py-3 text-sm font-mono"
            >
              save another
            </button>
          </div>
        )}

        {!importedPost && !loading && (
          <p className="font-mono text-[11px] text-vault-text3 px-1 leading-relaxed">
            share any link from your iPhone → copy link → paste here → save
          </p>
        )}
      </div>
    </div>
  )
}
