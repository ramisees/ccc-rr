import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const SESSION_COOKIE_NAME = 'ccc-admin-session'
const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-secret-change-me'
)

export async function createAdminSession() {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SESSION_SECRET)

  ;(await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) return false

    const verified = await jwtVerify(token, SESSION_SECRET)
    return verified.payload.admin === true
  } catch {
    return false
  }
}

export async function clearAdminSession() {
  ;(await cookies()).delete(SESSION_COOKIE_NAME)
}

export function checkAdminPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD
}
