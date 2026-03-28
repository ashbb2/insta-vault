"use client"
import React, { useState } from 'react'
import { usePosts } from '../components/PostsProvider'
import PostCard from '../components/PostCard'

export default function Page() {
  const {
    posts, filteredPosts,
    activeCategoryId, setActiveCategory,
    categories, searchText, setSearchText,
    setAddOpen
  } = usePosts()

  const [catDropOpen, setCatDropOpen] = useState(false)

  function postCountForCat(catId: string) {
    if (!searchText) return posts.filter(p => p.categoryId === catId).length
    const q = searchText.toLowerCase()
    return posts.filter(p =>
      p.categoryId === catId && (
        p.caption.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        (p.tags ?? []).some(t => t.toLowerCase().includes(q)) ||
        (p.notes ?? '').toLowerCase().includes(q)
      )
    ).length
  }

  const activeCategory = categories.find(c => c.id === activeCategoryId)

  const visibleCategories = searchText
    ? categories.filter(c =>
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        postCountForCat(c.id) > 0
      )
    : categories

  // ── CATEGORY VIEW ───────────────────────────────────────────────
  if (activeCategoryId) {
    const otherCats = categories.filter(c => c.id !== activeCategoryId)

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-3 pb-2 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Back */}
            <button
              onClick={() => { setActiveCategory(null); setCatDropOpen(false) }}
              className="w-[34px] h-[34px] bg-vault-surface border border-vault-border rounded-full flex items-center justify-center flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6966" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>

            {/* Category dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => setCatDropOpen(v => !v)}
                className="flex items-center gap-2 bg-vault-surface border border-vault-border2 rounded-xl px-3 py-2 w-full"
              >
                <span className="text-[15px] w-[26px] h-[26px] bg-vault-surface2 rounded-lg flex items-center justify-center flex-shrink-0">
                  {activeCategory?.icon ?? '📁'}
                </span>
                <span className="font-medium text-sm text-vault-text flex-1 text-left">
                  {activeCategory?.name}
                </span>
                <svg
                  className={`flex-shrink-0 transition-transform duration-200 ${catDropOpen ? 'rotate-180' : ''}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AEACA7" strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {catDropOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-vault-surface border border-vault-border2 rounded-xl overflow-hidden z-50 shadow-lg">
                  {otherCats.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setActiveCategory(c.id); setCatDropOpen(false) }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-vault-surface2 border-b border-vault-border last:border-b-0 text-left transition-colors"
                    >
                      <span className="text-sm w-[26px] h-[26px] bg-vault-surface2 rounded-lg flex items-center justify-center flex-shrink-0">
                        {c.icon ?? '📁'}
                      </span>
                      <span className="font-medium text-sm text-vault-text flex-1">{c.name}</span>
                      <span className="font-mono text-[10px] text-vault-text3">
                        {posts.filter(p => p.categoryId === c.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post list */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-2">
          {filteredPosts.length === 0 ? (
            <div className="text-center font-mono text-sm text-vault-text3 py-10">nothing here yet</div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredPosts.map(p => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── HOME VIEW ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-[14px]">
          <div className="text-[22px] font-semibold tracking-[-0.5px] text-vault-text">
            vault<span className="text-vault-accent">.</span>
          </div>
          <span className="font-mono text-[11px] text-vault-accent bg-vault-accent-bg border border-vault-accent-border px-[10px] py-[3px] rounded-full">
            {posts.length} saved
          </span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-[10px] bg-vault-surface border border-vault-border2 rounded-xl px-[14px] py-[10px]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#AEACA7" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="search everything..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-vault-text flex-1 placeholder:text-vault-text3 font-sans"
          />
          {searchText && (
            <button onClick={() => setSearchText('')} className="text-vault-text3 hover:text-vault-text2 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
        {visibleCategories.length === 0 ? (
          <div className="text-center font-mono text-sm text-vault-text3 py-10">nothing found</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {visibleCategories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className="bg-vault-surface border border-vault-border rounded-2xl p-4 flex flex-col gap-2 text-left hover:border-vault-accent-border transition-colors min-h-[100px] cursor-pointer"
              >
                <span className="text-[22px] leading-none">{c.icon ?? '📁'}</span>
                <span className="font-medium text-[13px] text-vault-text">{c.name}</span>
                <span className="font-mono text-[10px] text-vault-text3 mt-auto">
                  {postCountForCat(c.id)} saved
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-[82px] right-5 w-[50px] h-[50px] bg-vault-accent rounded-full flex items-center justify-center z-10 shadow-md hover:scale-105 transition-transform"
        aria-label="Add post"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>
    </div>
  )
}

