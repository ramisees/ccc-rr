'use client'

import AdminHeader from '../../AdminHeader'
import EventForm from '../EventForm'

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>
        <EventForm />
      </div>
    </div>
  )
}
