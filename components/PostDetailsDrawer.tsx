"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { usePosts } from './PostsProvider'
import type { Post } from '../types/data.d'

export default function PostDetailsDrawer() {
  const { posts, selectedPostId, setSelectedPostId, categories, collections, updatePost, deletePost } = usePosts()
  const post = useMemo(() => posts.find((p) => p.id === selectedPostId) ?? null, [posts, selectedPostId])

  const [local, setLocal] = useState<Partial<Post> | null>(null)
  const [showTranscript, setShowTranscript] = useState(false)
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    if (post) setLocal({ ...post })
    else setLocal(null)
    // initialize tags input string when post changes
    setTagsInput((post?.tags ?? []).join(', '))
  }, [post])

  if (!post || !local) return null

  const unsaved = (() => {
    if (!local) return false
    const base = Object.keys(local).some((k) => {
      // @ts-ignore
      return (post as any)[k] !== (local as any)[k]
    })
    const tagsStr = (post.tags ?? []).join(', ')
    return base || tagsInput !== tagsStr
  })()

  function handleSave() {
    if (!post || !local) return
    const parsedTags = tagsInput.split(',').map((s) => s.trim()).filter(Boolean)
    const updated: Post = {
      id: local.id ?? post.id,
      thumbnail: local.thumbnail ?? post.thumbnail,
      author: local.author ?? post.author,
      caption: local.caption ?? post.caption,
      categoryId: local.categoryId ?? post.categoryId,
      collectionIds: local.collectionIds ?? post.collectionIds,
      savedAt: local.savedAt ?? post.savedAt,
      transcript: local.transcript,
      notes: local.notes,
      sourceUrl: local.sourceUrl,
      tags: parsedTags,
      editedAt: new Date().toISOString()
    }
    updatePost(updated)
    setSelectedPostId(null)
  }

  function handleDelete() {
    if (!post) return
    if (!confirm('Delete this post?')) return
    deletePost(post.id)
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg z-50 overflow-auto">
      <div className="p-4 border-b flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold">Post Details</div>
          {unsaved && <div className="text-xs text-amber-600">Unsaved changes</div>}
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded border" onClick={() => setSelectedPostId(null)}>Close</button>
          <button className="px-3 py-1 rounded bg-slate-800 text-white" onClick={handleSave}>Save</button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <img src={post.thumbnail} className="w-full h-64 object-cover rounded" />

        <div>
          <label className="text-xs text-slate-500">Instagram URL</label>
          <input className="w-full border px-2 py-2 rounded mt-1" value={local.sourceUrl ?? ''} onChange={(e) => setLocal({ ...local, sourceUrl: e.target.value })} />
        </div>

        <div>
          <label className="text-xs text-slate-500">Caption</label>
          <textarea className="w-full border px-2 py-2 rounded mt-1" value={local.caption ?? ''} onChange={(e) => setLocal({ ...local, caption: e.target.value })} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-500">Transcript</label>
            <button className="text-xs text-slate-600" onClick={() => setShowTranscript((s) => !s)}>{showTranscript ? 'Hide' : 'Show'}</button>
          </div>
          {showTranscript && (
            <textarea className="w-full border px-2 py-2 rounded mt-1" value={local.transcript ?? ''} onChange={(e) => setLocal({ ...local, transcript: e.target.value })} />
          )}
        </div>

        <div>
          <label className="text-xs text-slate-500">Notes</label>
          <textarea className="w-full border px-2 py-2 rounded mt-1" value={local.notes ?? ''} onChange={(e) => setLocal({ ...local, notes: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500">Category</label>
            <select className="w-full border px-2 py-2 rounded mt-1" value={local.categoryId} onChange={(e) => setLocal({ ...local, categoryId: e.target.value })}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500">Collections</label>
            <div className="mt-1 space-y-1 max-h-28 overflow-auto">
              {collections.map((col) => (
                <label key={col.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={local.collectionIds?.includes(col.id) ?? false} onChange={(e) => {
                    const checked = e.target.checked
                    const prev = local.collectionIds ?? []
                    const next = checked ? [...prev, col.id] : prev.filter((id) => id !== col.id)
                    setLocal({ ...local, collectionIds: next })
                  }} />
                  {col.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500">Tags (comma separated)</label>
          <input className="w-full border px-2 py-2 rounded mt-1" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">Saved: {new Date(post.savedAt).toLocaleString()}</div>
          <div className="text-xs text-slate-500">Edited: {post.editedAt ? new Date(post.editedAt).toLocaleString() : '—'}</div>
        </div>

        <div className="pt-4 border-t">
          <button className="px-3 py-2 rounded bg-red-600 text-white" onClick={handleDelete}>Delete Post</button>
        </div>
      </div>
    </div>
  )
}
