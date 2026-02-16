'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-white p-2"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-ccc-green border-t border-white/10 shadow-lg">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 text-white/80 hover:text-white hover:bg-white/10"
          >
            Home
          </Link>
          <Link
            href="/events?sport=PICKLEBALL"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 text-white/80 hover:text-white hover:bg-white/10"
          >
            Pickleball
          </Link>
          <Link
            href="/events?sport=TENNIS"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 text-white/80 hover:text-white hover:bg-white/10"
          >
            Tennis
          </Link>
        </div>
      )}
    </div>
  )
}
