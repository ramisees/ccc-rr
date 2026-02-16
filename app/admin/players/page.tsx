import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminHeader from '../AdminHeader'
import PlayerSearchFilter from './PlayerSearchFilter'
import DeletePlayerButton from './DeletePlayerButton'
import ImportPlayersButton from './ImportPlayersButton'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PlayersPage(props: Props) {
    const searchParams = await props.searchParams
    const q = typeof searchParams.q === 'string' ? searchParams.q : undefined
    const sport = typeof searchParams.sport === 'string' ? searchParams.sport : undefined
    const gender = typeof searchParams.gender === 'string' ? searchParams.gender : undefined
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'name'

    // Build where clause
    const where: Prisma.PlayerWhereInput = {}

    if (q) {
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
        ]
    }

    if (sport && sport !== 'ALL') {
        if (sport === 'BOTH') {
            where.sport = 'BOTH'
        } else {
            where.sport = sport
        }
    }

    if (gender && gender !== 'ALL') {
        where.gender = gender as any
    }

    // Build order by
    let orderBy: Prisma.PlayerOrderByWithRelationInput = { name: 'asc' }

    if (sort === 'rating_desc') {
        orderBy = { rating: 'desc' }
    } else if (sort === 'date_desc') {
        orderBy = { createdAt: 'desc' }
    }

    const players = await prisma.player.findMany({
        where,
        orderBy,
    })

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />

            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Players Directory</h1>
                    <div className="flex gap-3">
                        <ImportPlayersButton />
                        <Link
                            href="/admin/players/new"
                            className="bg-ccc-green text-white px-4 py-2 rounded-lg hover:bg-ccc-green-light font-semibold transition-colors"
                        >
                            + Add Player
                        </Link>
                    </div>
                </div>

                <PlayerSearchFilter />

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rating
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Details
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {players.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                            No players found.
                                        </td>
                                    </tr>
                                ) : (
                                    players.map((player) => (
                                        <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{player.name}</div>
                                                <div className="text-xs text-gray-500">Joined {new Date(player.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${!player.rating ? 'bg-gray-100 text-gray-800' :
                                                        player.rating >= 4.0 ? 'bg-purple-100 text-purple-800' :
                                                            player.rating >= 3.5 ? 'bg-blue-100 text-blue-800' :
                                                                player.rating >= 3.0 ? 'bg-green-100 text-green-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {player.rating ? player.rating.toFixed(2) : 'NR'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {player.gender ? player.gender.charAt(0) + player.gender.slice(1).toLowerCase() : '-'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {player.sport ? (player.sport === 'BOTH' ? 'Pickleball & Tennis' : player.sport.charAt(0) + player.sport.slice(1).toLowerCase()) : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{player.email || '-'}</div>
                                                <div className="text-sm text-gray-500">{player.phone || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={`/admin/players/${player.id}/edit`} className="text-ccc-green hover:text-ccc-green-dark mr-4">
                                                    Edit
                                                </Link>
                                                <DeletePlayerButton id={player.id} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
