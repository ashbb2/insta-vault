"use client"
import React from 'react'
import AddPostModal from './AddPostModal'
import BottomNav from './BottomNav'
import { PostsProvider, usePosts } from './PostsProvider'
import PostDetailsDrawer from './PostDetailsDrawer'

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { addOpen, setAddOpen } = usePosts()

  return (
    <div className="flex flex-col h-full bg-vault-bg max-w-[430px] mx-auto relative overflow-hidden">
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {children}
      </main>
      <BottomNav />
      <PostDetailsDrawer />
      <AddPostModal open={addOpen} onClose={() => setAddOpen(false)} onImported={() => {}} />
    </div>
  )
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PostsProvider>
      <AppShellInner>{children}</AppShellInner>
    </PostsProvider>
  )
}
