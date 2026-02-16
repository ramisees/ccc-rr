'use client'

import { useState } from 'react'

interface Player {
  id: number
  name: string
  rating: number | null
}

interface Match {
  id: number
  roundNumber: number
  courtNumber: number
  matchType: string
  team1Score: number | null
  team2Score: number | null
  status: string
  team1Player1: Player
  team1Player2: Player | null
  team2Player1: Player
  team2Player2: Player | null
}

interface ScheduleDisplayProps {
  matches: Match[]
  players: Player[]
  sportType: string
}

export default function ScheduleDisplay({
  matches,
  players,
  sportType,
}: ScheduleDisplayProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)

  // Group matches by round
  const rounds = new Map<number, Match[]>()
  matches.forEach(match => {
    const roundMatches = rounds.get(match.roundNumber) || []
    roundMatches.push(match)
    rounds.set(match.roundNumber, roundMatches)
  })

  // Filter matches for selected player
  const playerMatches = selectedPlayerId
    ? matches.filter(match =>
      [
        match.team1Player1?.id,
        match.team1Player2?.id,
        match.team2Player1?.id,
        match.team2Player2?.id,
      ].includes(selectedPlayerId)
    )
    : []

  const courtColors = [
    'bg-blue-100 border-blue-300',
    'bg-green-100 border-green-300',
    'bg-purple-100 border-purple-300',
    'bg-orange-100 border-orange-300',
    'bg-pink-100 border-pink-300',
    'bg-teal-100 border-teal-300',
  ]

  const getCourtColor = (courtNum: number) => {
    return courtColors[(courtNum - 1) % courtColors.length]
  }

  const formatPlayer = (p: Player) => {
    return (
      <span>
        {p.name}
        {/* @ts-ignore */}
        {p.rating && <span className="text-xs text-gray-400 ml-1">({p.rating.toFixed(2)})</span>}
      </span>
    )
  }

  const formatTeam = (p1: Player | null, p2: Player | null) => {
    if (!p1) return 'Unknown'
    if (!p2) return formatPlayer(p1)
    return (
      <span>
        {formatPlayer(p1)} <span className="text-gray-400">&amp;</span> {formatPlayer(p2)}
      </span>
    )
  }

  return (
    <div>
      {/* Player Lookup - hidden in print */}
      <div className="mb-8 print:hidden">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Find Your Schedule
          </label>
          <select
            value={selectedPlayerId || ''}
            onChange={e => setSelectedPlayerId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccc-green/50 focus:border-ccc-green outline-none bg-white"
          >
            <option value="">Select your name...</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        {/* Player's matches */}
        {selectedPlayerId && (
          <div className="mt-6 bg-ccc-green/5 rounded-xl border border-ccc-green/20 p-6">
            <h3 className="text-lg font-semibold text-ccc-green mb-4">Your Matches</h3>
            <div className="space-y-3">
              {Array.from(rounds.entries())
                .sort(([a], [b]) => a - b)
                .map(([roundNum, roundMatches]) => {
                  const myMatch = roundMatches.find(match =>
                    [match.team1Player1?.id, match.team1Player2?.id, match.team2Player1?.id, match.team2Player2?.id].includes(selectedPlayerId)
                  )
                  if (myMatch) {
                    const isTeam1 = [myMatch.team1Player1?.id, myMatch.team1Player2?.id].includes(selectedPlayerId)
                    const yourTeam = isTeam1
                      ? formatTeam(myMatch.team1Player1, myMatch.team1Player2)
                      : formatTeam(myMatch.team2Player1, myMatch.team2Player2)
                    const opponentTeam = isTeam1
                      ? formatTeam(myMatch.team2Player1, myMatch.team2Player2)
                      : formatTeam(myMatch.team1Player1, myMatch.team1Player2)
                    return (
                      <div key={roundNum} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              Round {myMatch.roundNumber}, Court {myMatch.courtNumber}
                            </span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{yourTeam}</p>
                            <p className="text-sm text-gray-600">vs {opponentTeam}</p>
                          </div>
                          {myMatch.matchType === 'SINGLES' && (
                            <span className="text-xs bg-ccc-gold/20 text-ccc-gold px-2 py-1 rounded-full font-medium">SINGLES</span>
                          )}
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div key={roundNum} className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4">
                        <span className="text-xs font-medium text-gray-500">Round {roundNum}</span>
                        <p className="text-sm text-gray-500 mt-1">Bye — sit out this round</p>
                      </div>
                    )
                  }
                })}
            </div>
          </div>
        )}
      </div>

      {/* Full Schedule */}
      <div className="space-y-8">
        {Array.from(rounds.entries())
          .sort(([a], [b]) => a - b)
          .map(([roundNum, roundMatches]) => {
            // Calculate who has a bye this round
            const playingIds = new Set<number>()
            roundMatches.forEach(match => {
              if (match.team1Player1) playingIds.add(match.team1Player1.id)
              if (match.team1Player2) playingIds.add(match.team1Player2.id)
              if (match.team2Player1) playingIds.add(match.team2Player1.id)
              if (match.team2Player2) playingIds.add(match.team2Player2.id)
            })
            const byePlayers = players.filter(p => !playingIds.has(p.id))

            return (
              <div key={roundNum} className="break-inside-avoid">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Round {roundNum}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {roundMatches.map(match => (
                    <div
                      key={match.id}
                      className={`border-2 rounded-xl p-4 ${getCourtColor(match.courtNumber)}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900">
                          Court {match.courtNumber}
                        </span>
                        {match.matchType === 'SINGLES' && (
                          <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full font-medium">
                            SINGLES
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {formatTeam(match.team1Player1, match.team1Player2)}
                          </span>
                          {match.team1Score !== null && (
                            <span className="text-sm font-bold">{match.team1Score}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 text-center">vs</div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {formatTeam(match.team2Player1, match.team2Player2)}
                          </span>
                          {match.team2Score !== null && (
                            <span className="text-sm font-bold">{match.team2Score}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Bye indicator */}
                  {byePlayers.length > 0 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bye — Next Round</span>
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {byePlayers.map(p => p.name).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
