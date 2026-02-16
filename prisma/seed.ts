import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
console.log('DIRECT_URL present:', !!process.env.DIRECT_URL);

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const players = [
  { name: "Rachele Arnica-Maxy", rating: 2.83, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Vicki Murray", rating: 3.31, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Andrew J", rating: 3.63, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Ashley Adams", rating: 3.91, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Trent Jolley", rating: 3.42, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Shannon Fuller", rating: 3.57, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Addy Adams", rating: 3.21, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "David Peltzer", rating: 3.70, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Israel Gomez", rating: 3.95, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Lauren Westmoreland", rating: 3.18, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Joe Kastelic", rating: 4.05, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Daniel Vanwagner", rating: 3.78, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Karen Shokes", rating: 3.10, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Kathleen Hire", rating: 4.03, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Jenn Foster", rating: 3.44, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Lexi Adams", rating: 3.39, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Carol Robinson", rating: 3.81, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Jennell Andrews", rating: 3.40, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Jen Hedgcoe", rating: 2.90, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Tucker Westmoreland", rating: 2.37, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Lincoln Westmoreland", rating: 3.22, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Ellie Hire", rating: 4.15, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Devin Donley", rating: 2.94, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Amber M", rating: 2.64, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Richard Gomersall", rating: 3.38, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Tony Jarrett", rating: 3.18, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Brad Shokes", rating: 2.64, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Gannon Berg", rating: 2.83, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Ramsey Dellinger", rating: null, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Leigh Anne Sharp", rating: 2.21, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Vinessa Polender", rating: null, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Maria Sherrill", rating: 3.16, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Denise Moose", rating: 3.18, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Liza Allienello", rating: null, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Kelly Kastelic", rating: null, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Dalton Berg", rating: 3.72, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Stephanie Vanwagner", rating: 2.62, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Krista Akel", rating: null, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Bryan Adams", rating: 2.86, gender: "MALE", sport: "PICKLEBALL" },
  { name: "April Berg", rating: 2.36, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Tabitha West", rating: null, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Shannon Busic", rating: null, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Jennifer Thompson", rating: null, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Taylor Childers", rating: 2.57, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Brady Childers", rating: 2.85, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Doug Bishop", rating: 3.22, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Jason Burgess", rating: null, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Bonnie Bishop", rating: 3.75, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Mark West", rating: null, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Stephanie Waite", rating: 3.49, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Caroline Windham", rating: null, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Fernando Desousa", rating: 3.65, gender: "MALE", sport: "PICKLEBALL" },
  { name: "Deanna Bell", rating: 3.36, gender: "FEMALE", sport: "PICKLEBALL" },
  { name: "Eileen Wilson", rating: null, gender: "FEMALE", sport: "PICKLEBALL" },
];

async function main() {
  console.log('Seeding data...');

  // 1. Create Players
  for (const p of players) {
    const email = `${p.name.replace(/\s+/g, '.').toLowerCase()}@example.com`;
    await prisma.player.upsert({
      where: { email },
      update: {
        rating: p.rating,
        gender: p.gender as any,
        sport: p.sport,
      },
      create: {
        name: p.name,
        email,
        rating: p.rating,
        gender: p.gender as any,
        sport: p.sport,
        skillLevel: 'INTERMEDIATE', // Default
      },
    });
  }
  console.log(`Seeded ${players.length} players.`);

  // 2. Create Pickleball Event (Next Friday 9AM)
  const today = new Date();
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + (5 + 7 - today.getDay()) % 7);
  nextFriday.setHours(9, 0, 0, 0);

  const pbEvent = await prisma.event.create({
    data: {
      name: 'Friday Morning Pickleball',
      sportType: 'PICKLEBALL',
      eventDate: nextFriday,
      registrationDeadline: new Date(nextFriday.getTime() - 24 * 60 * 60 * 1000), // 24h before
      startTime: '9:00 AM',
      courtCount: 4,
      maxPlayers: 16,
      status: 'REGISTRATION_OPEN',
    },
  });

  // 3. Register first 16 rated players to Pickleball Event
  const ratedPlayers = await prisma.player.findMany({
    where: { rating: { not: null }, sport: 'PICKLEBALL' },
    take: 16,
    orderBy: { rating: 'desc' },
  });

  for (const player of ratedPlayers) {
    await prisma.registration.create({
      data: {
        eventId: pbEvent.id,
        playerId: player.id,
        status: 'CONFIRMED',
      },
    });
  }
  console.log(`Created Pickleball event and registered ${ratedPlayers.length} players.`);

  // 4. Create Tennis Event (Next Saturday 10AM)
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + (6 + 7 - today.getDay()) % 7);
  nextSaturday.setHours(10, 0, 0, 0);

  await prisma.event.create({
    data: {
      name: 'Saturday Morning Tennis',
      sportType: 'TENNIS',
      eventDate: nextSaturday,
      registrationDeadline: new Date(nextSaturday.getTime() - 24 * 60 * 60 * 1000),
      startTime: '10:00 AM',
      courtCount: 4,
      maxPlayers: 16,
      status: 'REGISTRATION_OPEN',
    },
  });
  console.log('Created Tennis event (no registrations).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
