
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = parseInt((await params).id)
    const body = await request.json()
    const { team1Score, team2Score } = body

    try {
        const match = await prisma.match.update({
            where: { id },
            data: {
                team1Score: team1Score !== '' ? parseInt(team1Score) : null,
                team2Score: team2Score !== '' ? parseInt(team2Score) : null,
                status: (team1Score !== '' && team2Score !== '') ? 'COMPLETED' : 'SCHEDULED',
            },
        })
        return NextResponse.json(match)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update score' }, { status: 500 })
    }
}
