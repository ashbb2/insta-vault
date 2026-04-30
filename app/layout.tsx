import { Instrument_Sans } from 'next/font/google'
import type { Viewport } from 'next'
import '../styles/globals.css'
import AppShell from '../components/AppShell'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans-ui'
})

export const metadata = {
  title: 'vault.',
  description: 'Your personal content vault'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} font-sans`}>
      <body className="font-sans bg-vault-bg">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
