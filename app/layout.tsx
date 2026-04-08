import { Instrument_Sans, JetBrains_Mono, Geist } from 'next/font/google'
import type { Viewport } from 'next'
import '../styles/globals.css'
import AppShell from '../components/AppShell'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500']
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
    <html lang="en" className={cn(jetbrainsMono.variable, "font-sans", geist.variable)}>
      <body className="font-sans bg-vault-bg">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
