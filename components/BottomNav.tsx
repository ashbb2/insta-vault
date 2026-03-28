"use client"
import React from 'react'
import { usePosts } from './PostsProvider'

export default function BottomNav({ openAdd }: { openAdd?: () => void }) {
  const { setActiveCategory, setActiveCollection, activeCategoryId, activeCollectionId } = usePosts()

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-slate-200 flex justify-between items-center py-2 px-4">
      <div className="flex gap-4">
        <button
          onClick={() => { setActiveCategory(null); setActiveCollection(null) }}
          className={`flex flex-col items-center text-xs ${!activeCategoryId && !activeCollectionId ? 'text-slate-900' : 'text-slate-600'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18"/></svg>
          All
        </button>

        <button
          onClick={() => { setActiveCategory('c-unsorted'); setActiveCollection(null) }}
          className={`flex flex-col items-center text-xs ${activeCategoryId === 'c-unsorted' ? 'text-slate-900' : 'text-slate-600'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z"/></svg>
          Cats
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => openAdd && openAdd()}
          className="flex flex-col items-center text-xs text-slate-900">
          <svg className="w-8 h-8 mb-1 rounded-full bg-slate-900 text-white p-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Add
        </button>

        <button
          onClick={() => { /* profile nav placeholder */ }}
          className={`flex flex-col items-center text-xs ${false ? 'text-slate-900' : 'text-slate-600'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20v-1c0-2.21 3.58-4 6-4s6 1.79 6 4v1"/></svg>
          Profile
        </button>
      </div>
    </nav>
  )
}
