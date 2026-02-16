# CCC Round Robin — Catawba Country Club

A modern web application for managing pickleball and tennis round robin tournaments at Catawba Country Club.

## Features

- **Event Management**: Create and manage pickleball and tennis round robin events
- **Player Registration**: Simple online registration for club members
- **Smart Scheduling**: Automated round robin algorithms that maximize partner and opponent variety
- **Schedule Display**: Mobile-friendly schedule views with player lookup
- **Print & Share**: Print-optimized schedules for court posting
- **Admin Dashboard**: Password-protected admin interface for event management

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Hosting**: Vercel
- **Authentication**: Simple password-based admin auth with JWT

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- A Supabase account with a PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ccc-rr-deploy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following:

```env
DATABASE_URL="your-supabase-pooler-url-here"
DIRECT_URL="your-supabase-direct-url-here"
ADMIN_PASSWORD="your-admin-password"
SESSION_SECRET="a-random-secret-string"
```

Get your Supabase database URLs from your Supabase project dashboard.

4. Push the database schema:
```bash
npx prisma db push
```

5. Seed the database with sample data (optional):
```bash
npx prisma db seed
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
/app
  /admin          - Admin dashboard and management pages
  /api            - API routes
  /events         - Public event pages
  layout.tsx      - Root layout with header/footer
  page.tsx        - Homepage

/lib
  /algorithms     - Round robin scheduling algorithms
  auth.ts         - Admin authentication utilities
  prisma.ts       - Prisma client singleton

/prisma
  schema.prisma   - Database schema
  seed.ts         - Database seeding script
```

## Admin Access

Navigate to `/admin/login` and enter the admin password from your `.env` file.

Admin features:
- Create and manage events
- View registrations and rosters
- Generate round robin schedules
- Close registration and delete events

## Deployment to Vercel

1. Push your code to GitHub

2. Import the project in Vercel

3. Configure environment variables in Vercel:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`

4. Deploy! The build command `prisma generate && next build` runs automatically.

## Round Robin Algorithms

### Pickleball (8 Rounds)
- Supports 8-24 players with 2-6 courts
- All doubles format (2v2)
- Maximizes partner rotation and opponent variety
- Minimizes bye rounds

### Tennis

**Standard (8+ players):**
- Each player plays exactly 2 matches
- Different partner and opponents each time
- All doubles format

**Special 6-Player Mode:**
- Mixed court format (1 doubles court + 1 singles court)
- Players rotate through both formats
- Each player plays 2 total matches

## Color Scheme

- **Primary**: Forest Green `#2D5016`
- **Accent**: Gold/Tan `#C4A962`
- **Background**: Off-white `#F9FAF6`

## License

Private - Catawba Country Club

## Support

For issues or questions, contact the club administration.
