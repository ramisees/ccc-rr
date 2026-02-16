import { balanceDoublesTeams, normalizeRatings, type RatedPlayer } from './rating-utils'

interface Player {
  id: number
  name: string
  rating?: number | null
  effectiveRating?: number
}

interface CourtAssignment {
  courtNumber: number
  team1: Player[]  // 2 players for doubles, 1 for singles
  team2: Player[]  // 2 players for doubles, 1 for singles
  matchType: 'DOUBLES' | 'SINGLES'
}

interface ScheduleRound {
  roundNumber: number
  courts: CourtAssignment[]
  byes: Player[]
}

/**
 * Generates an 8-round pickleball tournament schedule
 * 
 * Handles any player count 8-24:
 * - If divisible by 4: all doubles courts
 * - If remainder 1 (e.g. 9, 13, 17): doubles + 1 bye rotating each round
 * - If remainder 2 (e.g. 10, 14, 18): doubles + 1 singles court
 * - If remainder 3 (e.g. 11, 15, 19): doubles + 1 singles court + 1 bye rotating
 * 
 * Partners rotate to maximize variety
 * Teams are balanced by rating (snake draft)
 * Byes rotate so no player sits out more than others
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
  if (courtCount < 1 || courtCount > 6) {
    throw new Error('Court count must be between 1 and 6')
  }

  // Normalize ratings (fill nulls with group average)
  const ratedPlayers = normalizeRatings(players.map(p => ({
    id: p.id,
    name: p.name,
    rating: p.rating ?? null
  })))

  const playerList: Player[] = ratedPlayers.map(rp => ({
    id: rp.id,
    name: rp.name,
    rating: rp.rating,
    effectiveRating: rp.effectiveRating
  }))

  const n = playerList.length
  const remainder = n % 4
  // remainder 0: all doubles
  // remainder 1: doubles + 1 bye
  // remainder 2: doubles + 1 singles
  // remainder 3: doubles + 1 singles + 1 bye

  const needsSingles = remainder === 2 || remainder === 3
  const needsBye = remainder === 1 || remainder === 3

  const rounds: ScheduleRound[] = []

  for (let roundNum = 1; roundNum <= 8; roundNum++) {
    const round: ScheduleRound = {
      roundNumber: roundNum,
      courts: [],
      byes: [],
    }

    // Rotate players for variety
    const rotated = rotateForRound(playerList, roundNum)

    // Separate out bye player(s) first
    let activePlayers = [...rotated]

    if (needsBye) {
      // The bye player rotates each round based on round number
      // This ensures everyone sits out roughly equally
      const byeIndex = (roundNum - 1) % activePlayers.length
      const byePlayer = activePlayers.splice(byeIndex, 1)[0]
      round.byes.push(byePlayer)
    }

    // Now assign active players to courts
    // If singles needed, last 2 players go to singles court
    let doublesPlayers: Player[] = []
    let singlesPlayers: Player[] = []

    if (needsSingles) {
      // Last 2 active players play singles — rotate who plays singles each round
      const singlesStartIdx = activePlayers.length - 2
      singlesPlayers = activePlayers.slice(singlesStartIdx)
      doublesPlayers = activePlayers.slice(0, singlesStartIdx)
    } else {
      doublesPlayers = activePlayers
    }

    // Assign doubles courts
    let courtNum = 1
    for (let i = 0; i < doublesPlayers.length; i += 4) {
      if (i + 3 >= doublesPlayers.length) break

      const group = [
        doublesPlayers[i],
        doublesPlayers[i + 1],
        doublesPlayers[i + 2],
        doublesPlayers[i + 3],
      ]

      // Balance teams by rating (snake draft: highest+lowest vs middle two)
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
    }

    // Assign singles court
    if (needsSingles && singlesPlayers.length === 2) {
      round.courts.push({
        courtNumber: round.courts.length + 1,
        team1: [singlesPlayers[0]],
        team2: [singlesPlayers[1]],
        matchType: 'SINGLES',
      })
    }

    rounds.push(round)
  }

  return rounds
}

/**
 * Rotate player positions for variety across rounds.
 * Fix player[0], rotate the rest (classic round-robin circle method).
 * This maximizes partner and opponent variety.
 */
function rotateForRound(players: Player[], roundNumber: number): Player[] {
  if (players.length <= 1) return [...players]

  // Fix the first player, rotate the rest
  const fixed = players[0]
  const rotating = players.slice(1)
  const n = rotating.length

  // Shift by (roundNumber - 1) positions
  const shift = (roundNumber - 1) % n
  const rotated = [
    ...rotating.slice(shift),
    ...rotating.slice(0, shift),
  ]

  return [fixed, ...rotated]
}
