"use client"
import React from 'react'
import { usePosts } from '../components/PostsProvider'
import PostCard from '../components/PostCard'

export default function Page() {
  const { filteredPosts, activeCategoryId, activeCollectionId } = usePosts()

  const title = activeCategoryId
    ? `Category: ${activeCategoryId.replace('c-','')}`
    : activeCollectionId
    ? `Collection: ${activeCollectionId.replace('col-','')}`
    : 'All Posts'

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="mt-8 text-center text-slate-500">
          No posts found matching your filters.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredPosts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  )
}

