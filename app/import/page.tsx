import { Suspense } from 'react'
import ImportPageClient from '../../components/ImportPageClient'

export default function ImportPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto text-sm text-slate-500">Loading import...</div>}>
      <ImportPageClient />
    </Suspense>
  )
}
