import AdminHeader from '../../AdminHeader'
import PlayerForm from '../PlayerForm'

export default function NewPlayerPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Player</h1>
                <PlayerForm />
            </div>
        </div>
    )
}
