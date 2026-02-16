import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const sportTypeParam = req.nextUrl.searchParams.get('sportType')
  const sportType = sportTypeParam === 'PICKLEBALL' || sportTypeParam === 'TENNIS'
    ? sportTypeParam
    : undefined

  const events = await prisma.event.findMany({
    where: sportType ? { sportType } : undefined,
    include: {
      _count: { select: { registrations: true } },
    },
    orderBy: { eventDate: 'asc' },
  })

  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const event = await prisma.event.create({
    data: {
      name: body.name,
      sportType: body.sportType,
      eventDate: new Date(body.eventDate),
      registrationDeadline: new Date(body.registrationDeadline),
      startTime: body.startTime,
      courtCount: body.courtCount ?? 2,
      maxPlayers: body.maxPlayers ?? 16,
      status: body.status ?? 'REGISTRATION_OPEN',
    },
  })

  return NextResponse.json(event, { status: 201 })
}
