
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const eventId = parseInt((await params).id)
    const body = await request.json()
    const playerId = parseInt(body.playerId)

    if (!playerId) {
        return NextResponse.json({ error: 'Player ID required' }, { status: 400 })
    }

    try {
        // Check if already registered
        const existing = await prisma.registration.findUnique({
            where: {
                eventId_playerId: {
                    eventId,
                    playerId,
                },
            },
        })

        if (existing) {
            return NextResponse.json({ error: 'Player already registered' }, { status: 400 })
        }

        // Check caps (optional, admin can override?)
        // Brief doesn't say admin is restricted by caps, but "Waitlist" implied logic.
        // We'll just add as CONFIRMED for now, or check capacity.
        // For simplicity, admin adds as CONFIRMED.

        await prisma.registration.create({
            data: {
                eventId,
                playerId,
                status: 'CONFIRMED',
            },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Add player error:', error)
        return NextResponse.json({ error: 'Failed to add player' }, { status: 500 })
    }
}
