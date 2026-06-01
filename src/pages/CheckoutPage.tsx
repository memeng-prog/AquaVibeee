import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { SHIPPING_RATES } from '@/lib/constants'
import { createOrder } from '@/services/orderService'
import { formatPrice } from '@/lib/utils'
import type { CheckoutFormData } from '@/types'
import { CreditCard, Landmark, Lock, Wallet } from 'lucide-react'
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
  country: '',
  shippingMethod: 'standard',
  paymentMethod: 'card',
  notes: '',
}

const initialCard = {
  number: '',
  expiry: '',
  cvc: '',
}

const digitsOnly = (value: string) => value.replace(/\D/g, '')

const isPhilippines = (country: string) => /philippines/i.test(country.trim())

const COUNTRY_OPTIONS = [
  { value: '', label: 'Select country', dialCode: '' },
  { value: 'Philippines', label: 'Philippines (+63)', dialCode: '+63' },
  { value: 'United States', label: 'United States (+1)', dialCode: '+1' },
  { value: 'Canada', label: 'Canada (+1)', dialCode: '+1' },
  { value: 'Australia', label: 'Australia (+61)', dialCode: '+61' },
  { value: 'Singapore', label: 'Singapore (+65)', dialCode: '+65' },
  { value: 'Malaysia', label: 'Malaysia (+60)', dialCode: '+60' },
  { value: 'Indonesia', label: 'Indonesia (+62)', dialCode: '+62' },
]

function getDialCode(country: string) {
  return COUNTRY_OPTIONS.find((option) => option.value === country)?.dialCode || ''
}

const shippingFieldLabels: Record<keyof Pick<CheckoutFormData, 'fullName' | 'email' | 'phone' | 'addressLine1' | 'city' | 'postalCode' | 'country'>, string> = {
  fullName: 'Full Name',
  email: 'Email',
  phone: 'Phone',
  addressLine1: 'Address',
  city: 'City',
  postalCode: 'Postal Code',
  country: 'Country',
}

const cardFieldLabels: Record<keyof typeof initialCard, string> = {
  number: 'Card Number',
  expiry: 'Expiry',
  cvc: 'CVC',
}

function formatInvalidInputMessage(
  shippingErrors: Partial<Record<keyof CheckoutFormData, string>>,
  paymentErrors: typeof initialCard,
) {
  const invalidFields = [
    ...Object.entries(shippingErrors)
      .filter(([, message]) => Boolean(message))
      .map(([field, message]) => `${shippingFieldLabels[field as keyof typeof shippingFieldLabels]} (${message})`),
    ...Object.entries(paymentErrors)
      .filter(([, message]) => Boolean(message))
      .map(([field, message]) => `${cardFieldLabels[field as keyof typeof cardFieldLabels]} (${message})`),
  ]

  return invalidFields.length > 0
    ? `Invalid input: ${invalidFields.join(', ')}`
    : 'Invalid input: please check the form fields.'
}

