"use client"
import { usePosts } from './PostsProvider'

export default function SidebarNav() {
  const { categories, collections, posts, activeCategoryId, activeCollectionId, setActiveCategory, setActiveCollection } = usePosts()

  function countByCategory(id: string) {
    return posts.filter((p) => p.categoryId === id).length
  }

  function countByCollection(id: string) {
    return posts.filter((p) => p.collectionIds.includes(id)).length
  }

  return (
    <nav className="px-3 py-4">
      <div className="mb-6">
        <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Main</h3>
        <ul className="mt-2 space-y-1">
          <li
            onClick={() => {
              setActiveCategory(null)
              setActiveCollection(null)
            }}
            className={`px-2 py-2 rounded hover:bg-slate-50 cursor-pointer ${!activeCategoryId && !activeCollectionId ? 'bg-slate-100' : ''}`}>
            All Posts
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Categories</h3>
        <ul className="mt-2 space-y-1">
          {categories.map((c) => (
            <li
              key={c.id}
              onClick={() => {
                setActiveCategory(c.id)
                setActiveCollection(null)
              }}
              className={`flex justify-between items-center px-2 py-2 rounded hover:bg-slate-50 cursor-pointer ${activeCategoryId === c.id ? 'bg-slate-100' : ''}`}>
              <span>{c.name}</span>
              <span className="text-xs text-slate-500">{countByCategory(c.id)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Collections</h3>
        <ul className="mt-2 space-y-1">
          {collections.map((col) => (
            <li
              key={col.id}
              onClick={() => {
                setActiveCollection(col.id)
                setActiveCategory(null)
              }}
              className={`flex justify-between items-center px-2 py-2 rounded hover:bg-slate-50 cursor-pointer ${activeCollectionId === col.id ? 'bg-slate-100' : ''}`}>
              <span>{col.name}</span>
              <span className="text-xs text-slate-500">{countByCollection(col.id)}</span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
