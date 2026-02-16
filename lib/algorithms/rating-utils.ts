
export interface RatedPlayer {
    id: number;
    name: string;
    rating: number | null;
}

/**
 * Normalizes ratings for a group of players.
 * If a player has no rating, they are assigned the average rating of the group.
 * If no players have ratings, everyone gets a default 3.0.
 */
export function normalizeRatings(players: RatedPlayer[]): (RatedPlayer & { effectiveRating: number })[] {
    const ratedPlayers = players.filter(p => p.rating !== null);

    let averageRating = 3.0;
    if (ratedPlayers.length > 0) {
        const sum = ratedPlayers.reduce((acc, p) => acc + (p.rating || 0), 0);
        averageRating = sum / ratedPlayers.length;
    }

    return players.map(p => ({
        ...p,
        effectiveRating: p.rating !== null ? p.rating : averageRating
    }));
}

/**
 * Balances 4 players into 2 teams using a snake draft based on effective rating.
 * Sorts players high (0) to low (3).
 * Team 1: Player 0 + Player 3 (Highest + Lowest)
 * Team 2: Player 1 + Player 2 (Middle two)
 */
export function balanceDoublesTeams(players: (RatedPlayer & { effectiveRating: number })[]) {
    if (players.length !== 4) {
        throw new Error("balanceDoublesTeams requires exactly 4 players");
    }

    // Sort by effective rating descending
    const sorted = [...players].sort((a, b) => b.effectiveRating - a.effectiveRating);

    // Team 1 = Highest + Lowest
    const team1 = [sorted[0], sorted[3]];

    // Team 2 = Middle two
    const team2 = [sorted[1], sorted[2]];

    return {
        team1,
        team2,
        ratingDiff: Math.abs(
            (team1[0].effectiveRating + team1[1].effectiveRating) -
            (team2[0].effectiveRating + team2[1].effectiveRating)
        )
    };
}
