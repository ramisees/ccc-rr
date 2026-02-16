import { balanceDoublesTeams, normalizeRatings, type RatedPlayer } from './rating-utils'

interface Player {
  id: number
  name: string
  rating?: number | null
  effectiveRating?: number
}

interface CourtAssignment {
  courtNumber: number
  team1: [Player, Player] | [Player]
  team2: [Player, Player] | [Player]
  matchType: 'DOUBLES' | 'SINGLES'
}

interface ScheduleRound {
  roundNumber: number
  courts: CourtAssignment[]
  byes: Player[]
}

/**
 * Generates tennis round robin schedule
 * - Standard (8+ players): 2 matches per player, all doubles
 * - Special (exactly 6 players): Mixed court mode with doubles + singles
 */
export function generateTennisSchedule(
  players: Player[],
  courtCount: number
): ScheduleRound[] {
  // Normalize ratings first
  const ratedPlayersResult = normalizeRatings(players.map(p => ({
    id: p.id,
    name: p.name,
    rating: p.rating ?? null
  })))

  const playerList: Player[] = ratedPlayersResult.map(rp => ({
    id: rp.id,
    name: rp.name,
    rating: rp.rating,
    effectiveRating: rp.effectiveRating
  }))

  if (playerList.length === 6) {
    return generateSixPlayerMixedCourt(playerList)
  }

  if (playerList.length < 8) {
    throw new Error('Need at least 6 players for tennis round robin')
  }

  if (playerList.length > 24) {
    throw new Error('Maximum 24 players supported')
  }

  return generateStandardTennis(playerList, courtCount)
}

/**
 * Standard tennis: Each player plays exactly 2 doubles matches
 * with different partners and opponents each time
 */
function generateStandardTennis(
  players: Player[],
  courtCount: number
): ScheduleRound[] {
  const rounds: ScheduleRound[] = []

  // We need to ensure players play exactly 2 matches total
  // Generate 2 rounds where each player plays once per round
  for (let roundNum = 1; roundNum <= 2; roundNum++) {
    const round: ScheduleRound = {
      roundNumber: roundNum,
      courts: [],
      byes: [],
    }

    // Rotate players for variety
    const rotatedPlayers = rotatePlayersForTennis(players, roundNum)

    // Group into chunks of 4 for doubles matches
    // This replaces the old logic of modifying teams then pairing teams

    // We treat rotatedPlayers as a sequence. 
    // Players (i, i+1, i+2, i+3) form a court.
    // Except we have to be careful about the "Odd player sits out" logic from the original.
    // The original logic:
    // 1. Group into teams of 2. If odd number, last player is bye.
    // 2. Group teams into matches. If odd number of teams, last team is bye (both players).

    // Let's replicate this grouping but then balance the match.

    const teams: Player[][] = []

    // Step 1: Create raw pairs (teams) just to identify who is playing
    // But wait, the balancing changes the teams.
    // So we just need to identify the 4 players for the court.

    // In original logic:
    // team[0] = rotated[0], rotated[1]
    // team[1] = rotated[2], rotated[3]
    // Match = team[0] vs team[1] -> players 0,1,2,3

    // If we have 10 players:
    // P0-P3 -> Court 1
    // P4-P7 -> Court 2
    // P8-P9 -> Team 4 (no opponent) -> Bye

    // If we have 9 players:
    // P8 -> Bye
    // P0-P7 -> 2 Courts

    let i = 0;
    let courtNum = 1;

    while (i < rotatedPlayers.length) {
      const remaining = rotatedPlayers.length - i;

      if (remaining >= 4) {
        // Take 4 players
        const group = [
          rotatedPlayers[i],
          rotatedPlayers[i + 1],
          rotatedPlayers[i + 2],
          rotatedPlayers[i + 3]
        ];

        // Balance them
        const groupForBalance = group as (RatedPlayer & { effectiveRating: number })[]
        const { team1, team2 } = balanceDoublesTeams(groupForBalance)

        round.courts.push({
          courtNumber: courtNum,
          team1: [team1[0] as Player, team1[1] as Player],
          team2: [team2[0] as Player, team2[1] as Player],
          matchType: 'DOUBLES',
        })

        courtNum++
        if (courtNum > courtCount) courtNum = 1

        i += 4;
      } else {
        // Remaining players (1, 2, or 3) are byes
        for (let j = 0; j < remaining; j++) {
          round.byes.push(rotatedPlayers[i + j])
        }
        i += remaining;
      }
    }

    rounds.push(round)
  }

  return rounds
}

/**
 * Special 6-player mixed court mode
 * - 2 rounds total
 * - Each round: 1 doubles court (4 players) + 1 singles court (2 players)
 * - Players rotate through both formats
 * - Each player gets exactly 2 matches total
 */
function generateSixPlayerMixedCourt(players: Player[]): ScheduleRound[] {
  const rounds: ScheduleRound[] = []

  // Round 1: P0,P1,P2,P3 (doubles) + P4 vs P5 (singles)

  // Balance doubles court
  const r1DoublesGroup = [players[0], players[1], players[2], players[3]] as (RatedPlayer & { effectiveRating: number })[]
  const r1Balanced = balanceDoublesTeams(r1DoublesGroup)

  rounds.push({
    roundNumber: 1,
    courts: [
      {
        courtNumber: 1,
        team1: [r1Balanced.team1[0] as Player, r1Balanced.team1[1] as Player],
        team2: [r1Balanced.team2[0] as Player, r1Balanced.team2[1] as Player],
        matchType: 'DOUBLES',
      },
      {
        courtNumber: 2,
        team1: [players[4]],
        team2: [players[5]],
        matchType: 'SINGLES',
      },
    ],
    byes: [],
  })

  // Round 2: P0,P4,P2,P5 (doubles) + P1 vs P3 (singles)
  // Indices: 0, 4, 2, 5 for doubles
  const r2DoublesGroup = [players[0], players[4], players[2], players[5]] as (RatedPlayer & { effectiveRating: number })[]
  const r2Balanced = balanceDoublesTeams(r2DoublesGroup)

  rounds.push({
    roundNumber: 2,
    courts: [
      {
        courtNumber: 1,
        team1: [r2Balanced.team1[0] as Player, r2Balanced.team1[1] as Player],
        team2: [r2Balanced.team2[0] as Player, r2Balanced.team2[1] as Player],
        matchType: 'DOUBLES',
      },
      {
        courtNumber: 2,
        team1: [players[1]], // Was P1 in original
        team2: [players[3]], // Was P3 in original
        matchType: 'SINGLES',
      },
    ],
    byes: [],
  })

  return rounds
}

/**
 * Rotate player positions for variety across rounds
 */
function rotatePlayersForTennis(players: Player[], roundNumber: number): Player[] {
  const n = players.length
  const offset = ((roundNumber - 1) * 2) % n

  return players.map((_, i) => {
    const newIndex = (i + offset) % n
    return players[newIndex]
  })
}
