"use client"
import { useMemo, useState } from 'react'
import { usePosts } from '../components/PostsProvider'
import PostCard from '../components/PostCard'
import { CATEGORY_COLOR_TAGS, COLOR_NAMES, DEFAULT_CATEGORY_COLOR } from '../lib/categoryColors'

const COLOR_TAGS = CATEGORY_COLOR_TAGS
type CategorySortOption = 'a-z' | 'z-a' | 'most-posts' | 'least-posts'
const DEFAULT_CATEGORY_SORT: CategorySortOption = 'a-z'
const ALL_COLORS_FILTER = 'all'

const CATEGORY_SORT_OPTIONS: Array<{ value: CategorySortOption; label: string }> = [
  { value: 'a-z', label: 'A → Z' },
  { value: 'z-a', label: 'Z → A' },
  { value: 'most-posts', label: 'Most posts' },
  { value: 'least-posts', label: 'Least posts' }
]

export default function Page() {
  const {
    posts, filteredPosts,
    activeCategoryId, setActiveCategory,
    categories, searchText, setSearchText,
    setSelectedPostId,
    addCategoryOpen, setAddCategoryOpen, addCategory, updateCategory, deleteCategory
  } = usePosts()

  const [catDropOpen, setCatDropOpen] = useState(false)
  const [manageCatOpen, setManageCatOpen] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatColor, setNewCatColor] = useState(COLOR_TAGS[0] ?? DEFAULT_CATEGORY_COLOR)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [editingCategoryColor, setEditingCategoryColor] = useState(COLOR_TAGS[0] ?? DEFAULT_CATEGORY_COLOR)
  const [categorySort, setCategorySort] = useState<CategorySortOption>(DEFAULT_CATEGORY_SORT)
  const [categoryColorFilter, setCategoryColorFilter] = useState<string>(ALL_COLORS_FILTER)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const recentPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => +new Date(b.savedAt) - +new Date(a.savedAt))
      .slice(0, 10)
  }, [posts])

  const categoryColorOptions = useMemo(() => {
    const colors = new Set<string>()
    for (const c of categories) {
      colors.add(c.color ?? DEFAULT_CATEGORY_COLOR)
    }
    return Array.from(colors).sort((a, b) => a.localeCompare(b))
  }, [categories])

  const postCountByCategory = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of posts) {
      counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1)
    }
    return counts
  }, [posts])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (categorySort !== DEFAULT_CATEGORY_SORT) count += 1
    if (categoryColorFilter !== ALL_COLORS_FILTER) count += 1
    return count
  }, [categorySort, categoryColorFilter])

  const displayedCategories = useMemo(() => {
    const filtered = categories.filter(c => {
      if (categoryColorFilter === ALL_COLORS_FILTER) return true
      return (c.color ?? DEFAULT_CATEGORY_COLOR) === categoryColorFilter
    })

    const withCounts = filtered.map(c => ({
      category: c,
      count: postCountByCategory.get(c.id) ?? 0
    }))

    withCounts.sort((a, b) => {
      if (categorySort === 'a-z') return a.category.name.localeCompare(b.category.name)
      if (categorySort === 'z-a') return b.category.name.localeCompare(a.category.name)
      if (categorySort === 'most-posts') return b.count - a.count
      return a.count - b.count
    })

    return withCounts.map(x => x.category)
  }, [categories, postCountByCategory, categoryColorFilter, categorySort])

  function postCountForCat(catId: string) {
    if (!searchText) return postCountByCategory.get(catId) ?? 0
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
    const cat = addCategory(name, newCatColor)
    setNewCatName('')
    setNewCatColor(COLOR_TAGS[0] ?? DEFAULT_CATEGORY_COLOR)
    setAddCategoryOpen(false)
    setActiveCategory(cat.id)
  }

  function beginCategoryEdit(categoryId: string) {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
    setEditingCategoryColor(category.color ?? DEFAULT_CATEGORY_COLOR)
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
    setEditingCategoryColor(COLOR_TAGS[0] ?? DEFAULT_CATEGORY_COLOR)
  }

  function handleSaveCategoryEdit() {
    const name = editingCategoryName.trim()
    if (!editingCategoryId || !name) return
    updateCategory(editingCategoryId, { name, color: editingCategoryColor })
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
                <span
                  className="w-[22px] h-[22px] rounded-full border border-white/70 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: activeCategory?.color ?? DEFAULT_CATEGORY_COLOR }}
                >
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
                      <span
                        className="w-[22px] h-[22px] rounded-full border border-white/70 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: c.color ?? DEFAULT_CATEGORY_COLOR }}
                      >
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
          <div className="space-y-4">
            {/* Recent posts strip */}
            <div>
              <div className="text-[12px] text-vault-text3 px-1 mb-2">recently added</div>
              {recentPosts.length === 0 ? (
                <div className="text-center font-mono text-xs text-vault-text3 py-5 bg-vault-surface border border-vault-border rounded-xl">
                  no recent posts yet
                </div>
              ) : (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {recentPosts.map(p => {
                    const cat = categories.find(c => c.id === p.categoryId)
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPostId(p.id)}
                        className="min-w-[132px] max-w-[132px] bg-vault-surface border border-vault-border rounded-xl p-2 text-left hover:border-vault-accent-border transition-colors"
                      >
                        <div className="w-full h-[84px] rounded-lg overflow-hidden bg-vault-surface2 border border-vault-border mb-2 flex items-center justify-center">
                          {p.thumbnail ? (
                            <img src={p.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span
                              className="w-[18px] h-[18px] rounded-full border border-white/80 inline-block"
                              style={{ backgroundColor: cat?.color ?? DEFAULT_CATEGORY_COLOR }}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="w-[10px] h-[10px] rounded-full border border-white/70 flex-shrink-0"
                            style={{ backgroundColor: cat?.color ?? DEFAULT_CATEGORY_COLOR }}
                          />
                          <span className="font-mono text-[10px] text-vault-text3 truncate">{cat?.name ?? 'unsorted'}</span>
                        </div>
                        <div className="text-[11px] text-vault-text2 line-clamp-2">{p.caption || 'untitled post'}</div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Category controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="text-[12px] text-vault-text3">categories</div>
                <button
                  type="button"
                  aria-expanded={filtersOpen}
                  aria-controls="category-filters-panel"
                  onClick={() => setFiltersOpen(v => !v)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono border inline-flex items-center gap-1.5 transition-colors ${filtersOpen ? 'bg-vault-accent-bg border-vault-accent-border text-vault-accent' : 'bg-vault-surface border-vault-border text-vault-text2'}`}
                >
                  filters
                  {activeFiltersCount > 0 && (
                    <span
                      aria-label={`${activeFiltersCount} active`}
                      className="h-4 min-w-4 px-1 rounded-full bg-vault-accent text-white text-[9px] inline-flex items-center justify-center"
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                  <svg
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
              </div>

              <div
                id="category-filters-panel"
                role="region"
                aria-label="Category filters"
                className={`grid transition-all duration-200 ease-in-out ${filtersOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 bg-vault-surface border border-vault-border rounded-xl p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="flex flex-col gap-1">
                        <span className="font-mono text-[10px] uppercase tracking-[0.4px] text-vault-text3">sort</span>
                        <select
                          value={categorySort}
                          onChange={e => setCategorySort(e.target.value as CategorySortOption)}
                          className="w-full bg-vault-surface2 border border-vault-border rounded-lg px-2.5 py-2 text-[12px] text-vault-text outline-none"
                        >
                          {CATEGORY_SORT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </label>

                      <label className="flex flex-col gap-1">
                        <span className="font-mono text-[10px] uppercase tracking-[0.4px] text-vault-text3">color</span>
                        <select
                          value={categoryColorFilter}
                          onChange={e => setCategoryColorFilter(e.target.value)}
                          className="w-full bg-vault-surface2 border border-vault-border rounded-lg px-2.5 py-2 text-[12px] text-vault-text outline-none"
                        >
                          <option value={ALL_COLORS_FILTER}>All colors</option>
                          {categoryColorOptions.map(color => (
                            <option key={`filter-${color}`} value={color}>{COLOR_NAMES[color] ?? color}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="font-mono text-[10px] text-vault-text3">
                        {activeFiltersCount === 0 ? 'no active filters' : `${activeFiltersCount} active`}
                      </div>
                      <button
                        type="button"
                        aria-label="Reset all filters"
                        disabled={activeFiltersCount === 0}
                        onClick={() => {
                          setCategorySort(DEFAULT_CATEGORY_SORT)
                          setCategoryColorFilter(ALL_COLORS_FILTER)
                        }}
                        className="px-2.5 py-1 rounded-full text-[11px] font-mono border bg-vault-surface2 border-vault-border text-vault-text2 disabled:opacity-40 transition-opacity"
                      >
                        reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category list */}
            {displayedCategories.length === 0 ? (
              <div className="text-center font-mono text-sm text-vault-text3 py-8">no categories in this color</div>
            ) : (
              <div className="flex flex-wrap gap-2 items-start">
                {displayedCategories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className="bg-vault-surface border border-vault-border rounded-full pl-2 pr-2.5 py-1.5 inline-flex items-center gap-2 text-left hover:border-vault-accent-border transition-colors cursor-pointer"
                  >
                    <span
                      className="w-[18px] h-[18px] rounded-full border border-white/70 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: c.color ?? DEFAULT_CATEGORY_COLOR }}
                    >
                    </span>
                    <span className="font-medium text-[12px] text-vault-text whitespace-nowrap">{c.name}</span>
                    <span className="h-[20px] px-1.5 rounded-full border border-vault-border bg-vault-surface2 font-mono text-[10px] text-vault-text2 inline-flex items-center justify-center flex-shrink-0">
                      {postCountForCat(c.id)}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#AEACA7" strokeWidth="2" className="flex-shrink-0">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {addCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-vault-bg/90 flex items-end justify-center">
          <div className="w-full max-w-[430px] bg-vault-surface rounded-t-3xl border-t border-vault-border px-5 pt-5 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-[17px] text-vault-text">new category</div>
              <button
                onClick={() => {
                  setAddCategoryOpen(false)
                  setNewCatName('')
                  setNewCatColor(COLOR_TAGS[0] ?? DEFAULT_CATEGORY_COLOR)
                }}
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

            {/* Color tag picker */}
            <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-2">color tag</div>
            <div className="flex gap-2 flex-wrap mb-5">
              {COLOR_TAGS.map(color => (
                <button
                  key={color}
                  onClick={() => setNewCatColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    newCatColor === color
                      ? 'border-vault-accent bg-vault-accent-bg'
                      : 'border-vault-border'
                  }`}
                  style={{ backgroundColor: color }}
                >
                </button>
              ))}
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
                    <span
                      className="w-[20px] h-[20px] rounded-full border border-white/70 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: c.color ?? DEFAULT_CATEGORY_COLOR }}
                    >
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

                  <div className="font-mono text-[11px] text-vault-text3 uppercase tracking-[0.4px] mb-2">color tag</div>
                  <div className="flex gap-2 flex-wrap mb-5">
                    {COLOR_TAGS.map(color => (
                      <button
                        key={`edit-${color}`}
                        onClick={() => setEditingCategoryColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          editingCategoryColor === color
                            ? 'border-vault-accent bg-vault-accent-bg'
                            : 'border-vault-border'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                      </button>
                    ))}
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

    </div>
  )
}

