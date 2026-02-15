import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clear existing data
  await prisma.registration.deleteMany()
  await prisma.match.deleteMany()
  await prisma.event.deleteMany()
  await prisma.player.deleteMany()

  // Calculate upcoming Friday and Saturday
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=Sun, 5=Fri, 6=Sat
  const daysUntilFriday = ((5 - dayOfWeek) + 7) % 7 || 7
  const friday = new Date(now)
  friday.setDate(now.getDate() + daysUntilFriday)
  friday.setHours(9, 0, 0, 0)

  const saturday = new Date(friday)
  saturday.setDate(friday.getDate() + 1)
  saturday.setHours(10, 0, 0, 0)

  // Registration deadline = day before event at midnight
  const fridayDeadline = new Date(friday)
  fridayDeadline.setDate(friday.getDate() - 1)
  fridayDeadline.setHours(23, 59, 59, 0)

  const saturdayDeadline = new Date(saturday)
  saturdayDeadline.setDate(saturday.getDate() - 1)
  saturdayDeadline.setHours(23, 59, 59, 0)

  // Create events
  const pickleballEvent = await prisma.event.create({
    data: {
      name: 'Friday Pickleball Round Robin',
      sportType: 'PICKLEBALL',
      eventDate: friday,
      registrationDeadline: fridayDeadline,
      startTime: '9:00 AM',
      courtCount: 3,
      maxPlayers: 12,
      status: 'REGISTRATION_OPEN',
    },
  })

  const tennisEvent = await prisma.event.create({
    data: {
      name: 'Saturday Tennis Doubles',
      sportType: 'TENNIS',
      eventDate: saturday,
      registrationDeadline: saturdayDeadline,
      startTime: '10:00 AM',
      courtCount: 2,
      maxPlayers: 8,
      status: 'REGISTRATION_OPEN',
    },
  })

  // Create 10 players
  const playerNames = [
    { name: 'Tom Henderson', email: 'tom.h@email.com', skillLevel: 'ADVANCED' },
    { name: 'Sarah Mitchell', email: 'sarah.m@email.com', skillLevel: 'INTERMEDIATE' },
    { name: 'Mike Johnson', email: 'mike.j@email.com', skillLevel: 'ADVANCED' },
    { name: 'Lisa Chen', email: 'lisa.c@email.com', skillLevel: 'INTERMEDIATE' },
    { name: 'Dave Wilson', email: 'dave.w@email.com', skillLevel: 'BEGINNER' },
    { name: 'Amy Rodriguez', email: 'amy.r@email.com', skillLevel: 'ADVANCED' },
    { name: 'Chris Taylor', email: 'chris.t@email.com', skillLevel: 'INTERMEDIATE' },
    { name: 'Karen White', email: 'karen.w@email.com', skillLevel: 'BEGINNER' },
    { name: 'James Brown', email: 'james.b@email.com', skillLevel: 'INTERMEDIATE' },
    { name: 'Emily Davis', email: 'emily.d@email.com', skillLevel: 'ADVANCED' },
  ]

  const players = await Promise.all(
    playerNames.map(p => prisma.player.create({ data: p }))
  )

  // Register 8 players for Pickleball
  for (let i = 0; i < 8; i++) {
    await prisma.registration.create({
      data: {
        eventId: pickleballEvent.id,
        playerId: players[i].id,
        status: 'CONFIRMED',
      },
    })
  }

  // Register 6 players for Tennis
  for (let i = 0; i < 6; i++) {
    await prisma.registration.create({
      data: {
        eventId: tennisEvent.id,
        playerId: players[i].id,
        status: 'CONFIRMED',
      },
    })
  }

  console.log('Seed complete!')
  console.log(`  Pickleball event: ${pickleballEvent.name} (ID: ${pickleballEvent.id})`)
  console.log(`  Tennis event: ${tennisEvent.name} (ID: ${tennisEvent.id})`)
  console.log(`  ${players.length} players created`)
  console.log(`  8 pickleball registrations, 6 tennis registrations`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
