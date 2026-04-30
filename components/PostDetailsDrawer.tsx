"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { usePosts } from './PostsProvider'
import type { Post } from '../types/data.d'
import { DEFAULT_CATEGORY_COLOR } from '../lib/categoryColors'

export default function PostDetailsDrawer() {
  const { posts, selectedPostId, setSelectedPostId, categories, collections, updatePost, deletePost } = usePosts()
  const post = useMemo(() => posts.find((p) => p.id === selectedPostId) ?? null, [posts, selectedPostId])

  const [editMode, setEditMode] = useState(false)
  const [local, setLocal] = useState<Partial<Post> | null>(null)
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    if (post) {
      setLocal({ ...post })
      setTagsInput((post.tags ?? []).join(', '))
    } else {
      setLocal(null)
      setEditMode(false)
    }
  }, [post])

  if (!post || !local) return null

  const category = categories.find(c => c.id === post.categoryId)

  const hasChanges = (() => {
    if (!local) return false
    const base = Object.keys(local).some(k => (post as any)[k] !== (local as any)[k])
    return base || tagsInput !== (post.tags ?? []).join(', ')
  })()

  function handleSave() {
    if (!post || !local) return
    const parsedTags = tagsInput.split(',').map(s => s.trim()).filter(Boolean)
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
    setEditMode(false)
  }

  function handleDelete() {
    if (!post) return
    if (!confirm('Delete this post?')) return
    deletePost(post.id)
  }

  return (
    <div className="fixed inset-0 z-50 bg-vault-bg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 flex-shrink-0">
        <button
          onClick={() => setSelectedPostId(null)}
          className="w-[34px] h-[34px] bg-vault-surface border border-vault-border rounded-full flex items-center justify-center flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6966" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <span className="font-mono text-sm text-vault-text2 flex-1">
          <span
            className="inline-block w-[12px] h-[12px] rounded-full border border-white/80 mr-2 align-middle"
            style={{ backgroundColor: category?.color ?? DEFAULT_CATEGORY_COLOR }}
          />
          {category?.name ?? ''}
        </span>
        <button
          onClick={() => { editMode ? setEditMode(false) : setEditMode(true) }}
          className={`font-mono text-[11px] px-3 py-1.5 rounded-lg border transition-colors ${
            editMode
              ? 'bg-vault-accent-bg border-vault-accent-border text-vault-accent'
              : 'bg-vault-surface border-vault-border text-vault-text2'
          }`}
        >
          {editMode ? 'done' : 'edit'}
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6">

        {/* Hero image */}
        <div className="w-full h-[150px] rounded-2xl bg-vault-accent-bg border border-vault-accent-border flex items-center justify-center mb-4 overflow-hidden">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt=""
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <span
              className="w-[32px] h-[32px] rounded-full border border-white/80 inline-block"
              style={{ backgroundColor: category?.color ?? DEFAULT_CATEGORY_COLOR }}
            />
          )}
        </div>

        {/* Author / title */}
        <div className="text-[17px] font-medium text-vault-text leading-[1.4] mb-2">
          {post.author}
        </div>

        {/* Caption */}
        {!editMode ? (
          <p className="text-sm text-vault-text2 leading-[1.7] mb-4">
            {post.caption || <span className="text-vault-text3 italic">No caption</span>}
          </p>
        ) : (
          <textarea
            className="w-full bg-vault-surface border border-vault-border2 rounded-xl px-3 py-2.5 text-sm text-vault-text outline-none mb-3 resize-none font-sans"
            rows={4}
            value={local.caption ?? ''}
            onChange={e => setLocal({ ...local, caption: e.target.value })}
            placeholder="Caption..."
          />
        )}

        {/* Tags */}
        {!editMode ? (
          post.tags && post.tags.length > 0 && (
            <div className="mb-4">
              <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-2">tags</div>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(t => (
                  <span key={t} className="font-mono text-[10px] px-[7px] py-[2px] rounded-full bg-vault-accent-bg text-vault-accent border border-vault-accent-border">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="mb-3">
            <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-1.5">tags (comma separated)</div>
            <input
              className="w-full bg-vault-surface border border-vault-border2 rounded-xl px-3 py-2.5 text-sm text-vault-text outline-none font-sans"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="recipe, quick, healthy"
            />
          </div>
        )}

        {/* Edit-mode extra fields */}
        {editMode && (
          <>
            <div className="mb-3">
              <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-1.5">category</div>
              <select
                className="w-full bg-vault-surface border border-vault-border2 rounded-xl px-3 py-2.5 text-sm text-vault-text outline-none font-sans"
                value={local.categoryId}
                onChange={e => setLocal({ ...local, categoryId: e.target.value })}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-1.5">notes</div>
              <textarea
                className="w-full bg-vault-surface border border-vault-border2 rounded-xl px-3 py-2.5 text-sm text-vault-text outline-none font-sans resize-none"
                rows={3}
                value={local.notes ?? ''}
                onChange={e => setLocal({ ...local, notes: e.target.value })}
                placeholder="Your notes..."
              />
            </div>
          </>
        )}

        {/* Notes (read mode) */}
        {!editMode && post.notes && (
          <div className="mb-4">
            <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-1.5">notes</div>
            <p className="text-sm text-vault-text2 leading-[1.6]">{post.notes}</p>
          </div>
        )}

        {/* Open link button */}
        {post.sourceUrl && (
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-vault-accent text-white rounded-xl py-[13px] text-sm font-medium mb-4"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            open original link
          </a>
        )}

        {/* Save / Delete in edit mode */}
        {editMode && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-vault-border">
            {hasChanges && (
              <button
                onClick={handleSave}
                className="flex-1 bg-vault-accent text-white rounded-xl py-3 text-sm font-medium"
              >
                save changes
              </button>
            )}
            <button
              onClick={handleDelete}
              className="flex-1 bg-vault-surface border border-vault-border text-vault-text3 rounded-xl py-3 text-sm font-mono"
            >
              delete
            </button>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-4 mb-2 flex justify-between">
          <span className="font-mono text-[10px] text-vault-text3">
            saved {new Date(post.savedAt).toLocaleDateString()}
          </span>
          {post.editedAt && (
            <span className="font-mono text-[10px] text-vault-text3">
              edited {new Date(post.editedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

