
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // In Next.js 15+, params is a promise
) {
    const id = parseInt((await params).id)
    const player = await prisma.player.findUnique({
        where: { id },
    })

    if (!player) {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    return NextResponse.json(player)
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = parseInt((await params).id)
    const body = await request.json()

    try {
        const player = await prisma.player.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email || null,
                phone: body.phone || null,
                gender: body.gender || null,
                sport: body.sport || null,
                rating: body.rating ? parseFloat(body.rating) : null,
                skillLevel: body.skillLevel || null,
            },
        })
        return NextResponse.json(player)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update player' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = parseInt((await params).id)

    try {
        await prisma.player.delete({
            where: { id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 })
    }
}
