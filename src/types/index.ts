export type ProductCategory =
  | 'freshwater'
  | 'saltwater'
  | 'nano'
  | 'custom'
  | 'accessories'

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  longDescription: string
  price: number
  compareAtPrice?: number
  category: ProductCategory
  imageUrl: string
  gallery: string[]
  capacityLiters: number
  dimensions: string
  material: string
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  features: string[]
  featured: boolean
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface CheckoutFormData extends ShippingAddress {
  shippingMethod: 'standard' | 'express' | 'white-glove'
  paymentMethod: 'card' | 'paypal'
  notes?: string
}

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: ShippingAddress
  shippingMethod: CheckoutFormData['shippingMethod']
  createdAt: string
}

export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
}

export interface NewsletterSubscription {
  email: string
}

export type ProductFilters = {
  category?: ProductCategory | 'all'
  search?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
}
