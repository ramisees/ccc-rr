'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-ccc-green text-white rounded-lg hover:bg-ccc-green-light transition-colors"
    >
      Print Schedule
    </button>
  )
}
