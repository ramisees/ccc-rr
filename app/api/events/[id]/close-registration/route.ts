import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const eventId = parseInt(id, 10)

  const event = await prisma.event.update({
    where: { id: eventId },
    data: { status: 'REGISTRATION_CLOSED' },
  })

  return NextResponse.json(event)
}
