'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminHeader() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="bg-ccc-green shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-xl font-bold text-white">
            CCC Admin
          </Link>
          <Link
            href="/admin"
            className="text-white/80 hover:text-white transition-colors text-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            className="text-white/80 hover:text-white transition-colors text-sm"
          >
            Public Site
          </Link>
          <Link
            href="/admin/players"
            className="text-white/80 hover:text-white transition-colors text-sm"
          >
            Players
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-white/80 hover:text-white transition-colors text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
