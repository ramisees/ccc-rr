-- CCC Round Robin — Full setup (tables + seed data)
-- Paste this entire block into Supabase SQL Editor and click Run

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sportType" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "registrationDeadline" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "courtCount" INTEGER NOT NULL DEFAULT 2,
    "maxPlayers" INTEGER NOT NULL DEFAULT 16,
    "status" TEXT NOT NULL DEFAULT 'REGISTRATION_OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "skillLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Registration" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "courtNumber" INTEGER NOT NULL,
    "matchType" TEXT NOT NULL,
    "team1Player1Id" INTEGER NOT NULL,
    "team1Player2Id" INTEGER,
    "team2Player1Id" INTEGER NOT NULL,
    "team2Player2Id" INTEGER,
    "team1Score" INTEGER,
    "team2Score" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Registration_eventId_playerId_key" ON "Registration"("eventId", "playerId");

ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey"
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Registration" ADD CONSTRAINT "Registration_playerId_fkey"
    FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Match" ADD CONSTRAINT "Match_eventId_fkey"
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- SEED DATA
-- ============================================

-- Events
INSERT INTO "Event" ("id", "name", "sportType", "eventDate", "registrationDeadline", "startTime", "courtCount", "maxPlayers", "status", "createdAt", "updatedAt") VALUES
(1, 'Friday Pickleball Round Robin', 'PICKLEBALL', '2026-02-20 14:00:00.000', '2026-02-20 04:59:59.000', '9:00 AM', 3, 12, 'REGISTRATION_OPEN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Saturday Tennis Doubles', 'TENNIS', '2026-02-21 15:00:00.000', '2026-02-21 04:59:59.000', '10:00 AM', 2, 8, 'REGISTRATION_OPEN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('"Event_id_seq"', 2);

-- Players
INSERT INTO "Player" ("id", "name", "email", "skillLevel", "createdAt") VALUES
(1, 'Tom Henderson', 'tom.h@email.com', 'ADVANCED', CURRENT_TIMESTAMP),
(2, 'Sarah Mitchell', 'sarah.m@email.com', 'INTERMEDIATE', CURRENT_TIMESTAMP),
(3, 'Mike Johnson', 'mike.j@email.com', 'ADVANCED', CURRENT_TIMESTAMP),
(4, 'Lisa Chen', 'lisa.c@email.com', 'INTERMEDIATE', CURRENT_TIMESTAMP),
(5, 'Dave Wilson', 'dave.w@email.com', 'BEGINNER', CURRENT_TIMESTAMP),
(6, 'Amy Rodriguez', 'amy.r@email.com', 'ADVANCED', CURRENT_TIMESTAMP),
(7, 'Chris Taylor', 'chris.t@email.com', 'INTERMEDIATE', CURRENT_TIMESTAMP),
(8, 'Karen White', 'karen.w@email.com', 'BEGINNER', CURRENT_TIMESTAMP),
(9, 'James Brown', 'james.b@email.com', 'INTERMEDIATE', CURRENT_TIMESTAMP),
(10, 'Emily Davis', 'emily.d@email.com', 'ADVANCED', CURRENT_TIMESTAMP);

SELECT setval('"Player_id_seq"', 10);

-- Registrations: 8 for Pickleball, 6 for Tennis
INSERT INTO "Registration" ("eventId", "playerId", "status", "registeredAt") VALUES
(1, 1, 'CONFIRMED', CURRENT_TIMESTAMP),
(1, 2, 'CONFIRMED', CURRENT_TIMESTAMP),
(1, 3, 'CONFIRMED', CURRENT_TIMESTAMP),
(1, 4, 'CONFIRMED', CURRENT_TIMESTAMP),
(1, 5, 'CONFIRMED', CURRENT_TIMESTAMP),
(1, 6, 'CONFIRMED', CURRENT_TIMESTAMP),
(1, 7, 'CONFIRMED', CURRENT_TIMESTAMP),
(1, 8, 'CONFIRMED', CURRENT_TIMESTAMP),
(2, 1, 'CONFIRMED', CURRENT_TIMESTAMP),
(2, 2, 'CONFIRMED', CURRENT_TIMESTAMP),
(2, 3, 'CONFIRMED', CURRENT_TIMESTAMP),
(2, 4, 'CONFIRMED', CURRENT_TIMESTAMP),
(2, 5, 'CONFIRMED', CURRENT_TIMESTAMP),
(2, 6, 'CONFIRMED', CURRENT_TIMESTAMP);
