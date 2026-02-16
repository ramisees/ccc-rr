import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession, checkAdminPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { password } = body

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 })
  }

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  await createAdminSession()

  return NextResponse.json({ message: 'Login successful' })
}
