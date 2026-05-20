import { Button } from '@/components/ui/Button'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_RATES } from '@/lib/constants'
import { calculateCartTotals, formatPrice } from '@/lib/utils'
import type { CheckoutFormData } from '@/types'
import { Link } from 'react-router-dom'

interface CartSummaryProps {
  subtotal: number
  shippingMethod?: CheckoutFormData['shippingMethod']
  showCheckoutButton?: boolean
  compact?: boolean
}

export function CartSummary({
  subtotal,
  shippingMethod = 'standard',
  showCheckoutButton = true,
  compact,
}: CartSummaryProps) {
  const { shipping, tax, total, freeShipping } = calculateCartTotals(subtotal, shippingMethod)
  const amountToFree = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <div className={`rounded-2xl bg-white p-6 shadow-soft ${compact ? '' : 'sticky top-24'}`}>
      <h3 className="font-display text-lg font-semibold text-ocean-900">Order Summary</h3>

      {!freeShipping && subtotal > 0 && amountToFree > 0 && (
        <div className="mt-4 rounded-xl bg-ocean-50 px-4 py-3 text-sm text-ocean-700">
          Add <strong>{formatPrice(amountToFree)}</strong> more for free shipping!
          <div className="mt-2 h-1.5 rounded-full bg-ocean-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-ocean-500 transition-all"
              style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between text-ocean-600">
          <dt>Subtotal</dt>
          <dd className="font-medium text-ocean-900">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-ocean-600">
          <dt>Shipping ({SHIPPING_RATES[shippingMethod].label})</dt>
          <dd className="font-medium text-ocean-900">
            {freeShipping ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </dd>
        </div>
        <div className="flex justify-between text-ocean-600">
          <dt>Estimated tax</dt>
          <dd className="font-medium text-ocean-900">{formatPrice(tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-ocean-100 pt-3 text-base">
          <dt className="font-semibold text-ocean-900">Total</dt>
          <dd className="font-display font-bold text-ocean-900">{formatPrice(total)}</dd>
        </div>
      </dl>

      {showCheckoutButton && subtotal > 0 && (
        <Link to="/checkout" className="mt-6 block">
          <Button fullWidth size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      )}
    </div>
  )
}
