import { Sora, JetBrains_Mono } from 'next/font/google'
import '../styles/globals.css'
import AppShell from '../components/AppShell'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '500', '600']
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500']
})

export const metadata = {
  title: 'vault.',
  description: 'Your personal content vault'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-vault-bg">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
