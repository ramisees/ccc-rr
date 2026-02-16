import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ScheduleDisplay from './ScheduleDisplay'

export const dynamic = 'force-dynamic'

interface Match {
  id: number
  roundNumber: number
  courtNumber: number
  matchType: string
  team1Score: number | null
  team2Score: number | null
  status: string
  team1Player1: { id: number; name: string; rating: number | null }
  team1Player2: { id: number; name: string; rating: number | null } | null
  team2Player1: { id: number; name: string; rating: number | null }
  team2Player2: { id: number; name: string; rating: number | null } | null
}

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const eventId = parseInt(id, 10)

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      matches: {
        include: {
          team1Player1: true,
          team1Player2: true,
          team2Player1: true,
          team2Player2: true,
        },
        orderBy: [
          { roundNumber: 'asc' },
          { courtNumber: 'asc' },
        ],
      },
      registrations: {
        where: { status: 'CONFIRMED' },
        include: { player: true },
      },
    },
  })

  if (!event) return notFound()

  if (event.matches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-ccc-green mb-4">{event.name}</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            Schedule has not been generated yet for this event.
          </p>
        </div>
      </div>
    )
  }

  const dateStr = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Get all unique players from matches
  const playerSet = new Set<string>()
  const players: { id: number; name: string; rating: number | null }[] = []

  // @ts-ignore
  event.matches.forEach((match: Match) => {
    [match.team1Player1, match.team1Player2, match.team2Player1, match.team2Player2]
      .filter(p => p !== null)
      .forEach(p => {
        if (p && !playerSet.has(p.name)) {
          playerSet.add(p.name)
          // @ts-ignore
          players.push({ id: p.id, name: p.name, rating: p.rating })
        }
      })
  })

  players.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header - hidden in print */}
      <div className="mb-8 print:hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-ccc-green">{event.name}</h1>
            <p className="text-gray-600 mt-1">
              {dateStr} &middot; {event.startTime} &middot; {event.sportType}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-ccc-green text-white rounded-lg hover:bg-ccc-green-light transition-colors"
            >
              Print Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-center">{event.name}</h1>
        <p className="text-center text-gray-600">
          {dateStr} &middot; {event.startTime}
        </p>
        <p className="text-center text-sm text-gray-500 mt-1">
          Catawba Country Club &middot; {event.sportType}
        </p>
      </div>

      <ScheduleDisplay
        matches={event.matches as any}
        players={players}
        sportType={event.sportType}
      />
    </div>
  )
}
