import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminHeader from './AdminHeader'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const now = new Date()

  // Get upcoming events
  const upcomingEvents = await prisma.event.findMany({
    where: {
      eventDate: { gte: now },
    },
    include: {
      _count: { select: { registrations: true } },
    },
    orderBy: { eventDate: 'asc' },
    take: 10,
  })

  // Get stats
  const totalEvents = await prisma.event.count()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const playersThisMonth = await prisma.player.count({
    where: { createdAt: { gte: thisMonth } },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link
            href="/admin/events/new"
            className="bg-ccc-green text-white px-6 py-3 rounded-lg hover:bg-ccc-green-light font-semibold transition-colors"
          >
            + Create New Event
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 uppercase font-medium">Total Events</p>
            <p className="text-3xl font-bold text-ccc-green mt-2">{totalEvents}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 uppercase font-medium">Upcoming Events</p>
            <p className="text-3xl font-bold text-ccc-green mt-2">{upcomingEvents.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 uppercase font-medium">New Players This Month</p>
            <p className="text-3xl font-bold text-ccc-green mt-2">{playersThisMonth}</p>
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>

          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              No upcoming events scheduled.
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(event => {
                const dateStr = new Date(event.eventDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })

                return (
                  <Link
                    key={event.id}
                    href={`/admin/events/${event.id}`}
                    className="block bg-white rounded-xl border border-gray-200 hover:border-ccc-green/40 hover:shadow-md transition-all p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {dateStr} &middot; {event.startTime} &middot; {event.sportType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {event._count.registrations}/{event.maxPlayers} players
                        </p>
                        <span className="inline-block mt-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {event.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
