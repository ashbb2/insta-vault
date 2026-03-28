"use client"
import React, { useState } from 'react'
import SidebarNav from './SidebarNav'
import TopBar from './TopBar'
import AddPostModal from './AddPostModal'
import BottomNav from './BottomNav'
import { PostsProvider } from './PostsProvider'
import PostDetailsDrawer from './PostDetailsDrawer'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  return (
    <PostsProvider>
      <div className="flex w-full">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 border-r border-slate-200 bg-white">
          <div className="p-4">
            <div className="text-lg font-bold">Insta Vault</div>
          </div>
          <div className="h-[calc(100vh-72px)] overflow-auto">
            <SidebarNav />
          </div>
        </aside>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200">
              <div className="p-4 flex items-center justify-between">
                <div className="text-lg font-bold">Insta Vault</div>
                <button className="px-2 py-1" onClick={() => setSidebarOpen(false)}>Close</button>
              </div>
              <div className="h-[calc(100vh-72px)] overflow-auto">
                <SidebarNav />
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 min-h-screen bg-slate-50">
          <header className="border-b border-slate-200 bg-white">
            <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onOpenAdd={() => setAddOpen(true)} />
          </header>
          <section className="p-4 md:p-6">{children}</section>
        </main>
        <PostDetailsDrawer />
        <BottomNav openAdd={() => setAddOpen(true)} />
      </div>

      <AddPostModal open={addOpen} onClose={() => setAddOpen(false)} onImported={() => {}} />
    </PostsProvider>
  )
}
