"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Post, Category, Collection } from '../types/data.d'
import { posts as mockPosts, categories as mockCategories, collections as mockCollections } from './data/mockData'
import { localRepo } from '../lib/repos/localStorageRepo'

type SortOption = 'newest' | 'oldest' | 'recently-edited'

type PostsContextValue = {
  posts: Post[]
  categories: Category[]
  collections: Collection[]
  activeCategoryId: string | null
  activeCollectionId: string | null
  setActiveCategory: (id: string | null) => void
  setActiveCollection: (id: string | null) => void
  filteredPosts: Post[]
  addPost: (p: Post) => void
  selectedPostId: string | null
  setSelectedPostId: (id: string | null) => void
  updatePost: (post: Post) => void
  deletePost: (id: string) => void
  searchText: string
  setSearchText: (s: string) => void
  sortOption: SortOption
  setSortOption: (s: SortOption) => void
  addCategory: (name: string) => Category
  renameCategory: (id: string, name: string) => void
  deleteCategory: (id: string, reassignToId?: string) => boolean
  addCollection: (name: string, description?: string) => Collection
  updateCollection: (id: string, updates: Partial<Collection>) => void
  deleteCollection: (id: string, reassignToId?: string) => boolean
  addOpen: boolean
  setAddOpen: (v: boolean) => void
}

