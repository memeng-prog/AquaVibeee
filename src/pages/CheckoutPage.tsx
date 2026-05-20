import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { SHIPPING_RATES } from '@/lib/constants'
import { createOrder } from '@/services/orderService'
import type { CheckoutFormData } from '@/types'
import { CreditCard, Lock } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const initialForm: CheckoutFormData = {
  fullName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  shippingMethod: 'standard',
  paymentMethod: 'card',
  notes: '',
}

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState<CheckoutFormData>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ocean-900">Nothing to checkout</h1>
        <Link to="/shop" className="mt-4 inline-block text-ocean-600 hover:underline">
          Return to shop
        </Link>
      </div>
    )
  }

  const update = (field: keyof CheckoutFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const validate = (): boolean => {
    const newErrors: typeof errors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email required'
    if (!form.phone.trim()) newErrors.phone = 'Required'
    if (!form.addressLine1.trim()) newErrors.addressLine1 = 'Required'
    if (!form.city.trim()) newErrors.city = 'Required'
    if (!form.state.trim()) newErrors.state = 'Required'
    if (!form.postalCode.trim()) newErrors.postalCode = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      showToast('Please fix the errors in the form', 'error')
      return
    }

    setLoading(true)
    try {
      const order = await createOrder(items, form)
      clearCart()
      navigate(`/checkout/success?order=${order.id}`)
    } catch {
      showToast('Checkout failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-ocean-900">Checkout</h1>

        <div className="mt-4 flex gap-2">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                step === s ? 'bg-ocean-600 text-white' : 'bg-ocean-100 text-ocean-600'
              }`}
            >
              {s === 1 ? 'Shipping' : s === 2 ? 'Delivery' : 'Payment'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {step === 1 && (
              <section className="rounded-2xl bg-white p-6 shadow-soft space-y-4">
                <h2 className="font-display text-lg font-semibold text-ocean-900">Shipping Address</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Full Name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} error={errors.fullName} />
                  <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
                  <Input label="Phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} error={errors.phone} className="sm:col-span-2" />
                  <Input label="Address" value={form.addressLine1} onChange={(e) => update('addressLine1', e.target.value)} error={errors.addressLine1} className="sm:col-span-2" />
                  <Input label="Apartment, suite, etc. (optional)" value={form.addressLine2 ?? ''} onChange={(e) => update('addressLine2', e.target.value)} className="sm:col-span-2" />
                  <Input label="City" value={form.city} onChange={(e) => update('city', e.target.value)} error={errors.city} />
                  <Input label="State" value={form.state} onChange={(e) => update('state', e.target.value)} error={errors.state} />
                  <Input label="Postal Code" value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} error={errors.postalCode} />
                  <Input label="Country" value={form.country} onChange={(e) => update('country', e.target.value)} />
                </div>
                <Button type="button" onClick={() => setStep(2)}>Continue to Delivery</Button>
              </section>
            )}

            {step === 2 && (
              <section className="rounded-2xl bg-white p-6 shadow-soft space-y-4">
                <h2 className="font-display text-lg font-semibold text-ocean-900">Delivery Method</h2>
                {(Object.keys(SHIPPING_RATES) as Array<keyof typeof SHIPPING_RATES>).map((key) => (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-colors ${
                      form.shippingMethod === key
                        ? 'border-ocean-500 bg-ocean-50'
                        : 'border-ocean-100 hover:border-ocean-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={form.shippingMethod === key}
                        onChange={() => update('shippingMethod', key)}
                        className="text-ocean-600"
                      />
                      <div>
                        <p className="font-semibold text-ocean-900">{SHIPPING_RATES[key].label}</p>
                        <p className="text-sm text-ocean-500">{SHIPPING_RATES[key].days}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-ocean-800">
                      ${SHIPPING_RATES[key].price}
                    </span>
                  </label>
                ))}
                <Textarea label="Order notes (optional)" value={form.notes ?? ''} onChange={(e) => update('notes', e.target.value)} />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" onClick={() => setStep(3)}>Continue to Payment</Button>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="rounded-2xl bg-white p-6 shadow-soft space-y-4">
                <h2 className="font-display text-lg font-semibold text-ocean-900 flex items-center gap-2">
                  <Lock size={18} /> Payment (Demo)
                </h2>
                <p className="text-sm text-ocean-500">
                  This is a demo checkout. No real payment is processed. Connect Stripe via Supabase Edge Functions for production.
                </p>
                <div className="grid gap-3">
                  {(['card', 'paypal'] as const).map((method) => (
                    <label
                      key={method}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 ${
                        form.paymentMethod === method ? 'border-ocean-500 bg-ocean-50' : 'border-ocean-100'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={form.paymentMethod === method}
                        onChange={() => update('paymentMethod', method)}
                      />
                      <CreditCard size={20} />
                      <span className="font-medium capitalize">{method === 'card' ? 'Credit / Debit Card' : 'PayPal'}</span>
                    </label>
                  ))}
                </div>
                {form.paymentMethod === 'card' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Card Number" placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
                    <Input label="Expiry" placeholder="MM/YY" />
                    <Input label="CVC" placeholder="123" />
                  </div>
                )}
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit" loading={loading} size="lg">
                    Place Order
                  </Button>
                </div>
              </section>
            )}
          </div>

          <div>
            <CartSummary subtotal={subtotal} shippingMethod={form.shippingMethod} showCheckoutButton={false} />
            <ul className="mt-6 space-y-2">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between text-sm text-ocean-600">
                  <span className="truncate pr-2">{product.name} × {quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </div>
    </div>
  )
}
