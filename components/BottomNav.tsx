"use client"
import React from 'react'
import { usePosts } from './PostsProvider'

export default function BottomNav() {
  const { activeCategoryId, setActiveCategory, setActiveCollection, setAddOpen, setAddModalCategoryId } = usePosts()

  const isHome = !activeCategoryId

  return (
    <nav className="h-[72px] bg-vault-surface border-t border-vault-border flex items-center justify-around px-5 pb-2 flex-shrink-0">
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
        className="flex flex-col items-center gap-1 opacity-[0.28] hover:opacity-100 transition-opacity"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
        <span className="font-mono text-[10px] text-vault-text2">add</span>
      </button>
    </nav>
  )
}

