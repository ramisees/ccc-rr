import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  return NextResponse.json(event)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const event = await prisma.event.update({
    where: { id: parseInt(id, 10) },
    data: {
      name: body.name,
      sportType: body.sportType,
      eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
      registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : undefined,
      startTime: body.startTime,
      courtCount: body.courtCount,
      maxPlayers: body.maxPlayers,
      status: body.status,
    },
  })

  return NextResponse.json(event)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await prisma.event.delete({
    where: { id: parseInt(id, 10) },
  })

  return NextResponse.json({ message: 'Event deleted successfully' })
}
