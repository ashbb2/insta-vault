"use client"
import React from 'react'
import type { Post } from '../types/data.d'
import { usePosts } from './PostsProvider'

export default function PostCard({ post }: { post: Post }) {
  const { setSelectedPostId, categories } = usePosts()
  const category = categories.find(c => c.id === post.categoryId)
  const authorInitial = post.author.replace('@', '').trim().charAt(0).toUpperCase() || 'P'

  return (
    <article
      onClick={() => setSelectedPostId(post.id)}
      className="flex items-center gap-3 px-[14px] py-3 bg-vault-surface border border-vault-border rounded-xl cursor-pointer hover:border-vault-accent-border transition-colors"
    >
      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-[10px] bg-vault-surface2 border border-vault-border flex items-center justify-center flex-shrink-0 overflow-hidden">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt=""
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <span className="text-sm font-semibold text-vault-text2">{authorInitial}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-vault-text truncate mb-1">
          {post.caption || post.author}
        </div>
        {(post.tags && post.tags.length > 0) && (
          <div className="flex gap-1 flex-wrap">
            {post.tags.slice(0, 3).map(t => (
              <span
                key={t}
                className="font-mono text-[10px] px-[7px] py-[2px] rounded-full bg-vault-accent-bg text-vault-accent border border-vault-accent-border"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {(!post.tags || post.tags.length === 0) && post.author && (
          <div className="font-mono text-[11px] text-vault-text3">{post.author}</div>
        )}
      </div>

      {/* Chevron */}
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#AEACA7" strokeWidth="2" className="flex-shrink-0">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </article>
  )
}

