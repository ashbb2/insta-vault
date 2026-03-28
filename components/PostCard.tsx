"use client"
import React from 'react'
import type { Post } from '../types/data.d'

import { usePosts } from './PostsProvider'

export default function PostCard({ post }: { post: Post }) {
  const { setSelectedPostId } = usePosts()
  const authorInitial = post.author.replace('@', '').trim().charAt(0).toUpperCase() || 'P'

  return (
    <article
      onClick={() => setSelectedPostId(post.id)}
      className="bg-white rounded-md border border-slate-200 p-4 cursor-pointer hover:border-slate-300 hover:shadow-sm transition"
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
          {authorInitial}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900">{post.author}</div>
              <p className="mt-2 text-sm text-slate-700 line-clamp-2">{post.caption}</p>
              {post.transcript && <p className="mt-2 text-xs text-slate-500 line-clamp-2">{post.transcript}</p>}
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-slate-500">Saved</div>
              <div className="text-sm text-slate-800">{new Date(post.savedAt).toLocaleDateString()}</div>
              {post.editedAt && <div className="mt-1 text-xs text-slate-500">Edited {new Date(post.editedAt).toLocaleDateString()}</div>}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
              {post.categoryId && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">{post.categoryId.replace('c-','')}</span>}
              {post.collectionIds.map((col) => (
                <span key={col} className="text-xs bg-amber-100 px-2 py-0.5 rounded">{col.replace('col-','')}</span>
              ))}
              {post.tags?.map((t) => (
                <span key={t} className="text-xs bg-slate-100 px-2 py-0.5 rounded">{t}</span>
              ))}

              {post.sourceUrl && (
                <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Has source link
                </span>
              )}
          </div>

          {post.notes && <p className="mt-3 text-xs text-slate-600 line-clamp-2">Notes: {post.notes}</p>}
        </div>
      </div>
    </article>
  )
}
