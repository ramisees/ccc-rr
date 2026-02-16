'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'

export default function ImportPlayersButton() {
    const router = useRouter()
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/players/import', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Import failed')
            }

            alert(`Import complete! Imported/Updated: ${data.count} players. Errors: ${data.errors}`)
            router.refresh()
        } catch (error: any) {
            alert(`Error: ${error.message}`)
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <div className="relative">
            <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
                {isUploading ? 'Importing...' : 'Import CSV'}
            </button>
        </div>
    )
}
