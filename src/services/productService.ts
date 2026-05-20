import { MOCK_PRODUCTS } from '@/data/products'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Product, ProductFilters } from '@/types'
import { filterProducts } from '@/lib/utils'

function mapDbRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string,
    longDescription: row.long_description as string,
    price: row.price as number,
    compareAtPrice: (row.compare_at_price as number) ?? undefined,
    category: row.category as Product['category'],
    imageUrl: row.image_url as string,
    gallery: (row.gallery as string[]) ?? [],
    capacityLiters: row.capacity_liters as number,
    dimensions: row.dimensions as string,
    material: row.material as string,
    inStock: row.in_stock as boolean,
    stockCount: row.stock_count as number,
    rating: row.rating as number,
    reviewCount: row.review_count as number,
    features: (row.features as string[]) ?? [],
    featured: row.featured as boolean,
    createdAt: row.created_at as string,
  }
}

export async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabase()!
    let query = supabase.from('products').select('*')

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }
    if (filters?.inStockOnly) {
      query = query.eq('in_stock', true)
    }

    const { data, error } = await query
    if (error) throw error

    const products = (data ?? []).map((row) => mapDbRow(row as Record<string, unknown>))
    return filterProducts(products, filters ?? {})
  }

  return filterProducts(MOCK_PRODUCTS, filters ?? {})
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured) {
    const supabase = getSupabase()!
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
    if (error || !data) return null
    return mapDbRow(data as Record<string, unknown>)
  }

  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null
}

export async function fetchFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await fetchProducts({ sort: 'featured' })
  return products.filter((p) => p.featured).slice(0, limit)
}
