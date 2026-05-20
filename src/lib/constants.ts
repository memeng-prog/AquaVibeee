import type { ProductCategory } from '@/types'

export const SITE_NAME = "Meng's Fish Tank"
export const SITE_TAGLINE = 'Premium aquariums crafted for thriving underwater worlds'
export const SITE_EMAIL = 'hello@mengsfishtank.com'
export const SITE_PHONE = '+1 (555) 234-5678'
export const SITE_ADDRESS = '2847 Coral Bay Drive, San Diego, CA 92101'

export const TAX_RATE = 0.0825
export const FREE_SHIPPING_THRESHOLD = 299

export const SHIPPING_RATES = {
  standard: { label: 'Standard (5–7 days)', price: 24.99, days: '5–7 business days' },
  express: { label: 'Express (2–3 days)', price: 49.99, days: '2–3 business days' },
  'white-glove': {
    label: 'White Glove Setup',
    price: 149.99,
    days: 'Professional delivery & placement',
  },
} as const

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  freshwater: 'Freshwater',
  saltwater: 'Saltwater',
  nano: 'Nano Tanks',
  custom: 'Custom Builds',
  accessories: 'Accessories',
}

export const CATEGORY_OPTIONS: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Products' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value: value as ProductCategory,
    label,
  })),
]
