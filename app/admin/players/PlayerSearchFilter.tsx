'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export default function PlayerSearchFilter() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        replace(params)
    }

    function handleFilter(key: string, value: string) {
        const params = new URLSearchParams(searchParams)
        if (value && value !== 'ALL') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        replace(params)
    }

    function replace(params: URLSearchParams) {
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            <div className="flex-1">
                <label htmlFor="search" className="sr-only">Search</label>
                <input
                    id="search"
                    type="search"
                    placeholder="Search by name or email..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-ccc-green focus:border-ccc-green"
                    defaultValue={searchParams.get('q')?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <div className="flex gap-4">
                <select
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-ccc-green focus:border-ccc-green"
                    defaultValue={searchParams.get('sport')?.toString() || 'ALL'}
                    onChange={(e) => handleFilter('sport', e.target.value)}
                >
                    <option value="ALL">All Sports</option>
                    <option value="PICKLEBALL">Pickleball</option>
                    <option value="TENNIS">Tennis</option>
                    <option value="BOTH">Both</option>
                </select>

                <select
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-ccc-green focus:border-ccc-green"
                    defaultValue={searchParams.get('gender')?.toString() || 'ALL'}
                    onChange={(e) => handleFilter('gender', e.target.value)}
                >
                    <option value="ALL">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>

                <select
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-ccc-green focus:border-ccc-green"
                    defaultValue={searchParams.get('sort')?.toString() || 'name'}
                    onChange={(e) => handleFilter('sort', e.target.value)}
                >
                    <option value="name">Name (A-Z)</option>
                    <option value="rating_desc">Rating (High-Low)</option>
                    <option value="date_desc">Date Added (Newest)</option>
                </select>
            </div>
        </div>
    )
}
