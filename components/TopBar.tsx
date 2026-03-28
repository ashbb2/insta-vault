"use client"
import React, { useState } from 'react'
import Button from './ui/Button'
import { usePosts } from './PostsProvider'

export default function TopBar({ sidebarOpen, setSidebarOpen, onOpenAdd }: { sidebarOpen?: boolean; setSidebarOpen?: (v: boolean) => void; onOpenAdd?: () => void }) {
  const [toast, setToast] = useState<string | null>(null)
  const { searchText, setSearchText, sortOption, setSortOption, activeCategoryId, activeCollectionId } = usePosts()

  function handleImported() {
    setToast('Post imported')
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="hidden md:flex items-center justify-between px-4 md:px-6 py-3 gap-4">
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">{activeCategoryId ? `Category: ${activeCategoryId.replace('c-','')}` : activeCollectionId ? `Collection: ${activeCollectionId.replace('col-','')}` : 'All Posts'}</div>

        <div>
          <input
            placeholder="Search author, caption, tags, notes, collections..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border rounded px-3 py-1 text-sm w-64"
          />
        </div>
        <select className="border rounded px-2 py-1 text-sm" value={sortOption} onChange={(e) => setSortOption(e.target.value as any)}>
          <option value="newest">Newest saved</option>
          <option value="oldest">Oldest saved</option>
          <option value="recently-edited">Recently edited</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={() => onOpenAdd && onOpenAdd()} aria-label="open-add-post">+ Add Post</Button>
        <div className="w-8 h-8 bg-slate-200 rounded-full" />
      </div>

      {toast && (
        <div className="fixed right-4 bottom-4 bg-slate-900 text-white px-4 py-2 rounded shadow">{toast}</div>
      )}
    </div>
  )
}
