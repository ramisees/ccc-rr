import { balanceDoublesTeams, normalizeRatings, type RatedPlayer } from './rating-utils'

interface Player {
  id: number
  name: string
  rating?: number | null
  effectiveRating?: number
}

interface CourtAssignment {
  courtNumber: number
  team1: [Player, Player]
  team2: [Player, Player]
  matchType: 'DOUBLES'
}

interface ScheduleRound {
  roundNumber: number
  courts: CourtAssignment[]
  byes: Player[]
}

/**
 * Generates an 8-round pickleball doubles tournament schedule
 * - Each player plays all 8 rounds (or sits out if odd number)
 * - Partners rotate to maximize variety
 * - Opponents vary across rounds
 * - Court assignments distributed evenly
 * - Teams are balanced by rating within each court
 */
export function generatePickleballSchedule(
  players: Player[],
  courtCount: number
): ScheduleRound[] {
  if (players.length < 8) {
    throw new Error('Need at least 8 players for pickleball round robin')
  }
  if (players.length > 24) {
    throw new Error('Maximum 24 players supported')
  }
  if (courtCount < 2 || courtCount > 6) {
    throw new Error('Court count must be between 2 and 6')
  }

  const rounds: ScheduleRound[] = []

  // Normalize ratings once for all players (fills in defaults)
  // We need to cast our Player into RatedPlayer format for normalizeRatings
  const ratedPlayersResult = normalizeRatings(players.map(p => ({
    id: p.id,
    name: p.name,
    rating: p.rating ?? null
  })))

  // Map back to our local Player interface fully populated
  const playerList: Player[] = ratedPlayersResult.map(rp => ({
    id: rp.id,
    name: rp.name,
    rating: rp.rating,
    effectiveRating: rp.effectiveRating
  }))

  // If odd number of players, add a dummy "BYE" player
  const needsBye = playerList.length % 4 !== 0
  if (needsBye) {
    playerList.push({ id: -1, name: 'BYE', rating: null, effectiveRating: 0 })
  }

  // Use a round-robin rotation algorithm
  // We'll generate 8 rounds, rotating matchups to maximize partner and opponent variety
  for (let roundNum = 1; roundNum <= 8; roundNum++) {
    const round: ScheduleRound = {
      roundNumber: roundNum,
      courts: [],
      byes: [],
    }

    // Rotate players for this round using a carousel method
    const rotatedPlayers = rotateForRound(playerList, roundNum)

    // Group players into groups of 4 for each court
    // Instead of forming fixed teams [0,1] vs [2,3], we take [0,1,2,3] and balance them

    let courtNum = 1

    for (let i = 0; i < rotatedPlayers.length; i += 4) {
      if (i + 3 >= rotatedPlayers.length) break; // Should not happen if logic is correct

      const p1 = rotatedPlayers[i]
      const p2 = rotatedPlayers[i + 1]
      const p3 = rotatedPlayers[i + 2]
      const p4 = rotatedPlayers[i + 3]

      const group = [p1, p2, p3, p4]

      // Check for BYEs
      const hasBye = group.some(p => p.id === -1)
      if (hasBye) {
        group.forEach(p => {
          if (p.id !== -1) round.byes.push(p)
        })
        continue
      }

      // Balance the 4 players into 2 fair teams
      // We need to cast group to the type expected by balanceDoublesTeams
      // Since we populated effectiveRating above, we can assert it exists
      const groupForBalance = group as (RatedPlayer & { effectiveRating: number })[]
      const { team1, team2 } = balanceDoublesTeams(groupForBalance)

      round.courts.push({
        courtNumber: courtNum,
        // Cast back to Player
        team1: [team1[0] as Player, team1[1] as Player],
        team2: [team2[0] as Player, team2[1] as Player],
        matchType: 'DOUBLES',
      })

      courtNum++
      if (courtNum > courtCount) courtNum = 1
    }

    rounds.push(round)
  }

  return rounds
}

/**
 * Rotate player positions for variety across rounds
 * Uses a circular shift pattern with different offsets per round
 */
function rotateForRound(players: Player[], roundNumber: number): Player[] {
  const n = players.length
  const offset = ((roundNumber - 1) * 3) % n // Different rotation per round

  return players.map((_, i) => {
    const newIndex = (i + offset) % n
    return players[newIndex]
  })
}
