import type { Product, ProductFilters } from '@/types'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_RATES, TAX_RATE } from './constants'

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculateCartTotals(
  subtotal: number,
  shippingMethod: keyof typeof SHIPPING_RATES,
): { subtotal: number; shipping: number; tax: number; total: number; freeShipping: boolean } {
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const shipping = freeShipping ? 0 : SHIPPING_RATES[shippingMethod].price
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = Math.round((subtotal + shipping + tax) * 100) / 100

  return { subtotal, shipping, tax, total, freeShipping }
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products]

  if (filters.category && filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category)
  }

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
  }

  if (filters.minPrice != null) {
    result = result.filter((p) => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice != null) {
    result = result.filter((p) => p.price <= filters.maxPrice!)
  }

  if (filters.inStockOnly) {
    result = result.filter((p) => p.inStock)
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'featured':
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  }

  return result
}

export function generateOrderId(): string {
  return `MFT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
