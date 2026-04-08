"use client"
import React, { useEffect, useState } from 'react'
import { ImportAdapter } from './ImportAdapter'
import { usePosts } from './PostsProvider'
import type { Post } from '../types/data.d'

export default function AddPostModal({ open, onClose, onImported }: { open: boolean; onClose: () => void; onImported?: (p: Post) => void }) {
  const { addPost, categories, addModalCategoryId } = usePosts()

  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [previewCaption, setPreviewCaption] = useState('')
  const [previewThumb, setPreviewThumb] = useState('')
  const [previewAuthor, setPreviewAuthor] = useState('')
  const [caption, setCaption] = useState('')
  const [author, setAuthor] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState('c-unsorted')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [showSaved, setShowSaved] = useState(false)
  const [showCategoryPicker, setShowCategoryPicker] = useState(true)

  useEffect(() => {
    if (!open) return
    setCategoryId(addModalCategoryId ?? 'c-unsorted')
    setShowCategoryPicker(!addModalCategoryId)
  }, [open, addModalCategoryId])

  if (!open) return null

  function clearAll() {
    setUrl('')
    setPreviewCaption('')
    setPreviewThumb('')
    setPreviewAuthor('')
    setCaption('')
    setAuthor('')
    setImageUrl('')
    setCategoryId('c-unsorted')
    setTags([])
    setTagInput('')
    setShowSaved(false)
    setShowCategoryPicker(true)
  }

  async function handleImport() {
    if (!url.trim()) return
    setLoading(true)
    try {
      const result = await ImportAdapter.importFromInstagramUrl(url.trim())
      setPreviewCaption(result.caption)
      setPreviewThumb(result.thumbnail)
      setPreviewAuthor(result.authorHandle)
      setCaption(result.caption)
      setAuthor(result.authorHandle)
      setImageUrl(result.thumbnail)
    } catch {
      setPreviewCaption('Could not load preview — fill in manually below.')
    } finally {
      setLoading(false)
    }
  }

  function addTag() {
    const v = tagInput.trim().toLowerCase()
    if (!v || tags.includes(v)) { setTagInput(''); return }
    setTags(t => [...t, v])
    setTagInput('')
  }

  function removeTag(t: string) {
    setTags(prev => prev.filter(x => x !== t))
  }

  function handleSave() {
    const newPost: Post = {
      id: `p-${Date.now()}`,
      thumbnail: imageUrl || `https://picsum.photos/600/600?random=${Math.floor(Math.random() * 1000)}`,
      author: author || previewAuthor || 'unknown',
      caption: caption || previewCaption || '',
      categoryId,
      collectionIds: [],
      tags,
      savedAt: new Date().toISOString(),
      sourceUrl: url.trim() || undefined
    } as unknown as Post

    addPost(newPost)
    onImported?.(newPost)

    const cat = categories.find(c => c.id === categoryId)
    setShowSaved(true)
    setTimeout(() => {
      clearAll()
      onClose()
    }, 1800)
  }

  const hasPreview = !!previewCaption
  const selectedCategory = categories.find(c => c.id === categoryId)
  const isContextLockedCategory = !!addModalCategoryId

  if (showSaved) {
    const cat = categories.find(c => c.id === categoryId)
    return (
      <div className="fixed inset-0 z-50 bg-vault-bg/95 flex flex-col items-center justify-center gap-3">
        <div className="w-[52px] h-[52px] rounded-full bg-vault-accent-bg border border-vault-accent-border flex items-center justify-center text-[22px]">
          {cat?.icon ?? '✓'}
        </div>
        <div className="text-[17px] font-medium text-vault-text">saved</div>
        <div className="font-mono text-xs text-vault-text2">{cat?.name ?? 'vault'}</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-vault-bg flex flex-col overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-[18px]">
          <div className="text-[20px] font-semibold text-vault-text tracking-[-0.4px]">new save</div>
          <button
            onClick={() => { clearAll(); onClose() }}
            className="w-8 h-8 bg-vault-surface2 rounded-full border border-vault-border flex items-center justify-center"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B6966" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Paste zone */}
        <div className="bg-vault-surface border border-vault-border2 rounded-2xl p-[14px] mb-[14px]">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-vault-surface2 border border-vault-border rounded-[10px] px-3 py-[9px] text-[13px] text-vault-text font-mono outline-none placeholder:text-vault-text3"
              placeholder="paste your link..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleImport() }}
            />
            <button
              onClick={handleImport}
              disabled={loading || !url.trim()}
              className="bg-vault-accent text-white rounded-[10px] px-[14px] text-[11px] font-mono disabled:opacity-50 flex-shrink-0"
            >
              {loading ? '...' : 'import'}
            </button>
          </div>

          {/* Preview */}
          {hasPreview && (
            <div className="flex gap-[10px] items-start mt-[10px] bg-vault-surface2 rounded-[10px] p-[10px]">
              {previewThumb ? (
                <img
                  src={previewThumb}
                  alt=""
                  className="w-[38px] h-[38px] rounded-[9px] object-cover flex-shrink-0 border border-vault-border"
                />
              ) : (
                <div className="w-[38px] h-[38px] rounded-[9px] bg-vault-surface border border-vault-border flex items-center justify-center flex-shrink-0 text-lg">
                  {categories.find(c => c.id === categoryId)?.icon ?? '📎'}
                </div>
              )}
              <p className="text-[12px] text-vault-text2 leading-[1.5] line-clamp-2">{previewCaption}</p>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="flex items-center justify-between mb-2">
          <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px]">category</div>
          {isContextLockedCategory && (
            <button
              onClick={() => setShowCategoryPicker(v => !v)}
              className="font-mono text-[11px] text-vault-accent"
            >
              {showCategoryPicker ? 'done' : 'edit'}
            </button>
          )}
        </div>
        {showCategoryPicker ? (
          <div className="grid grid-cols-2 gap-1.5 mb-[14px]">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setCategoryId(c.id)
                  if (isContextLockedCategory) setShowCategoryPicker(false)
                }}
                className={`flex items-center gap-2 px-3 py-[9px] rounded-xl border text-[13px] font-medium transition-colors ${
                  categoryId === c.id
                    ? 'border-vault-accent text-vault-accent bg-vault-accent-bg'
                    : 'border-vault-border bg-vault-surface text-vault-text2'
                }`}
              >
                <span className={`text-sm w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                  categoryId === c.id ? 'bg-vault-accent-bg' : 'bg-vault-surface2'
                }`}>
                  {c.icon ?? '📁'}
                </span>
                <span className="truncate">{c.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-[14px]">
            <div className="flex items-center gap-2 px-3 py-[9px] rounded-xl border border-vault-accent bg-vault-accent-bg text-vault-accent">
              <span className="text-sm w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-vault-accent-bg">
                {selectedCategory?.icon ?? '📁'}
              </span>
              <span className="text-[13px] font-medium truncate">{selectedCategory?.name ?? 'unsorted'}</span>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-2">tags</div>
        <div className="bg-vault-surface border border-vault-border rounded-xl p-3 mb-[14px]">
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 bg-vault-surface2 border border-vault-border rounded-[10px] px-3 py-2 text-[13px] text-vault-text font-sans outline-none placeholder:text-vault-text3"
              placeholder="add tag..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            />
            <button
              onClick={addTag}
              className="bg-vault-surface2 border border-vault-border rounded-[10px] px-3 font-mono text-[11px] text-vault-text2"
            >
              + add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map(t => (
                <button
                  key={t}
                  onClick={() => removeTag(t)}
                  className="flex items-center gap-1 font-mono text-[11px] px-[10px] py-1 rounded-full bg-vault-accent-bg text-vault-accent border border-vault-accent-border"
                >
                  {t}
                  <span className="opacity-50">×</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full bg-vault-accent text-white rounded-xl py-[14px] text-[15px] font-medium"
        >
          save to vault
        </button>
      </div>
    </div>
  )
}

