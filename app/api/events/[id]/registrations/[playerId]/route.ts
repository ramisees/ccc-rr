
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; playerId: string }> }
) {
    const eventId = parseInt((await params).id)
    const playerId = parseInt((await params).playerId)

    try {
        await prisma.registration.delete({
            where: {
                eventId_playerId: {
                    eventId,
                    playerId,
                },
            },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to remove player' }, { status: 500 })
    }
}
