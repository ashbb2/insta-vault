import '../styles/globals.css'
import AppShell from '../components/AppShell'

export const metadata = {
  title: 'Insta Vault',
  description: 'Save and organize Instagram posts'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
