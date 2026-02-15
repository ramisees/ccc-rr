import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import MobileNav from './MobileNav'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CCC Round Robin',
  description: 'Catawba Country Club — Pickleball & Tennis Round Robin Events',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <header className="sticky top-0 z-50 bg-ccc-green shadow-md">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white tracking-tight">
              CCC Round Robin
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/events" className="text-white/80 hover:text-white transition-colors">
                Events
              </Link>
            </nav>
            <MobileNav />
          </div>
        </header>

        <main className="min-h-[calc(100vh-8rem)]">
          {children}
        </main>

        <footer className="bg-ccc-green text-white/60 text-center text-sm py-4">
          &copy; 2026 Catawba Country Club
        </footer>
      </body>
    </html>
  )
}
