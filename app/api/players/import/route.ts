
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const text = await file.text()
        const lines = text.split('\n')
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

        // Expected headers: name, email, phone, gender, sport, rating
        const nameIdx = headers.indexOf('name')
        const emailIdx = headers.indexOf('email')
        const phoneIdx = headers.indexOf('phone')
        const genderIdx = headers.indexOf('gender')
        const sportIdx = headers.indexOf('sport')
        const ratingIdx = headers.indexOf('rating')

        if (nameIdx === -1) {
            return NextResponse.json({ error: 'CSV must have a "name" column' }, { status: 400 })
        }

        let successCount = 0
        let errorCount = 0

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim()
            if (!line) continue

            const cols = line.split(',').map(c => c.trim())

            const name = cols[nameIdx]
            if (!name) continue

            const email = emailIdx !== -1 ? cols[emailIdx] : null
            const phone = phoneIdx !== -1 ? cols[phoneIdx] : null
            const gender = genderIdx !== -1 ? cols[genderIdx]?.toUpperCase() : null
            const sport = sportIdx !== -1 ? cols[sportIdx]?.toUpperCase() : null
            const ratingStr = ratingIdx !== -1 ? cols[ratingIdx] : null
            const rating = ratingStr ? parseFloat(ratingStr) : null

            try {
                // Check for existing player by email or name
                const existing = await prisma.player.findFirst({
                    where: {
                        OR: [
                            ...(email ? [{ email }] : []),
                            { name: { equals: name, mode: 'insensitive' } }
                        ]
                    }
                })

                if (existing) {
                    // Update existing or skip? Brief says "Skip duplicates".
                    // We'll skip for now as requested.
                    continue
                }

                await prisma.player.create({
                    data: {
                        name,
                        email: email || undefined,
                        phone,
                        gender: (gender === 'MALE' || gender === 'FEMALE') ? gender : null,
                        sport: (sport === 'PICKLEBALL' || sport === 'TENNIS' || sport === 'BOTH') ? sport : null,
                        rating,
                        skillLevel: 'INTERMEDIATE',
                    },
                })
                successCount++
            } catch (e) {
                console.error(`Failed to import ${name}:`, e)
                errorCount++
            }
        }

        return NextResponse.json({ success: true, count: successCount, errors: errorCount })
    } catch (error) {
        console.error('Import error:', error)
        return NextResponse.json({ error: 'Import failed' }, { status: 500 })
    }
}
