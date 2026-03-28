"use client"
import React from 'react'
import type { Post } from '../types/data.d'
import { usePosts } from './PostsProvider'

export default function PostCard({ post }: { post: Post }) {
  const { setSelectedPostId, categories } = usePosts()
  const category = categories.find(c => c.id === post.categoryId)

  return (
    <article
      onClick={() => setSelectedPostId(post.id)}
      className="flex items-center gap-3 px-[14px] py-3 bg-vault-surface border border-vault-border rounded-xl cursor-pointer hover:border-vault-accent-border transition-colors"
    >
      {/* Thumbnail */}
      <div className="w-[54px] h-[54px] rounded-xl bg-vault-surface2 border border-vault-border flex items-center justify-center flex-shrink-0 overflow-hidden">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt=""
            className="w-full h-full object-cover"
            onError={e => {
              const el = e.target as HTMLImageElement
              el.style.display = 'none'
              const parent = el.parentElement
              if (parent) {
                parent.innerHTML = `<span style="font-size:22px;line-height:1">${category?.icon ?? '📎'}</span>`
              }
            }}
          />
        ) : (
          <span className="text-[22px] leading-none">{category?.icon ?? '📎'}</span>
        )}
      </div>

      {/* Tags */}
      <div className="flex-1 min-w-0">
        {post.tags && post.tags.length > 0 ? (
          <div className="flex gap-1 flex-wrap">
            {post.tags.slice(0, 4).map(t => (
              <span
                key={t}
                className="text-[11px] px-[8px] py-[3px] rounded-full bg-vault-accent-bg text-vault-accent border border-vault-accent-border"
              >
                {t}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[13px] text-vault-text3 italic">no tags</span>
        )}
      </div>

      {/* Chevron */}
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#AEACA7" strokeWidth="2" className="flex-shrink-0">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </article>
  )
}

