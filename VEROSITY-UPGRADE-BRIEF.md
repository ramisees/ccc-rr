# CCC Round Robin Platform — Upgrade Brief for Verosity

**Client:** Ramsey Dellinger — Catawba Country Club (Hickory, NC)
**Domain:** ccc-rr.com (registered on GoDaddy, deploying to Vercel)
**Codebase:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Prisma 7 ORM, Supabase PostgreSQL
**Current State:** MVP is built and running locally — event CRUD, player registration, basic round robin algorithms, admin login all functional

---

## WHAT EXISTS TODAY

The app has a working foundation:

- **Homepage** with Pickleball / Tennis event cards
- **Event listing page** filtered by sport, with sign-up buttons
- **Player registration** — name, email, phone, skill level; returning players auto-fill by email
- **Pickleball round robin algorithm** — 8-round doubles with rotating partners/opponents (8–24 players, 2–6 courts)
- **Tennis round robin algorithm** — 2 matches per player doubles format, plus a special 6-player mixed-court mode (1 doubles + 1 singles court)
- **Schedule display** with round-by-round view, "Your Schedule" player lookup, and print layout
- **Admin login** — single password auth (env var ADMIN_PASSWORD), JWT cookie session, 7-day expiry
- **Admin dashboard** — event creation, roster management, close registration, generate/regenerate schedule, score entry
- **Database** — Supabase PostgreSQL with Event, Player, Registration, and Match models via Prisma

---

## WHAT NEEDS TO BE BUILT / UPGRADED

### 1. ADD GENDER, SPORT, AND RATING FIELDS TO PLAYER MODEL

The current Player model only has: name, email, phone, skillLevel. It needs three new fields:

```prisma
model Player {
  id            Int            @id @default(autoincrement())
  name          String
  email         String?        @unique
  phone         String?
  gender        Gender?        // MALE or FEMALE
  sport         String?        // "PICKLEBALL", "TENNIS", or "BOTH"
  skillLevel    SkillLevel?
  rating        Float?         // DUPR-style rating, scale 2.0 – 8.0
  createdAt     DateTime       @default(now())
  // ... existing relations unchanged
}

enum Gender {
  MALE
  FEMALE
}
```

Update the registration form to include:
- Gender dropdown (Male / Female) — optional
- Rating number input (step 0.01, min 2.0, max 8.0) — optional, with helper text "Enter your DUPR rating if you have one"

Run `prisma db push` after schema changes.

---

### 2. SEED 54 REAL CCC PICKLEBALL PLAYERS

Replace the current sample seed data with these real Catawba Country Club members. Create a seed script at `prisma/seed.ts` that inserts all 54 players:

```typescript
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
```

Also seed:
- 1 Pickleball event (next Friday, 9:00 AM, 4 courts, max 16 players) with the first 16 rated players auto-registered
- 1 Tennis event (next Saturday, 10:00 AM, 4 courts, max 16 players) with NO registrations (no tennis players yet)

Court limits for CCC: **4 pickleball courts max, 8 tennis courts max**

---

### 3. ADMIN PLAYER MANAGEMENT PAGE

Build a full player management section in the admin dashboard.

**Page: `/admin/players`** — Searchable, sortable player directory:
- Table columns: Name, Gender, Sport, Rating, Email, Phone, Date Added
- Search bar that filters by name or email
- Filter dropdowns: by Sport (Pickleball / Tennis / Both / All), by Gender (Male / Female / All)
- Sort by: Name (A-Z), Rating (high to low), Date Added
- Each row has Edit and Delete buttons
- "Add Player" button at top

**Page: `/admin/players/new`** — Add a single player manually:
- Name (required), Email, Phone, Gender, Sport, Skill Level, Rating
- Save creates the player record

**Page: `/admin/players/[id]/edit`** — Edit an existing player