const PostsContext = createContext<PostsContextValue | undefined>(undefined)

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [searchText, setSearchText] = useState<string>('')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [isHydrated, setIsHydrated] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const [posts, setPosts] = useState<Post[]>(() => mockPosts)
  const [categories, setCategories] = useState<Category[]>(() => mockCategories)
  const [collections, setCollections] = useState<Collection[]>(() => mockCollections)

  const cloudSyncEnabled = process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC === '1'

  // Merge loaded categories with default icons so stored data keeps icon info
  function enrichCategories(loaded: Category[]): Category[] {
    return loaded.map(cat => ({
      ...cat,
      icon: cat.icon ?? mockCategories.find(m => m.id === cat.id)?.icon
    }))
  }

  // Hydrate from cloud state first when enabled, then fall back to local storage.
  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      try {
        if (cloudSyncEnabled) {
          const response = await fetch('/api/state', { cache: 'no-store' })
          if (response.ok) {
            const json = await response.json()
            const state = json?.state
            if (state?.posts && state?.categories && state?.collections && !cancelled) {
              setPosts(state.posts)
              setCategories(enrichCategories(state.categories))
              setCollections(state.collections)
              return
            }
          }
        }

        const saved = localRepo.loadAll()
        if (saved && !cancelled) {
          setPosts(saved.posts)
          setCategories(enrichCategories(saved.categories))
          setCollections(saved.collections)
        }
      } catch (e) {
        const saved = localRepo.loadAll()
        if (saved && !cancelled) {
          setPosts(saved.posts)
          setCategories(enrichCategories(saved.categories))
          setCollections(saved.collections)
        }
      } finally {
        if (!cancelled) setIsHydrated(true)
      }
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [cloudSyncEnabled])

  // Persist changes after hydration. Cloud sync falls back to local storage if unavailable.
  useEffect(() => {
    if (!isHydrated) return

    const timer = window.setTimeout(async () => {
      try {
        if (cloudSyncEnabled) {
          const response = await fetch('/api/state', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ posts, categories, collections })
          })
          if (response.ok) return
        }

        localRepo.saveAll({ posts, categories, collections })
      } catch (e) {
        localRepo.saveAll({ posts, categories, collections })
      }
    }, 450)

    return () => {
      window.clearTimeout(timer)
    }
  }, [posts, categories, collections, isHydrated, cloudSyncEnabled])

  const filteredPosts = useMemo(() => {
    const text = searchText.trim().toLowerCase()
    const categoryNameById = new Map(categories.map((category) => [category.id, category.name.toLowerCase()]))
    const collectionNameById = new Map(collections.map((collection) => [collection.id, collection.name.toLowerCase()]))

    let res = posts.filter((p) => {
      if (activeCategoryId && p.categoryId !== activeCategoryId) return false
      if (activeCollectionId && !p.collectionIds.includes(activeCollectionId)) return false
      if (!text) return true

      const categoryName = categoryNameById.get(p.categoryId) ?? ''
      const collectionNames = p.collectionIds.map((id) => collectionNameById.get(id) ?? '').join(' ')
      const tags = (p.tags ?? []).join(' ')
      const haystack = [
        p.author,
        p.caption,
        p.transcript ?? '',
        p.notes ?? '',
        tags,
        categoryName,
        collectionNames,
        p.savedAt,
        p.editedAt ?? ''
      ].join(' ').toLowerCase()
      return haystack.includes(text)
    })

    if (sortOption === 'newest') {
      res = res.sort((a, b) => +new Date(b.savedAt) - +new Date(a.savedAt))
    } else if (sortOption === 'oldest') {
      res = res.sort((a, b) => +new Date(a.savedAt) - +new Date(b.savedAt))
    } else if (sortOption === 'recently-edited') {
      res = res.sort((a, b) => {
        const ta = a.editedAt ? +new Date(a.editedAt) : 0
        const tb = b.editedAt ? +new Date(b.editedAt) : 0
        return tb - ta
      })
    }

    return res
  }, [posts, categories, collections, activeCategoryId, activeCollectionId, searchText, sortOption])

  function updatePost(post: Post) {
    setPosts((s) => s.map((p) => (p.id === post.id ? post : p)))
  }

  function addCategory(name: string) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
    let id = `c-${slug}`
    if (categories.some((c) => c.id === id)) id = `c-${Date.now()}`
    const cat: Category = { id, name }
    setCategories((s) => [...s, cat])
    return cat
  }

  function renameCategory(id: string, name: string) {
    setCategories((s) => s.map((c) => (c.id === id ? { ...c, name } : c)))
  }

  function deleteCategory(id: string, reassignToId?: string) {
    if (id === 'c-unsorted') return false
    const inUse = posts.some((p) => p.categoryId === id)
    if (inUse && !reassignToId) return false
    setPosts((s) => s.map((p) => (p.categoryId === id ? { ...p, categoryId: reassignToId ?? 'c-unsorted' } : p)))
    setCategories((s) => s.filter((c) => c.id !== id))
    return true
  }

  function deletePost(id: string) {
    setPosts((s) => s.filter((p) => p.id !== id))
    if (selectedPostId === id) setSelectedPostId(null)
  }

  function addCollection(name: string, description?: string) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
    let id = `col-${slug}`
    if (collections.some((c) => c.id === id)) id = `col-${Date.now()}`
    const col: Collection = { id, name, description }
    setCollections((s) => [...s, col])
    return col
  }

  function updateCollection(id: string, updates: Partial<Collection>) {
    setCollections((s) => s.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  function deleteCollection(id: string, reassignToId?: string) {
    const inUse = posts.some((p) => p.collectionIds.includes(id))
    if (inUse && !reassignToId) return false
    setPosts((s) => s.map((p) => {
      if (!p.collectionIds.includes(id)) return p
      const next = p.collectionIds.filter((x) => x !== id)
      if (reassignToId && !next.includes(reassignToId)) next.push(reassignToId)
      return { ...p, collectionIds: next }
    }))
    setCollections((s) => s.filter((c) => c.id !== id))
    return true
  }

  const value: PostsContextValue = {
    posts,
    categories,
    collections,
    activeCategoryId,
    activeCollectionId,
    setActiveCategory: setActiveCategoryId,
    setActiveCollection: setActiveCollectionId,
    filteredPosts,
    addPost: (p: Post) => setPosts((s) => [p, ...s]),
    selectedPostId,
    setSelectedPostId,
    updatePost,
    deletePost,
    addCategory,
    renameCategory,
    deleteCategory,
    addCollection,
    updateCollection,
    deleteCollection,
    searchText,
    setSearchText,
    sortOption,
    setSortOption,
    addOpen,
    setAddOpen
  }

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
}

export function usePosts() {
  const ctx = useContext(PostsContext)
  if (!ctx) throw new Error('usePosts must be used within PostsProvider')
  return ctx
}
