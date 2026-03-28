"use client"
import React, { useState } from 'react'
import { usePosts } from '../../components/PostsProvider'

export default function CollectionsPage() {
  const { collections, posts, addCollection, updateCollection, deleteCollection } = usePosts()
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingDesc, setEditingDesc] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [reassignTo, setReassignTo] = useState<string | null>(null)

  function handleCreate() {
    if (!newName.trim()) return
    addCollection(newName.trim(), newDesc.trim())
    setNewName('')
    setNewDesc('')
  }

  function startEdit(id: string, desc?: string) {
    setEditingId(id)
    setEditingDesc(desc ?? '')
  }

  function confirmEdit() {
    if (!editingId) return
    updateCollection(editingId, { description: editingDesc })
    setEditingId(null)
    setEditingDesc('')
  }

  function startDelete(id: string) {
    setDeletingId(id)
    const fallback = collections.find((c) => c.id !== id)?.id ?? null
    setReassignTo(fallback)
  }

  function confirmDelete() {
    if (!deletingId) return
    const ok = deleteCollection(deletingId, reassignTo ?? undefined)
    if (!ok) alert('Delete failed — collection still in use and no reassignment provided.')
    setDeletingId(null)
    setReassignTo(null)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Collections</h1>

      <div className="mb-6">
        <label className="text-sm">New collection</label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <input className="border px-2 py-1 col-span-2" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Collection name" />
          <input className="border px-2 py-1" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description" />
          <div className="col-span-3 flex justify-end mt-2">
            <button className="px-3 py-1 bg-slate-800 text-white rounded" onClick={handleCreate}>Create</button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {collections.map((c) => {
          const count = posts.filter((p) => p.collectionIds.includes(c.id)).length
          return (
            <div key={c.id} className="p-3 bg-white rounded shadow-sm flex items-center justify-between">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-slate-500">{c.description ?? ''}</div>
                <div className="text-xs text-slate-500">{count} posts</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm px-2 py-1 border rounded" onClick={() => startEdit(c.id, c.description)}>Edit</button>
                <button className="text-sm px-2 py-1 border rounded" onClick={() => startDelete(c.id)}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>

      {editingId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditingId(null)} />
          <div className="bg-white p-4 rounded shadow z-10 w-full max-w-md">
            <h3 className="font-semibold mb-2">Edit collection description</h3>
            <textarea className="w-full border px-2 py-1" value={editingDesc} onChange={(e) => setEditingDesc(e.target.value)} />
            <div className="mt-3 flex justify-end gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => setEditingId(null)}>Cancel</button>
              <button className="px-3 py-1 bg-slate-800 text-white rounded" onClick={confirmEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeletingId(null)} />
          <div className="bg-white p-4 rounded shadow z-10 w-full max-w-md">
            <h3 className="font-semibold mb-2">Delete collection</h3>
            <p className="text-sm text-slate-600">This collection has posts — choose a collection to reassign them to (or leave blank to just remove the tag):</p>
            <select className="w-full border px-2 py-1 mt-2" value={reassignTo ?? ''} onChange={(e) => setReassignTo(e.target.value)}>
              <option value="">(no reassignment)</option>
              {collections.filter((cc) => cc.id !== deletingId).map((cc) => (
                <option key={cc.id} value={cc.id}>{cc.name}</option>
              ))}
            </select>
            <div className="mt-3 flex justify-end gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => setDeletingId(null)}>Cancel</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
