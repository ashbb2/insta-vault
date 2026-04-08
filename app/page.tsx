"use client"
import React, { useState } from 'react'
import { usePosts } from '../components/PostsProvider'
import PostCard from '../components/PostCard'

// Common emoji suggestions for new categories
const EMOJI_SUGGESTIONS = ['📁','🎵','💪','📚','🌿','🎮','✈️','💡','🏠','🛍','🎨','💼','🌍','🏋️','🍕']

export default function Page() {
  const {
    posts, filteredPosts,
    activeCategoryId, setActiveCategory,
    categories, searchText, setSearchText,
    setAddOpen, setAddModalCategoryId, addCategory, updateCategory, deleteCategory
  } = usePosts()

  const [catDropOpen, setCatDropOpen] = useState(false)
  const [addCatOpen, setAddCatOpen] = useState(false)
  const [manageCatOpen, setManageCatOpen] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('📁')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [editingCategoryIcon, setEditingCategoryIcon] = useState('📁')

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

  function handleCreateCategory() {
    const name = newCatName.trim()
    if (!name) return
    const cat = addCategory(name, newCatIcon)
    setNewCatName('')
    setNewCatIcon('📁')
    setAddCatOpen(false)
    setActiveCategory(cat.id)
  }

  function beginCategoryEdit(categoryId: string) {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
    setEditingCategoryIcon(category.icon ?? '📁')
  }

  function openCategoryManager() {
    const initialId = activeCategoryId ?? categories[0]?.id
    if (initialId) beginCategoryEdit(initialId)
    setManageCatOpen(true)
  }

  function closeCategoryManager() {
    setManageCatOpen(false)
    setEditingCategoryId(null)
    setEditingCategoryName('')
    setEditingCategoryIcon('📁')
  }

  function handleSaveCategoryEdit() {
    const name = editingCategoryName.trim()
    if (!editingCategoryId || !name) return
    updateCategory(editingCategoryId, { name, icon: editingCategoryIcon })
  }

  function handleDeleteCategory() {
    if (!editingCategoryId || editingCategoryId === 'c-unsorted') return
    const deleted = deleteCategory(editingCategoryId, 'c-unsorted')
    if (!deleted) return
    if (activeCategoryId === editingCategoryId) setActiveCategory('c-unsorted')
    beginCategoryEdit('c-unsorted')
  }

  const activeCategory = categories.find(c => c.id === activeCategoryId)
  const editingCategory = categories.find(c => c.id === editingCategoryId)

  const showingSearchResults = searchText.trim().length > 0

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
          <div className="flex items-center gap-2">
            <button
              onClick={openCategoryManager}
              className="font-mono text-[11px] text-vault-text2 bg-vault-surface border border-vault-border px-[10px] py-[3px] rounded-full"
            >
              edit categories
            </button>
            <span className="font-mono text-[11px] text-vault-accent bg-vault-accent-bg border border-vault-accent-border px-[10px] py-[3px] rounded-full">
              {posts.length} saved
            </span>
          </div>
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

      {/* Home content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
        {showingSearchResults ? (
          filteredPosts.length === 0 ? (
            <div className="text-center font-mono text-sm text-vault-text3 py-10">nothing found</div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-[12px] text-vault-text3 px-1 pb-1">
                all posts · {filteredPosts.length}
              </div>
              {filteredPosts.map(p => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col gap-2">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className="bg-vault-surface border border-vault-border rounded-xl px-3 py-2.5 flex items-center gap-3 text-left hover:border-vault-accent-border transition-colors cursor-pointer"
              >
                <span className="text-[16px] w-[30px] h-[30px] bg-vault-surface2 rounded-lg flex items-center justify-center flex-shrink-0">
                  {c.icon ?? '📁'}
                </span>
                <span className="font-medium text-[13px] text-vault-text flex-1 min-w-0 truncate">{c.name}</span>
                <span className="min-w-[22px] h-[22px] px-1.5 rounded-full border border-vault-border bg-vault-surface2 font-mono text-[10px] text-vault-text2 flex items-center justify-center flex-shrink-0">
                  {postCountForCat(c.id)}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AEACA7" strokeWidth="2" className="flex-shrink-0">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            ))}

            <button
              onClick={() => setAddCatOpen(true)}
              className="bg-vault-surface border border-dashed border-vault-border2 rounded-xl px-3 py-2.5 flex items-center gap-3 text-left hover:border-vault-accent-border transition-colors cursor-pointer"
            >
              <span className="text-[16px] w-[30px] h-[30px] bg-vault-surface2 rounded-lg flex items-center justify-center flex-shrink-0 opacity-60">+</span>
              <span className="font-medium text-[13px] text-vault-text3 flex-1">add category</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {addCatOpen && (
        <div className="fixed inset-0 z-50 bg-vault-bg/90 flex items-end justify-center">
          <div className="w-full max-w-[430px] bg-vault-surface rounded-t-3xl border-t border-vault-border px-5 pt-5 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-[17px] text-vault-text">new category</div>
              <button
                onClick={() => { setAddCatOpen(false); setNewCatName(''); setNewCatIcon('📁') }}
                className="w-8 h-8 bg-vault-surface2 border border-vault-border rounded-full flex items-center justify-center"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6966" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Name input */}
            <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-1.5">name</div>
            <input
              autoFocus
              className="w-full bg-vault-surface2 border border-vault-border2 rounded-xl px-3 py-3 text-sm text-vault-text font-sans outline-none placeholder:text-vault-text3 mb-4"
              placeholder="e.g. Travel, Books, Work..."
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreateCategory() }}
            />

            {/* Icon picker */}
            <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-2">icon</div>
            <div className="flex gap-2 flex-wrap mb-5">
              {EMOJI_SUGGESTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setNewCatIcon(emoji)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-colors ${
                    newCatIcon === emoji
                      ? 'border-vault-accent bg-vault-accent-bg'
                      : 'border-vault-border bg-vault-surface2'
                  }`}
                >
                  {emoji}
                </button>
              ))}
              {/* Custom emoji input */}
              <input
                className="w-9 h-9 rounded-xl border border-vault-border bg-vault-surface2 text-center text-lg outline-none"
                placeholder="✏️"
                value={!EMOJI_SUGGESTIONS.includes(newCatIcon) ? newCatIcon : ''}
                maxLength={2}
                onChange={e => { if (e.target.value) setNewCatIcon(e.target.value) }}
              />
            </div>

            <button
              onClick={handleCreateCategory}
              disabled={!newCatName.trim()}
              className="w-full bg-vault-accent text-white rounded-xl py-3 text-sm font-medium disabled:opacity-40"
            >
              create category
            </button>
          </div>
        </div>
      )}

      {/* Edit Categories Modal */}
      {manageCatOpen && (
        <div className="fixed inset-0 z-50 bg-vault-bg/90 flex items-end justify-center">
          <div className="w-full max-w-[430px] max-h-[88vh] bg-vault-surface rounded-t-3xl border-t border-vault-border px-5 pt-5 pb-8 flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="font-semibold text-[17px] text-vault-text">edit categories</div>
              <button
                onClick={closeCategoryManager}
                className="w-8 h-8 bg-vault-surface2 border border-vault-border rounded-full flex items-center justify-center"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6966" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-2">select category</div>
              <div className="flex flex-col gap-1.5 mb-5">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => beginCategoryEdit(c.id)}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl border text-left transition-colors ${
                      editingCategoryId === c.id
                        ? 'border-vault-accent bg-vault-accent-bg'
                        : 'border-vault-border bg-vault-surface2'
                    }`}
                  >
                    <span className="text-sm w-[28px] h-[28px] rounded-lg bg-vault-surface flex items-center justify-center flex-shrink-0">
                      {c.icon ?? '📁'}
                    </span>
                    <span className="text-sm font-medium text-vault-text flex-1">{c.name}</span>
                    <span className="font-mono text-[10px] text-vault-text3">{postCountForCat(c.id)}</span>
                  </button>
                ))}
              </div>

              {editingCategory && (
                <>
                  <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-1.5">name</div>
                  <input
                    className="w-full bg-vault-surface2 border border-vault-border2 rounded-xl px-3 py-3 text-sm text-vault-text font-sans outline-none placeholder:text-vault-text3 mb-4"
                    value={editingCategoryName}
                    onChange={e => setEditingCategoryName(e.target.value)}
                    placeholder="Category name"
                  />

                  <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-2">icon</div>
                  <div className="flex gap-2 flex-wrap mb-5">
                    {EMOJI_SUGGESTIONS.map(emoji => (
                      <button
                        key={`edit-${emoji}`}
                        onClick={() => setEditingCategoryIcon(emoji)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-colors ${
                          editingCategoryIcon === emoji
                            ? 'border-vault-accent bg-vault-accent-bg'
                            : 'border-vault-border bg-vault-surface2'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                    <input
                      className="w-9 h-9 rounded-xl border border-vault-border bg-vault-surface2 text-center text-lg outline-none"
                      placeholder="✏️"
                      value={!EMOJI_SUGGESTIONS.includes(editingCategoryIcon) ? editingCategoryIcon : ''}
                      maxLength={2}
                      onChange={e => { if (e.target.value) setEditingCategoryIcon(e.target.value) }}
                    />
                  </div>

                  <button
                    onClick={handleSaveCategoryEdit}
                    disabled={!editingCategoryName.trim()}
                    className="w-full bg-vault-accent text-white rounded-xl py-3 text-sm font-medium disabled:opacity-40"
                  >
                    save category
                  </button>

                  {editingCategory.id !== 'c-unsorted' ? (
                    <button
                      onClick={handleDeleteCategory}
                      className="w-full mt-2 bg-vault-surface border border-vault-border text-vault-text2 rounded-xl py-3 text-sm font-mono"
                    >
                      delete category
                    </button>
                  ) : (
                    <div className="mt-3 font-mono text-[11px] text-vault-text3 leading-relaxed">
                      unsorted is permanent. posts from deleted categories move here.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => {
          setAddModalCategoryId(activeCategoryId)
          setAddOpen(true)
        }}
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

