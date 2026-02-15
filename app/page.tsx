import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-ccc-green leading-tight">
          Catawba Country Club
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-ccc-gold mt-2">
          Round Robin Events
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Sign up for Pickleball &amp; Tennis round robins online
        </p>
      </div>

      {/* Sport cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Link
          href="/events?sport=PICKLEBALL"
          className="group block bg-white rounded-2xl border-2 border-ccc-green/20 hover:border-ccc-green shadow-sm hover:shadow-lg transition-all p-8 text-center"
        >
          <div className="text-5xl mb-4">&#127955;</div>
          <h3 className="text-2xl font-bold text-ccc-green group-hover:text-ccc-green-light transition-colors">
            Pickleball Events
          </h3>
          <p className="mt-2 text-gray-500">
            View upcoming events &amp; sign up &rarr;
          </p>
        </Link>

        <Link
          href="/events?sport=TENNIS"
          className="group block bg-white rounded-2xl border-2 border-ccc-gold/30 hover:border-ccc-gold shadow-sm hover:shadow-lg transition-all p-8 text-center"
        >
          <div className="text-5xl mb-4">&#127934;</div>
          <h3 className="text-2xl font-bold text-ccc-gold group-hover:text-ccc-gold-light transition-colors">
            Tennis Events
          </h3>
          <p className="mt-2 text-gray-500">
            View upcoming events &amp; sign up &rarr;
          </p>
        </Link>
      </div>

      <p className="text-center mt-10 text-gray-500">
        New here? Just pick your sport, find an event, and register. It takes 30 seconds.
      </p>
    </div>
  )
}
