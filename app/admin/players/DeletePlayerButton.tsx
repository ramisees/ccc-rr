'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeletePlayerButton({ id }: { id: number }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this player? This will remove them from all past records.')) {
            return
        }

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/players/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete')

            router.refresh()
        } catch (error) {
            alert('Error deleting player')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
        >
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    )
}
