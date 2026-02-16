'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Player = {
    id?: number
    name: string
    email?: string | null
    phone?: string | null
    gender?: string | null
    sport?: string | null
    rating?: number | null
    skillLevel?: string | null
}

export default function PlayerForm({ initialData }: { initialData?: Player }) {
    const router = useRouter()
    const [formData, setFormData] = useState<Player>(initialData || {
        name: '',
        email: '',
        phone: '',
        gender: '',
        sport: '',
        rating: null,
        skillLevel: 'INTERMEDIATE',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const url = initialData?.id
                ? `/api/players/${initialData.id}`
                : '/api/players'

            const method = initialData?.id ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                throw new Error('Failed to save player')
            }

            router.push('/admin/players')
            router.refresh()
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 max-w-2xl mx-auto">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-ccc-green focus:border-ccc-green"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-ccc-green focus:border-ccc-green"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-ccc-green focus:border-ccc-green"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-ccc-green focus:border-ccc-green"
                    >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                    <select
                        name="sport"
                        value={formData.sport || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-ccc-green focus:border-ccc-green"
                    >
                        <option value="">Select Sport</option>
                        <option value="PICKLEBALL">Pickleball</option>
                        <option value="TENNIS">Tennis</option>
                        <option value="BOTH">Both</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resulting Scale (2.0 - 8.0)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="2.0"
                        max="8.0"
                        name="rating"
                        value={formData.rating || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-ccc-green focus:border-ccc-green"
                    />
                    <p className="text-xs text-gray-500 mt-1">DUPR or generic rating</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                    <select
                        name="skillLevel"
                        value={formData.skillLevel || 'INTERMEDIATE'}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-ccc-green focus:border-ccc-green"
                    >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-ccc-green text-white px-6 py-2 rounded-lg hover:bg-ccc-green-light disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Player'}
                </button>
            </div>
        </form>
    )
}
