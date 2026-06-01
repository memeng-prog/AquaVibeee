import { MOCK_PRODUCTS } from '@/data/products'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { normalizeProductImageUrl, productGallery } from '@/lib/images'
import type { Product, ProductFilters } from '@/types'
import { filterProducts } from '@/lib/utils'

function mapDbRow(row: Record<string, unknown>): Product {
  const name = (row.name as string) || 'Untitled Product'
  const id = (row.id as string) || Math.random().toString(36).slice(2)
  const slug = (row.slug as string) || `${name.toLowerCase().replace(/\s+/g, '-')}-${id.slice(0, 6)}`
  const createdAt = (row.created_at as string) || new Date().toISOString()

  return {
    id,
    slug,
    name,
    description: (row.description as string) || 'New aquarium product.',
    longDescription:
      (row.long_description as string) || (row.description as string) || 'New aquarium product.',
    price: Number(row.price ?? 0),
    compareAtPrice: (row.compare_at_price as number) ?? undefined,
    category: ((row.category as Product['category']) || 'accessories') as Product['category'],
    imageUrl: normalizeProductImageUrl(row.image_url as string | undefined, slug),
    gallery: (row.gallery as string[]) ?? productGallery(slug),
    capacityLiters: Number(row.capacity_liters ?? 0),
    dimensions: (row.dimensions as string) || 'N/A',
    material: (row.material as string) || 'N/A',
    inStock: (row.in_stock as boolean) ?? true,
    stockCount: Number(row.stock_count ?? 1),
    rating: Number(row.rating ?? 4.5),
    reviewCount: Number(row.review_count ?? 0),
    features: (row.features as string[]) ?? [],
    featured: (row.featured as boolean) ?? true,
    createdAt,
  }
}

export async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = getSupabase()!
      let query = supabase.from('products').select('*')

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }
      if (filters?.inStockOnly) {
        query = query.eq('in_stock', true)
      }

      const { data, error } = await query
      if (error) {
        console.error('fetchProducts DB error:', error)
        return filterProducts(MOCK_PRODUCTS, filters ?? {})
      }

      const products = (data ?? []).map((row) => mapDbRow(row as Record<string, unknown>))
      if (products.length === 0) {
        return filterProducts(MOCK_PRODUCTS, filters ?? {})
      }

      return filterProducts(products, filters ?? {})
    } catch (err) {
      console.error('fetchProducts unexpected error:', err)
      return filterProducts(MOCK_PRODUCTS, filters ?? {})
    }
  }

  return filterProducts(MOCK_PRODUCTS, filters ?? {})
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured) {
    try {
      const supabase = getSupabase()!

      // Preferred path when products.slug exists in DB schema.
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
      if (!error && data) {
        return mapDbRow(data as Record<string, unknown>)
      }

      // Fallback for minimal schemas that don't have/maintain slug.
      const { data: allRows, error: allError } = await supabase.from('products').select('*')
      if (allError) {
        console.error('fetchProductBySlug fallback DB error:', allError)
        return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null
      }

      const mapped = (allRows ?? []).map((row) => mapDbRow(row as Record<string, unknown>))
      // Final fallback: support legacy/mock slugs (e.g. azure-reef-120) even when DB has sparse rows.
      return mapped.find((p) => p.slug === slug) ?? MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null
    } catch (err) {
      console.error('fetchProductBySlug unexpected error:', err)
      return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null
    }
  }

  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null
}

export async function fetchFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await fetchProducts({ sort: 'featured' })
  const featured = products.filter((p) => p.featured)
  // Fallback: if nothing is explicitly featured, show the first products
  return (featured.length ? featured : products).slice(0, limit)
}
