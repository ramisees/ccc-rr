import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const eventId = parseInt(id, 10)
  const body = await req.json()

  const { name, email, phone, gender, rating, skillLevel } = body
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { registrations: true } } },
  })

  // ... (validations)

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  if (event.status !== 'REGISTRATION_OPEN') {
    return NextResponse.json({ error: 'Registration is closed for this event' }, { status: 400 })
  }

  // Find or create player
  let player = null
  if (email) {
    player = await prisma.player.findFirst({ where: { email } })
  }

  // If player found, update rating/gender if provided
  if (player) {
    if (gender || rating || phone) {
      player = await prisma.player.update({
        where: { id: player.id },
        data: {
          gender: gender ? gender : undefined,
          rating: rating ? parseFloat(rating) : undefined,
          phone: phone ? phone : undefined,
        }
      })
    }
  } else {
    // Create new
    player = await prisma.player.create({
      data: {
        name: name.trim(),
        email: email || null,
        phone: phone || null,
        gender: gender || null,
        rating: rating ? parseFloat(rating) : null,
        skillLevel: skillLevel || null,
      },
    })
  }

  // Check for duplicate registration
  const existing = await prisma.registration.findUnique({
    where: { eventId_playerId: { eventId, playerId: player.id } },
  })
  if (existing) {
    return NextResponse.json({ error: 'Already registered for this event' }, { status: 409 })
  }

  // Determine status based on capacity
  const confirmedCount = await prisma.registration.count({
    where: { eventId, status: 'CONFIRMED' },
  })
  const regStatus = confirmedCount >= event.maxPlayers ? 'WAITLISTED' : 'CONFIRMED'

  const registration = await prisma.registration.create({
    data: {
      eventId,
      playerId: player.id,
      status: regStatus,
    },
    include: { player: true },
  })

  return NextResponse.json({
    registration,
    message: regStatus === 'WAITLISTED'
      ? "You've been added to the waitlist."
      : "You're registered! See you on the courts.",
  }, { status: 201 })
}
