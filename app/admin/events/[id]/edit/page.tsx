import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AdminHeader from '../../../AdminHeader'
import EventForm from '../../EventForm'

export const dynamic = 'force-dynamic'

export default async function EditEventPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const eventId = parseInt(id, 10)

    const event = await prisma.event.findUnique({
        where: { id: eventId },
    })

    if (!event) return notFound()

    // Convert Date objects to strings for the form
    const initialData = {
        ...event,
        eventDate: event.eventDate.toISOString(),
        registrationDeadline: event.registrationDeadline.toISOString(),
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <div className="max-w-2xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Event: {event.name}</h1>
                <EventForm initialData={initialData} />
            </div>
        </div>
    )
}
