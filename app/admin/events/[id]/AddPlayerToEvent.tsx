'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Player = {
    id: number
    name: string
    rating: number | null
    email: string | null
}

export default function AddPlayerToEvent({ eventId, players }: { eventId: number; players: Player[] }) {
    const router = useRouter()
    const [selectedId, setSelectedId] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleAdd() {
        if (!selectedId) return

        setLoading(true)
        try {
            const res = await fetch(`/api/events/${eventId}/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: selectedId }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to add player')
            }

            setSelectedId('')
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex gap-2">
            <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccc-green/50 focus:border-ccc-green outline-none bg-white min-w-[250px]"
            >
                <option value="">Select a player to add...</option>
                {players.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.name} {p.rating ? `(${p.rating.toFixed(2)})` : ''}
                    </option>
                ))}
            </select>
            <button
                onClick={handleAdd}
                disabled={!selectedId || loading}
                className="px-4 py-2 bg-ccc-green text-white rounded-lg hover:bg-ccc-green-light disabled:opacity-50 transition-colors"
            >
                {loading ? 'Adding...' : 'Add'}
            </button>
        </div>
    )
}
