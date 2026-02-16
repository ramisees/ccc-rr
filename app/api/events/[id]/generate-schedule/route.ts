import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generatePickleballSchedule } from '@/lib/algorithms/pickleball-round-robin'
import { generateTennisSchedule } from '@/lib/algorithms/tennis-round-robin'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const eventId = parseInt(id, 10)

  try {
    // Fetch event with registrations
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          where: { status: 'CONFIRMED' },
          include: { player: true },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Validate player count
    const confirmedPlayers = event.registrations.map(reg => ({
      id: reg.player.id,
      name: reg.player.name,
      // @ts-ignore
      rating: reg.player.rating,
    }))

    const minPlayers = event.sportType === 'PICKLEBALL' ? 8 : 6
    if (confirmedPlayers.length < minPlayers) {
      return NextResponse.json(
        { error: `Need at least ${minPlayers} confirmed players to generate ${event.sportType.toLowerCase()} schedule` },
        { status: 400 }
      )
    }

    if (confirmedPlayers.length > 24) {
      return NextResponse.json(
        { error: 'Maximum 24 players supported' },
        { status: 400 }
      )
    }

    // Delete existing matches for this event (in case regenerating)
    await prisma.match.deleteMany({
      where: { eventId },
    })

    // Generate schedule based on sport type
    const schedule = event.sportType === 'PICKLEBALL'
      ? generatePickleballSchedule(confirmedPlayers, event.courtCount)
      : generateTennisSchedule(confirmedPlayers, event.courtCount)

    // Save matches to database
    const matchData = []
    for (const round of schedule) {
      for (const court of round.courts) {
        const team1 = court.team1
        const team2 = court.team2

        matchData.push({
          eventId,
          roundNumber: round.roundNumber,
          courtNumber: court.courtNumber,
          matchType: court.matchType,
          team1Player1Id: team1[0].id,
          team1Player2Id: team1.length === 2 ? team1[1].id : null,
          team2Player1Id: team2[0].id,
          team2Player2Id: team2.length === 2 ? team2[1].id : null,
          status: 'SCHEDULED' as const,
        })
      }
    }

    await prisma.match.createMany({
      data: matchData,
    })

    // Update event status
    await prisma.event.update({
      where: { id: eventId },
      data: { status: 'SCHEDULE_GENERATED' },
    })

    return NextResponse.json({
      message: 'Schedule generated successfully',
      schedule,
      matchCount: matchData.length,
    })
  } catch (error) {
    console.error('Error generating schedule:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate schedule' },
      { status: 500 }
    )
  }
}