function getShippingErrors(form: CheckoutFormData): Partial<Record<keyof CheckoutFormData, string>> {
  const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {}
  const phAddress = isPhilippines(form.country)
  const email = form.email.trim()

  if (!form.fullName.trim()) newErrors.fullName = 'Required'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) newErrors.email = 'Valid email required'
  if (!form.phone.trim()) newErrors.phone = 'Required'
  else if (phAddress && !/^\d{10}$/.test(form.phone)) newErrors.phone = 'Philippines numbers must be 10 digits after +63'
  else if (!phAddress && !/^\d{7,15}$/.test(form.phone)) newErrors.phone = 'Numbers only, 7-15 digits'
  if (!form.addressLine1.trim()) newErrors.addressLine1 = 'Required'
  if (!form.city.trim()) newErrors.city = 'Required'
  if (!form.postalCode.trim()) newErrors.postalCode = 'Required'
  else if (!/^\d{3,10}$/.test(form.postalCode)) newErrors.postalCode = 'Numbers only'
  if (!form.country.trim()) newErrors.country = 'Required'

  return newErrors
}

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState<CheckoutFormData>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({})
  const [card, setCard] = useState(initialCard)
  const [cardErrors, setCardErrors] = useState<typeof initialCard>({ ...initialCard })
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
    let nextValue =
      field === 'phone' || field === 'postalCode'
        ? digitsOnly(value)
        : value

    if (field === 'phone' && isPhilippines(form.country)) {
      // Keep the local part only; the +63 prefix is shown in the UI.
      if (nextValue.startsWith('0')) {
        nextValue = nextValue.slice(1)
      }
    }

    if (field === 'country' && value === 'Philippines' && form.phone.startsWith('0') && form.phone.length === 10) {
      nextValue = value
    }

    setForm((f) => ({ ...f, [field]: nextValue }))
    setErrors((e) => ({ ...e, [field]: undefined }))
    if (field === 'paymentMethod') {
      setCardErrors({ ...initialCard })
    }
  }

  const updateCard = (field: keyof typeof initialCard, value: string) => {
    const nextValue =
      field === 'number' || field === 'cvc'
        ? digitsOnly(value)
        : value

    setCard((prev) => ({ ...prev, [field]: nextValue }))
    setCardErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateShipping = (): Partial<Record<keyof CheckoutFormData, string>> => {
    const newErrors = getShippingErrors(form)
    setErrors(newErrors)
    return newErrors
  }

  const validateCard = (): typeof initialCard => {
    const newCardErrors = { ...initialCard }
    if (form.paymentMethod === 'card') {
      if (!card.number.trim()) newCardErrors.number = 'Required'
      else if (!/^\d{13,19}$/.test(card.number)) newCardErrors.number = '13-19 digits only'

      if (!card.expiry.trim()) newCardErrors.expiry = 'Required'
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) newCardErrors.expiry = 'MM/YY only'

      if (!card.cvc.trim()) newCardErrors.cvc = 'Required'
      else if (!/^\d{3,4}$/.test(card.cvc)) newCardErrors.cvc = '3-4 digits only'
    }

    return newCardErrors
  }

  const validate = () => {
    const shippingErrors = validateShipping()
    const nextCardErrors = validateCard()
    setCardErrors(nextCardErrors)

    return {
      shippingErrors,
      cardErrors: nextCardErrors,
      isValid: Object.keys(shippingErrors).length === 0 && Object.values(nextCardErrors).every((v) => !v),
    }
  }

  const handleContinueToDelivery = () => {
    const shippingErrors = validateShipping()
    if (Object.keys(shippingErrors).length === 0) {
      setStep(2)
      return
    }

    showToast(formatInvalidInputMessage(shippingErrors, initialCard), 'error')
  }

  const handleContinueToPayment = () => {
    setStep(3)
  }

  const shippingErrorsPreview = getShippingErrors(form)
  const canContinueToDelivery = Object.keys(shippingErrorsPreview).length === 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { shippingErrors, cardErrors: nextCardErrors, isValid } = validate()
    if (!isValid) {
      showToast(formatInvalidInputMessage(shippingErrors, nextCardErrors), 'error')
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
              type="button"
              disabled
              aria-disabled="true"
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors cursor-default ${
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
                  <Input label="Full Name *" required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} error={errors.fullName} />
                  <Input
                    label="Email *"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    onBlur={() => setErrors((prev) => ({ ...prev, email: getShippingErrors(form).email }))}
                    error={errors.email}
                  />
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-ocean-800" htmlFor="country">
                      Country *
                    </label>
                    <select
                      id="country"
                      required
                      value={form.country}
                      onChange={(e) => update('country', e.target.value)}
                      className={`w-full rounded-xl border border-ocean-200 bg-white px-4 py-2.5 text-ocean-900 transition-colors focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/20 ${errors.country ? 'border-coral-500 focus:border-coral-500 focus:ring-coral-500/20' : ''}`}
                    >
                      {COUNTRY_OPTIONS.map((option) => (
                        <option key={option.value || 'placeholder'} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.country && <p className="mt-1 text-sm text-coral-600">{errors.country}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-ocean-800" htmlFor="phone">
                      Phone *
                    </label>
                    <div className="flex">
                      {isPhilippines(form.country) && (
                        <span className="inline-flex items-center rounded-l-xl border border-r-0 border-ocean-200 bg-ocean-50 px-4 py-2.5 text-ocean-700">
                          {getDialCode(form.country)}
                        </span>
                      )}
                      <input
                        id="phone"
                        type="tel"
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={isPhilippines(form.country) ? 10 : 15}
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className={`w-full rounded-xl border border-ocean-200 bg-white px-4 py-2.5 text-ocean-900 placeholder:text-ocean-400 transition-colors focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/20 ${errors.phone ? 'border-coral-500 focus:border-coral-500 focus:ring-coral-500/20' : ''} ${isPhilippines(form.country) ? 'rounded-l-none' : ''}`}
                        placeholder={isPhilippines(form.country) ? '9123456789' : 'Phone number'}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-coral-600">{errors.phone}</p>}
                  </div>
                  <Input label="Address *" required value={form.addressLine1} onChange={(e) => update('addressLine1', e.target.value)} error={errors.addressLine1} className="sm:col-span-2" />
                  <Input label="Apartment, suite, etc. (optional)" value={form.addressLine2 ?? ''} onChange={(e) => update('addressLine2', e.target.value)} className="sm:col-span-2" />
                  <Input label="City *" required value={form.city} onChange={(e) => update('city', e.target.value)} error={errors.city} />
                  <Input
                    label="State (optional)"
                    value={form.state}
                    onChange={(e) => update('state', e.target.value)}
                    error={errors.state}
                  />
                  <Input
                    label="Postal Code *"
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={form.postalCode}
                    onChange={(e) => update('postalCode', e.target.value)}
                    error={errors.postalCode}
                  />
                </div>
                <Button type="button" onClick={handleContinueToDelivery} disabled={!canContinueToDelivery}>Continue to Delivery</Button>
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
                      {formatPrice(SHIPPING_RATES[key].price)}
                    </span>
                  </label>
                ))}
                <Textarea label="Order notes (optional)" value={form.notes ?? ''} onChange={(e) => update('notes', e.target.value)} />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" onClick={handleContinueToPayment}>Continue to Payment</Button>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="rounded-2xl bg-white p-6 shadow-soft space-y-4">
                <h2 className="font-display text-lg font-semibold text-ocean-900 flex items-center gap-2">
                  <Lock size={18} /> Payment
                </h2>
                <div className="grid gap-3">
                  {(['card', 'paypal', 'cod'] as const).map((method) => (
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
                      {method === 'card' && <CreditCard size={20} />}
                      {method === 'paypal' && <Landmark size={20} />}
                      {method === 'cod' && <Wallet size={20} />}
                      <span className="font-medium capitalize">
                        {method === 'card'
                          ? 'Credit / Debit Card'
                          : method === 'cod'
                          ? 'Cash on Delivery'
                          : 'Paypal, Gcash, Maya'}
                      </span>
                    </label>
                  ))}
                </div>
                {form.paymentMethod === 'card' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Card Number *"
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={card.number}
                      onChange={(e) => updateCard('number', e.target.value)}
                      error={cardErrors.number}
                      placeholder="4242 4242 4242 4242"
                      className="sm:col-span-2"
                    />
                    <Input
                      label="Expiry *"
                      required
                      value={card.expiry}
                      onChange={(e) => updateCard('expiry', e.target.value)}
                      error={cardErrors.expiry}
                      placeholder="MM/YY"
                    />
                    <Input
                      label="CVC *"
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={card.cvc}
                      onChange={(e) => updateCard('cvc', e.target.value)}
                      error={cardErrors.cvc}
                      placeholder="123"
                    />
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
