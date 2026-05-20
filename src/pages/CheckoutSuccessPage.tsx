import { Button } from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

export function CheckoutSuccessPage() {
  const [params] = useSearchParams()
  const orderId = params.get('order')

  return (
    <div className="py-24">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <h1 className="mt-8 font-display text-3xl font-bold text-ocean-900">Order Confirmed!</h1>
        <p className="mt-4 text-ocean-600">
          Thank you for shopping with Meng&apos;s Fish Tank. We&apos;ve received your order and will send a
          confirmation email shortly.
        </p>
        {orderId && (
          <p className="mt-4 rounded-xl bg-ocean-50 px-4 py-3 font-mono text-sm text-ocean-800">
            Order ID: <strong>{orderId}</strong>
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
