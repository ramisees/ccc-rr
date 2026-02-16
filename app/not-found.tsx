import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-ccc-green mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          href="/"
          className="inline-block bg-ccc-green text-white px-6 py-3 rounded-lg hover:bg-ccc-green-light transition-colors font-semibold"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
