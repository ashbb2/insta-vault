"use client"
import React from 'react'
import { usePosts } from './PostsProvider'

export default function BottomNav() {
  const {
    activeCategoryId,
    setActiveCategory,
    setActiveCollection,
    setAddOpen,
    setAddModalCategoryId,
    setAddCategoryOpen,
    addOpen
  } = usePosts()

  const isHome = !activeCategoryId

  return (
    <nav className="h-[72px] bg-vault-surface border-t border-vault-border flex items-center justify-around px-5 pb-2 flex-shrink-0">
      {/* Add Category */}
      <button
        onClick={() => setAddCategoryOpen(true)}
        className="flex flex-col items-center gap-1 opacity-100 transition-opacity"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C2D3E" strokeWidth="1.8">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h8"/>
          <path d="M16 3v6M13 6h6"/>
        </svg>
        <span className="font-mono text-[10px] text-vault-accent">category</span>
      </button>

      {/* Home */}
      <button
        onClick={() => { setActiveCategory(null); setActiveCollection(null) }}
        className={`flex flex-col items-center gap-1 transition-opacity ${isHome ? 'opacity-100' : 'opacity-[0.28]'}`}
      >
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke={isHome ? '#7C2D3E' : 'currentColor'} strokeWidth="1.8"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </svg>
        <span className={`font-mono text-[10px] ${isHome ? 'text-vault-accent' : 'text-vault-text2'}`}>home</span>
      </button>

      {/* Add */}
      <button
        onClick={() => {
          setAddModalCategoryId(activeCategoryId)
          setAddOpen(true)
        }}
        className={`flex flex-col items-center gap-1 transition-opacity ${addOpen ? 'opacity-100' : 'opacity-100 hover:opacity-100'}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={addOpen ? '#7C2D3E' : 'currentColor'} strokeWidth="1.8">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
        <span className={`font-mono text-[10px] ${addOpen ? 'text-vault-accent' : 'text-vault-text2'}`}>add</span>
      </button>
    </nav>
  )
}

