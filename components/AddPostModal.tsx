"use client"
import React, { useState } from 'react'
import { ImportAdapter } from './ImportAdapter'
import { usePosts } from './PostsProvider'
import type { Post } from '../types/data.d'

export default function AddPostModal({ open, onClose, onImported }: { open: boolean; onClose: () => void; onImported?: (p: Post) => void }) {
  const [mode, setMode] = useState<'import' | 'manual'>('import')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const { addPost, categories, collections } = usePosts()

  // editable fields for manual save / post tweaks after import
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [author, setAuthor] = useState('')
  const [categoryId, setCategoryId] = useState('c-unsorted')
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [tagsText, setTagsText] = useState('')

  if (!open) return null

  function clearFields() {
    setUrl('')
    setImageUrl('')
    setCaption('')
    setAuthor('')
    setCategoryId('c-unsorted')
    setSelectedCollections([])
    setTagsText('')
  }

  async function handleImport() {
    if (!url) return
    setLoading(true)
    try {
      const result = await ImportAdapter.importFromInstagramUrl(url)
      // prefill editable fields so user can tweak before saving
      setImageUrl(result.thumbnail)
      setCaption(result.caption)
      setAuthor(result.authorHandle)
      setCategoryId('c-unsorted')
      setSelectedCollections([])
      setMode('manual')
    } finally {
      setLoading(false)
    }
  }

  function handleToggleCollection(id: string) {
    setSelectedCollections((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function parseTags(text: string) {
    return text
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  }

  function handleSave() {
    const tags = parseTags(tagsText)
    const newPost: Post = {
      id: `p-${Date.now()}`,
      thumbnail: imageUrl || `https://picsum.photos/600/600?random=${Math.floor(Math.random() * 1000)}`,
      author: author || 'unknown',
      caption: caption || '',
      categoryId: categoryId || 'c-unsorted',
      collectionIds: selectedCollections,
      tags: tags,
      savedAt: new Date().toISOString()
    } as unknown as Post

    addPost(newPost)
    onImported?.(newPost)
    clearFields()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-md p-6 w-full max-w-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Post</h3>
          <div className="flex gap-2">
            <button className={`px-3 py-1 rounded ${mode === 'import' ? 'bg-slate-800 text-white' : 'border'}`} onClick={() => setMode('import')}>Import</button>
            <button className={`px-3 py-1 rounded ${mode === 'manual' ? 'bg-slate-800 text-white' : 'border'}`} onClick={() => setMode('manual')}>Manual</button>
          </div>
        </div>

        {mode === 'import' && (
          <div>
            <p className="text-sm text-slate-600 mb-2">Paste an Instagram post URL and click Import — results will appear below for editing.</p>
            <div className="flex gap-2">
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://instagram.com/p/…" className="flex-1 border px-3 py-2 rounded" />
              <button className="px-4 py-2 rounded bg-slate-800 text-white" onClick={handleImport} disabled={loading}>{loading ? 'Importing…' : 'Import'}</button>
            </div>
          </div>
        )}

        {mode === 'manual' && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <div className="w-32 h-32 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                {imageUrl ? <img src={imageUrl} alt="preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm text-slate-500">No image</div>}
              </div>
              <div className="flex-1 space-y-2">
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (or leave blank)" className="w-full border px-3 py-2 rounded" />
                <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author handle (optional)" className="w-full border px-3 py-2 rounded" />
                <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" className="w-full border px-3 py-2 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Category</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border rounded px-2 py-1 mt-1">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600">Tags (comma separated)</label>
                <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="food, sunset" className="w-full border px-3 py-2 rounded mt-1" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-600">Collections (tap to toggle)</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {collections.map((col) => (
                  <button key={col.id} type="button" onClick={() => handleToggleCollection(col.id)} className={`text-xs px-2 py-1 rounded ${selectedCollections.includes(col.id) ? 'bg-amber-100' : 'bg-slate-100'}`}>
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded border" onClick={() => { clearFields(); onClose() }}>Cancel</button>
              <button className="px-3 py-1 rounded bg-slate-800 text-white" onClick={handleSave}>Save Post</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
