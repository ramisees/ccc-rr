'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type EventData = {
    id?: number
    name: string
    sportType: string
    eventDate: string
    startTime: string
    registrationDeadline: string
    courtCount: number
    maxPlayers: number
    status?: string
}

export default function EventForm({ initialData }: { initialData?: EventData }) {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Helper to format date for input (YYYY-MM-DD)
    const formatDate = (date: string | Date) => {
        if (!date) return ''
        const d = new Date(date)
        return d.toISOString().split('T')[0]
    }

    // Helper to format datetime for input (YYYY-MM-DDTHH:mm)
    const formatDateTime = (date: string | Date) => {
        if (!date) return ''
        const d = new Date(date)
        return d.toISOString().slice(0, 16)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSubmitting(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name'),
            sportType: formData.get('sportType'),
            eventDate: formData.get('eventDate'), // Date string
            registrationDeadline: new Date(formData.get('registrationDeadline') as string).toISOString(),
            startTime: formData.get('startTime'),
            courtCount: parseInt(formData.get('courtCount') as string),
            maxPlayers: parseInt(formData.get('maxPlayers') as string),
        }

        try {
            const url = initialData?.id ? `/api/events/${initialData.id}` : '/api/events'
            const method = initialData?.id ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                throw new Error('Failed to save event')
            }

            const event = await res.json()
            router.push(`/admin/events/${event.id}`)
            router.refresh()
        } catch {
            setError('Failed to save event. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                <input
                    type="text"
                    name="name"
                    required
                    defaultValue={initialData?.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccc-green/50 focus:border-ccc-green outline-none"
                    placeholder="e.g. Thursday Morning Pickleball"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sport Type *</label>
                <select
                    name="sportType"
                    required
                    defaultValue={initialData?.sportType || 'PICKLEBALL'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccc-green/50 focus:border-ccc-green outline-none bg-white"
                >
                    <option value="PICKLEBALL">Pickleball</option>
                    <option value="TENNIS">Tennis</option>
                </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                    <input
                        type="date"
                        name="eventDate"
                        required
                        defaultValue={initialData?.eventDate ? formatDate(initialData.eventDate) : ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccc-green/50 focus:border-ccc-green outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                    <input
                        type="text"
                        name="startTime"
                        required
                        defaultValue={initialData?.startTime}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccc-green/50 focus:border-ccc-green outline-none"
                        placeholder="e.g. 9:00 AM"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Deadline *
                </label>
                <input
                    type="datetime-local"
                    name="registrationDeadline"
                    required
                    defaultValue={initialData?.registrationDeadline ? formatDateTime(initialData.registrationDeadline) : ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccc-green/50 focus:border-ccc-green outline-none"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Court Count *</label>
                    <input
                        type="number"
                        name="courtCount"
                        required
                        min="1"
                        max="6"
                        defaultValue={initialData?.courtCount || 2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccc-green/50 focus:border-ccc-green outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Players *</label>
                    <input
                        type="number"
                        name="maxPlayers"
                        required
                        min="4"
                        max="40"
                        defaultValue={initialData?.maxPlayers || 16}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccc-green/50 focus:border-ccc-green outline-none"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-ccc-green text-white font-semibold py-3 rounded-lg hover:bg-ccc-green-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {submitting ? 'Saving...' : (initialData ? 'Update Event' : 'Create Event')}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
