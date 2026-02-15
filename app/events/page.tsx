import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>
}) {
  const { sport } = await searchParams
  const sportFilter = sport === 'PICKLEBALL' || sport === 'TENNIS' ? sport : undefined

  const events = await prisma.event.findMany({
    where: sportFilter ? { sportType: sportFilter } : undefined,
    include: {
      _count: { select: { registrations: true } },
    },
    orderBy: { eventDate: 'asc' },
  })

  const sportLabel = sportFilter === 'PICKLEBALL' ? 'Pickleball' : sportFilter === 'TENNIS' ? 'Tennis' : 'All'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-ccc-green">
          {sportLabel} Events
        </h1>
        {sportFilter && (
          <Link href="/events" className="text-sm text-ccc-gold hover:underline">
            View all events
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No upcoming events scheduled. Check back soon!</p>
          <Link href="/" className="mt-4 inline-block text-ccc-green hover:underline">
            &larr; Back to home
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map(event => {
            const spotsLeft = event.maxPlayers - event._count.registrations
            const isFull = spotsLeft <= 0
            const dateStr = new Date(event.eventDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
            const sportColor = event.sportType === 'PICKLEBALL' ? 'bg-ccc-green' : 'bg-ccc-gold'

            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block bg-white rounded-xl border border-gray-200 hover:border-ccc-green/40 hover:shadow-md transition-all p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${sportColor} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>
                        {event.sportType}
                      </span>
                      {isFull && (
                        <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                          FULL
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{event.name}</h2>
                    <p className="text-gray-500 mt-1">{dateStr} &middot; {event.startTime}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500 shrink-0 ml-4">
                    <p>{event._count.registrations}/{event.maxPlayers} players</p>
                    <p>{event.courtCount} court{event.courtCount !== 1 ? 's' : ''}</p>
                    {!isFull && (
                      <p className="text-ccc-green font-medium">{spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left</p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
