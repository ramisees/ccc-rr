import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AdminHeader from '../../AdminHeader'
import EventActions from './EventActions'
import AddPlayerToEvent from './AddPlayerToEvent'
import RemovePlayerButton from './RemovePlayerButton'
import MatchList from './MatchList'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const eventId = parseInt(id, 10)

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      registrations: {
        include: { player: true },
        orderBy: { registeredAt: 'asc' },
      },
      matches: {
        include: {
          team1Player1: true,
          team1Player2: true,
          team2Player1: true,
          team2Player2: true,
        },
        orderBy: [{ roundNumber: 'asc' }, { courtNumber: 'asc' }],
      },
    },
  })

  // Fetch all players for the add dropdown
  const allPlayers = await prisma.player.findMany({
    orderBy: { name: 'asc' },
    // @ts-ignore
    select: { id: true, name: true, rating: true, email: true },
  })

  if (!event) return notFound()

  const confirmed = event.registrations.filter(r => r.status === 'CONFIRMED')
  const waitlisted = event.registrations.filter(r => r.status === 'WAITLISTED')

  const dateStr = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
            <p className="text-gray-600 mt-1">
              {dateStr} &middot; {event.startTime} &middot; {event.sportType}
            </p>
            <span className="inline-block mt-2 text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              {event.status.replace(/_/g, ' ')}
            </span>
          </div>
          <Link
            href={`/admin/events/${event.id}/edit`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
          >
            Edit Settings
          </Link>
        </div>

        {/* Event Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase font-medium">Registered</p>
            <p className="text-2xl font-bold text-ccc-green mt-1">
              {confirmed.length}/{event.maxPlayers}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase font-medium">Waitlist</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">{waitlisted.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase font-medium">Courts</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">{event.courtCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase font-medium">Matches</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">{event.matches.length}</p>
          </div>
        </div>

        <EventActions event={event} />

        <MatchList matches={event.matches} />

        {/* Roster */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Confirmed Players ({confirmed.length})
            </h2>
            {/* @ts-ignore */}
            <AddPlayerToEvent eventId={event.id} players={allPlayers} />
          </div>

          {confirmed.length === 0 ? (
            <p className="text-gray-400">No players registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {confirmed.map((reg, i) => (
                <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm w-6 text-right">{i + 1}.</span>
                    <span className="text-gray-900 font-medium">{reg.player.name}</span>
                    {/* @ts-ignore */}
                    {reg.player.rating && (
                      <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                        {/* @ts-ignore */}
                        {reg.player.rating.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <RemovePlayerButton eventId={event.id} playerId={reg.player.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Waitlist */}
        {waitlisted.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Waitlist ({waitlisted.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {waitlisted.map((reg, i) => (
                <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm w-6 text-right">{i + 1}.</span>
                    <span className="text-gray-700">{reg.player.name}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <RemovePlayerButton eventId={event.id} playerId={reg.player.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex gap-3 justify-end">
          {event.status === 'SCHEDULE_GENERATED' || event.status === 'COMPLETED' ? (
            <a
              href={`/events/${event.id}/schedule`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-ccc-gold text-white rounded-lg hover:bg-ccc-gold-light transition-colors"
            >
              View Schedule
            </a>
          ) : null}
          <a
            href={`/events/${event.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Public Page
          </a>
        </div>
      </div>
    </div>
  )
}
