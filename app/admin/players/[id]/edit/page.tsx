import { prisma } from '@/lib/prisma'
import AdminHeader from '../../../AdminHeader'
import PlayerForm from '../../PlayerForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Props = {
    params: Promise<{ id: string }>
}

export default async function EditPlayerPage(props: Props) {
    const params = await props.params
    const id = parseInt(params.id)

    if (isNaN(id)) notFound()

    const player = await prisma.player.findUnique({
        where: { id },
    })

    if (!player) notFound()

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Player: {player.name}</h1>
                <PlayerForm initialData={player} />
            </div>
        </div>
    )
}
