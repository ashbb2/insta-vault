"use client"
import React, { useState } from 'react'
import { usePosts } from '../../components/PostsProvider'

export default function CategoriesPage() {
  const { categories, posts, addCategory, renameCategory, deleteCategory } = usePosts()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [reassignTo, setReassignTo] = useState<string | null>(null)

  function handleCreate() {
    if (!newName.trim()) return
    addCategory(newName.trim())
    setNewName('')
  }

  function startEdit(id: string, name: string) {
    setEditingId(id)
    setEditingName(name)
  }

  function confirmEdit() {
    if (!editingId) return
    renameCategory(editingId, editingName.trim())
    setEditingId(null)
    setEditingName('')
  }

  function startDelete(id: string) {
    setDeletingId(id)
    setReassignTo('c-unsorted')
  }

  function confirmDelete() {
    if (!deletingId) return
    const ok = deleteCategory(deletingId, reassignTo ?? undefined)
    if (!ok) alert('Delete failed — category still in use and no reassignment provided.')
    setDeletingId(null)
    setReassignTo(null)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Categories</h1>

      <div className="mb-6">
        <label className="text-sm">New category</label>
        <div className="flex gap-2 mt-2">
          <input className="border px-2 py-1 flex-1" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Category name" />
          <button className="px-3 py-1 bg-slate-800 text-white rounded" onClick={handleCreate}>Create</button>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((c) => {
          const count = posts.filter((p) => p.categoryId === c.id).length
          return (
            <div key={c.id} className="p-3 bg-white rounded shadow-sm flex items-center justify-between">
              <div>
                <div className="font-medium">{c.name} {c.id === 'c-unsorted' && <span className="text-xs text-slate-500">(default)</span>}</div>
                <div className="text-xs text-slate-500">{count} posts</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm px-2 py-1 border rounded" onClick={() => startEdit(c.id, c.name)}>Rename</button>
                <button className="text-sm px-2 py-1 border rounded" onClick={() => startDelete(c.id)} disabled={c.id === 'c-unsorted'}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>

      {editingId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditingId(null)} />
          <div className="bg-white p-4 rounded shadow z-10 w-full max-w-md">
            <h3 className="font-semibold mb-2">Rename category</h3>
            <input className="w-full border px-2 py-1" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
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
            <h3 className="font-semibold mb-2">Delete category</h3>
            <p className="text-sm text-slate-600">This category has posts — choose a category to reassign them to:</p>
            <select className="w-full border px-2 py-1 mt-2" value={reassignTo ?? ''} onChange={(e) => setReassignTo(e.target.value)}>
              {categories.filter((cc) => cc.id !== deletingId).map((cc) => (
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
