import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import RegistrationForm from './RegistrationForm'

interface Reg {
  id: number
  status: string
  player: { name: string }
}

export const dynamic = 'force-dynamic'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      registrations: {
        include: { player: true },
        orderBy: { registeredAt: 'asc' },
      },
    },
  })

  if (!event) return notFound()

  const confirmed = event.registrations.filter((r: Reg) => r.status === 'CONFIRMED')
  const waitlisted = event.registrations.filter((r: Reg) => r.status === 'WAITLISTED')
  const spotsLeft = event.maxPlayers - confirmed.length
  const isFull = spotsLeft <= 0
  const isOpen = event.status === 'REGISTRATION_OPEN'

  const dateStr = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const sportColor = event.sportType === 'PICKLEBALL' ? 'bg-ccc-green' : 'bg-ccc-gold'
  const sportEmoji = event.sportType === 'PICKLEBALL' ? '\u{1F3D3}' : '\u{1F3BE}'

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Event header */}
      <div className="mb-8">
        <span className={`${sportColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
          {event.sportType}
        </span>
        <h1 className="text-3xl font-bold text-ccc-green mt-3">
          {sportEmoji} {event.name}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 bg-white rounded-xl border border-gray-200 p-5">
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Date</p>
            <p className="font-semibold text-gray-900">{dateStr}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Start Time</p>
            <p className="font-semibold text-gray-900">{event.startTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Courts</p>
            <p className="font-semibold text-gray-900">{event.courtCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Players</p>
            <p className="font-semibold text-gray-900">{confirmed.length}/{event.maxPlayers}</p>
          </div>
        </div>
      </div>

      {/* Registered players */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Registered Players ({confirmed.length})
        </h2>
        {confirmed.length === 0 ? (
          <p className="text-gray-400">No players registered yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {confirmed.map((reg: Reg, i: number) => (
              <div key={reg.id} className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 w-5 text-right">{i + 1}.</span>
                <span className="text-gray-800">{reg.player.name}</span>
              </div>
            ))}
          </div>
        )}
        {waitlisted.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Waitlist ({waitlisted.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {waitlisted.map((reg: Reg) => (
                <div key={reg.id} className="text-sm text-gray-500">{reg.player.name}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Schedule button */}
      {(event.status === 'SCHEDULE_GENERATED' || event.status === 'COMPLETED') && (
        <div className="mb-8">
          <a
            href={`/events/${event.id}/schedule`}
            className="block bg-ccc-gold text-white font-semibold text-center py-4 rounded-xl hover:bg-ccc-gold-light transition-colors"
          >
            View Schedule
          </a>
        </div>
      )}

      {/* Registration form */}
      {isOpen && (
        <RegistrationForm eventId={event.id} isFull={isFull} />
      )}

      {!isOpen && event.status !== 'SCHEDULE_GENERATED' && event.status !== 'COMPLETED' && (
        <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-500">
          Registration is closed for this event.
        </div>
      )}
    </div>
  )
}
