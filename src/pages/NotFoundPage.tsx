import { Button } from '@/components/ui/Button'
import { Fish } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Fish size={64} className="text-ocean-300" />
      <h1 className="mt-6 font-display text-4xl font-bold text-ocean-900">404</h1>
      <p className="mt-2 text-ocean-600">This page swam off into the deep end.</p>
      <Link to="/" className="mt-8">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}
