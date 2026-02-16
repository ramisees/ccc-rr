'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RemovePlayerButton({ eventId, playerId }: { eventId: number; playerId: number }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleRemove() {
        if (!confirm('Remove this player from the event?')) return

        setLoading(true)
        try {
            const res = await fetch(`/api/events/${eventId}/registrations/${playerId}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to remove player')

            router.refresh()
        } catch (error) {
            alert('Failed to remove player')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleRemove}
            disabled={loading}
            className="text-red-500 hover:text-red-700 text-xs font-medium ml-2 disabled:opacity-50"
        >
            {loading ? '...' : 'Remove'}
        </button>
    )
}
