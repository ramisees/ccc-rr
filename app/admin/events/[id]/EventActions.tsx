'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Event {
  id: number
  status: string
}

export default function EventActions({ event }: { event: Event }) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleCloseRegistration() {
    if (!confirm('Close registration for this event?')) return

    setProcessing(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch(`/api/events/${event.id}/close-registration`, {
        method: 'POST',
      })

      if (!res.ok) throw new Error('Failed to close registration')

      setMessage('Registration closed successfully')
      router.refresh()
    } catch {
      setError('Failed to close registration')
    } finally {
      setProcessing(false)
    }
  }

  async function handleGenerateSchedule() {
    if (!confirm('Generate schedule for this event? This will create all match pairings.')) return

    setProcessing(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch(`/api/events/${event.id}/generate-schedule`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to generate schedule')

      setMessage(`Schedule generated! ${data.matchCount} matches created.`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate schedule')
    } finally {
      setProcessing(false)
    }
  }

  async function handleDeleteEvent() {
    if (!confirm('Delete this event? This cannot be undone!')) return
    if (!confirm('Are you absolutely sure? All registrations and matches will be deleted.')) return

    setProcessing(true)

    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete event')

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Failed to delete event')
      setProcessing(false)
    }
  }

  return (
    <div className="mb-8">
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {event.status === 'REGISTRATION_OPEN' && (
          <button
            onClick={handleCloseRegistration}
            disabled={processing}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Close Registration
          </button>
        )}

        {(event.status === 'REGISTRATION_CLOSED' || event.status === 'REGISTRATION_OPEN' || event.status === 'SCHEDULE_GENERATED') && (
          <button
            onClick={handleGenerateSchedule}
            disabled={processing}
            className="px-4 py-2 bg-ccc-green text-white rounded-lg hover:bg-ccc-green-light disabled:opacity-50 transition-colors"
          >
            {event.status === 'SCHEDULE_GENERATED' ? 'Regenerate Schedule' : 'Generate Schedule'}
          </button>
        )}

        <button
          onClick={handleDeleteEvent}
          disabled={processing}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors ml-auto"
        >
          Delete Event
        </button>
      </div>
    </div>
  )
}
