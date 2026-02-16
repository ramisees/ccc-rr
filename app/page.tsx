import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const nextEvent = await prisma.event.findFirst({
    where: {
      eventDate: { gte: new Date() },
      status: 'REGISTRATION_OPEN',
    },
    orderBy: { eventDate: 'asc' },
    include: {
      _count: { select: { registrations: true } },
    },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-ccc-green leading-tight">
          Catawba Country Club
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-ccc-gold mt-2">
          Round Robin Events
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Sign up for Pickleball &amp; Tennis round robins online
        </p>

        {nextEvent && (
          <div className="mt-8 inline-block bg-white rounded-xl border-2 border-ccc-green/20 shadow-lg p-6 max-w-lg w-full">
            <p className="text-sm text-ccc-green font-bold uppercase tracking-wide mb-1">
              Next Upcoming Event
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{nextEvent.name}</h3>
            <p className="text-gray-600 mb-4">
              {new Date(nextEvent.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              {' '}&middot; {nextEvent.startTime}
            </p>
            <Link
              href={`/events/${nextEvent.id}`}
              className="block w-full bg-ccc-green text-white font-bold py-3 rounded-lg hover:bg-ccc-green-light transition-colors"
            >
              Register Now ({nextEvent.maxPlayers - nextEvent._count.registrations} spots left)
            </Link>
          </div>
        )}
      </div>

      {/* Sport cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Link
          href="/events?sport=PICKLEBALL"
          className="group block bg-white rounded-2xl border-2 border-ccc-green/20 hover:border-ccc-green shadow-sm hover:shadow-lg transition-all p-8 text-center"
        >
          <div className="text-5xl mb-4">&#127955;</div>
          <h3 className="text-2xl font-bold text-ccc-green group-hover:text-ccc-green-light transition-colors">
            Pickleball Events
          </h3>
          <p className="mt-2 text-gray-500">
            View upcoming events &amp; sign up &rarr;
          </p>
        </Link>

        <Link
          href="/events?sport=TENNIS"
          className="group block bg-white rounded-2xl border-2 border-ccc-gold/30 hover:border-ccc-gold shadow-sm hover:shadow-lg transition-all p-8 text-center"
        >
          <div className="text-5xl mb-4">&#127934;</div>
          <h3 className="text-2xl font-bold text-ccc-gold group-hover:text-ccc-gold-light transition-colors">
            Tennis Events
          </h3>
          <p className="mt-2 text-gray-500">
            View upcoming events &amp; sign up &rarr;
          </p>
        </Link>
      </div>

      <p className="text-center mt-10 text-gray-500">
        New here? Just pick your sport, find an event, and register. It takes 30 seconds.
      </p>
    </div>
  )
}
