'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Match = {
    id: number
    roundNumber: number
    courtNumber: number
    team1Player1: { name: string }
    team1Player2: { name: string } | null
    team2Player1: { name: string }
    team2Player2: { name: string } | null
    team1Score: number | null
    team2Score: number | null
}

function MatchRow({ match }: { match: Match }) {
    const router = useRouter()
    const [t1Score, setT1Score] = useState(match.team1Score?.toString() || '')
    const [t2Score, setT2Score] = useState(match.team2Score?.toString() || '')
    const [saving, setSaving] = useState(false)

    async function handleSave() {
        setSaving(true)
        try {
            const res = await fetch(`/api/matches/${match.id}/score`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    team1Score: t1Score,
                    team2Score: t2Score,
                }),
            })
            if (!res.ok) throw new Error('Failed to save')
            router.refresh()
        } catch (e) {
            alert('Failed to save score')
        } finally {
            setSaving(false)
        }
    }

    return (
        <tr key={match.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                R{match.roundNumber} - C{match.courtNumber}
            </td>
            <td className="px-4 py-3 text-sm text-gray-900">
                <div>{match.team1Player1.name}</div>
                {match.team1Player2 && <div className="text-gray-500">{match.team1Player2.name}</div>}
            </td>
            <td className="px-4 py-3 text-sm text-gray-900">
                <div>{match.team2Player1.name}</div>
                {match.team2Player2 && <div className="text-gray-500">{match.team2Player2.name}</div>}
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={t1Score}
                        onChange={(e) => setT1Score(e.target.value)}
                        className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        placeholder="-"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        value={t2Score}
                        onChange={(e) => setT2Score(e.target.value)}
                        className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        placeholder="-"
                    />
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="ml-2 text-ccc-green hover:text-ccc-green-dark font-medium text-xs disabled:opacity-50"
                    >
                        {saving ? '...' : 'Save'}
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default function MatchList({ matches }: { matches: Match[] }) {
    if (!matches || matches.length === 0) return null

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Matches & Scores</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                            <th className="px-4 py-3">Match</th>
                            <th className="px-4 py-3">Team 1</th>
                            <th className="px-4 py-3">Team 2</th>
                            <th className="px-4 py-3 w-40">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((m) => (
                            <MatchRow key={m.id} match={m} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
