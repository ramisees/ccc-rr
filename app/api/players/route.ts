
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')
    const sport = searchParams.get('sport')
    const gender = searchParams.get('gender')
    const sort = searchParams.get('sort') || 'name'

    const where: Prisma.PlayerWhereInput = {}

    if (q) {
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
        ]
    }

    if (sport && sport !== 'ALL') {
        if (sport === 'BOTH') {
            where.sport = 'BOTH'
        } else {
            where.sport = sport
        }
    }

    if (gender && gender !== 'ALL') {
        where.gender = gender as any
    }

    let orderBy: Prisma.PlayerOrderByWithRelationInput = { name: 'asc' }
    if (sort === 'rating_desc') {
        orderBy = { rating: 'desc' }
    } else if (sort === 'date_desc') {
        orderBy = { createdAt: 'desc' }
    }

    const players = await prisma.player.findMany({
        where,
        orderBy,
    })

    return NextResponse.json(players)
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const player = await prisma.player.create({
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
        console.error('Error creating player:', error)
        return NextResponse.json({ error: 'Failed to create player' }, { status: 500 })
    }
}