**Bulk Import:**
- On the players page, add an "Import CSV" button
- Accepts a CSV with columns: name, email, phone, gender, sport, rating
- Preview the import before confirming
- Skip duplicates (match by name or email)

**API Routes:**
- GET /api/players — list all players with search/filter/sort params
- POST /api/players — create player
- PUT /api/players/[id] — update player
- DELETE /api/players/[id] — delete player (cascade registrations)
- POST /api/players/import — bulk CSV import

Add "Players" to the admin navigation sidebar/header.

---

### 4. RATING-BALANCED MATCHING ALGORITHM

This is a critical upgrade to the round robin engines. Currently, teams are paired randomly by rotation position. The upgrade adds rating-based team balancing so matches are competitive.

**How it works:**

The existing rotation algorithm determines WHICH 4 players go to each court each round (this ensures partner/opponent variety — don't change this rotation logic). AFTER assigning players to courts, use a "snake draft" to decide who partners with whom:

1. Take the 4 players assigned to a court
2. Sort by rating (highest to lowest)
3. Team 1 = highest + lowest rated player
4. Team 2 = two middle rated players
5. This balances combined team ratings

**Example:**
- Court has: Joe (4.05), Ashley (3.91), Trent (3.42), Addy (3.21)
- Team 1: Joe (4.05) + Addy (3.21) = 7.26 combined
- Team 2: Ashley (3.91) + Trent (3.42) = 7.33 combined
- Difference: 0.07 — very balanced!

**For players with no rating (null):** Assign them the average rating of all rated players in the event. This puts unrated players in the middle of the pack.

**Create a utility at `lib/algorithms/rating-utils.ts`:**

```typescript
export function normalizeRatings(players) {
  // Fill null ratings with group average (default 3.0 if nobody has a rating)
}

export function balanceDoublesTeams(courtPlayers) {
  // Sort by effectiveRating, snake-draft: [0]+[3] vs [1]+[2]
}

export function matchBalanceScore(team1, team2) {
  // Returns absolute difference in combined ratings (lower = more balanced)
}
```

**Integrate into both algorithms:**
- `pickleball-round-robin.ts` — apply balanceDoublesTeams() after court assignments in each of 8 rounds
- `tennis-round-robin.ts` — apply balanceDoublesTeams() after court assignments in each round (including 6-player mixed mode for the doubles court)

---

### 5. DISPLAY RATINGS EVERYWHERE

Once ratings exist, show them throughout the app:

- **Schedule display:** Show rating in parentheses next to each player name — "Joe Kastelic (4.05)"
- **Roster/registration list:** Show ratings, sort by rating (highest first)
- **"Your Schedule" lookup:** Include player's rating
- **Admin event roster:** Show ratings next to names
- **Admin player list:** Rating column
- **Players with no rating:** Show "(NR)" instead of a number

**Rating scale tooltip/legend** — Add a small info icon near ratings that expands to show:
- 2.0–2.5: Beginner
- 2.5–3.0: Novice
- 3.0–3.5: Intermediate
- 3.5–4.0: Advanced Intermediate
- 4.0–4.5: Advanced
- 4.5+: Expert/Tournament

---

### 6. ADMIN EVENT MANAGEMENT IMPROVEMENTS

The current admin event page needs these additions:

**Roster management:**
- Remove player button (with confirmation) next to each registered player
- "Add Player" dropdown that searches existing players to add them to the event
- Drag-and-drop reorder or manual waitlist promotion

**Schedule actions:**
- "Generate Schedule" button — runs the algorithm, shows preview before saving
- "Regenerate Schedule" — warns that existing schedule will be replaced, then re-runs
- After generation, show the full schedule inline on the admin page
- Score entry: for each match, show two score inputs with a Save button
- "Mark Event Complete" button that locks everything

**Event settings:**
- Edit event name, date, time, courts, max players, deadline after creation
- Delete event with confirmation dialog ("This will delete all registrations and matches")

---

### 7. PUBLIC-FACING POLISH

**Event pages:**
- Show player count and spots remaining prominently: "12/16 spots filled"
- If event is full, show "Event Full — Join Waitlist" instead of the normal register button
- After registering, show a clear confirmation: "You're registered! Event is Friday, March 6 at 9:00 AM on 4 courts."

**Schedule page:**
- Color-code courts (Court 1 = green, Court 2 = blue, Court 3 = orange, Court 4 = purple)
- Make the "Your Schedule" player lookup prominent at the top — this is the #1 feature players will use at the club
- Print layout: landscape 8.5x11, clean table, CCC header, large readable text for wall posting
- Optional PDF download button

**Homepage:**
- Show next upcoming event for each sport with countdown: "Next Pickleball RR: Friday in 3 days — 8 spots left"
- Quick-register link directly from homepage cards

---

### 8. MOBILE-FIRST RESPONSIVE DESIGN

The primary use case is a club member pulling out their phone at the courts. Every page must work perfectly on mobile:

- All buttons minimum 44px tap target
- Schedule table horizontally scrollable on small screens
- Registration form simple and fast — should take 30 seconds to sign up
- "Your Schedule" lookup should be instant and obvious
- Test at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1024px+ (desktop)

---

### 9. LOADING STATES, ERROR HANDLING, EMPTY STATES

- Loading spinners/skeletons on all data-fetching pages
- User-friendly error messages if registration fails
- 404 page for invalid event IDs
- Empty states:
  - No events: "No events scheduled yet. Check back soon!"
  - No registrations: "Be the first to sign up!"
  - No schedule: "Schedule will be generated when registration closes."
- Confirmation dialogs before destructive admin actions (delete event, regenerate schedule)
- Toast notifications for admin actions (event created, schedule generated, scores saved)

---

### 10. DEPLOYMENT TO VERCEL + DOMAIN

**Database:** Already set up on Supabase PostgreSQL. Connection strings are configured.

**Environment variables for Vercel:**
- `DATABASE_URL` — Supabase pooler connection (port 6543)
- `DIRECT_URL` — Supabase direct connection (port 5432)
- `ADMIN_PASSWORD` — will be provided separately
- `SESSION_SECRET` — will be provided separately

**Domain setup:**
- Domain: ccc-rr.com (registered on GoDaddy)
- Add domain in Vercel project settings
- Either change GoDaddy nameservers to Vercel's, or add A record → 76.76.21.21 + CNAME www → cname.vercel-dns.com
- Vercel auto-provisions SSL

**Meta tags:**
- Title: "CCC Round Robin — Catawba Country Club"
- Description: "Sign up for Pickleball and Tennis round robin events at Catawba Country Club"
- Open Graph tags for social sharing
- Favicon (green circle with "CCC")
- Web app manifest for home screen shortcut

---

## COLOR PALETTE

- **Primary:** Forest green #2D5016
- **Secondary:** White #FFFFFF
- **Accent:** Gold/tan #C4A962
- **Clean, professional country club aesthetic**

---

## PRIORITY ORDER

1. Schema upgrades (gender, sport, rating fields) + seed real players
2. Rating-balanced matching algorithm
3. Admin player management
4. Admin event management improvements
5. Public-facing polish + display ratings
6. Mobile responsiveness + loading/error states
7. Deploy to Vercel with ccc-rr.com domain

---

## REFERENCE FILES

The full codebase is in the project repo. Key files:
- `prisma/schema.prisma` — current database schema
- `lib/algorithms/pickleball-round-robin.ts` — pickleball 8-round engine
- `lib/algorithms/tennis-round-robin.ts` — tennis engine with 6-player special case
- `lib/auth.ts` — admin session/cookie auth
- `app/admin/` — all admin pages
- `app/events/` — public event pages
- `app/events/[id]/schedule/` — schedule display + print

---

*Questions? Contact Ramsey Dellinger*
