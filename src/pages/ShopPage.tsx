import { ProductFiltersBar } from '@/components/products/ProductFilters'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Input } from '@/components/ui/Input'
import { fetchProducts } from '@/services/productService'
import type { Product, ProductFilters } from '@/types'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loadedFilterKey, setLoadedFilterKey] = useState<string | null>(null)

  const filterKey = searchParams.toString()
  const loading = loadedFilterKey !== filterKey

  const filters = useMemo<ProductFilters>(
    () => ({
      category: (searchParams.get('category') as ProductFilters['category']) || 'all',
      search: searchParams.get('search') ?? undefined,
      sort: (searchParams.get('sort') as ProductFilters['sort']) || 'featured',
      inStockOnly: searchParams.get('inStock') === 'true',
    }),
    [searchParams],
  )

  useEffect(() => {
    let cancelled = false
    fetchProducts(filters).then((data) => {
      if (!cancelled) {
        setProducts(data)
        setLoadedFilterKey(filterKey)
      }
    })
    return () => {
      cancelled = true
    }
  }, [filterKey, filters])

  const updateFilters = (newFilters: ProductFilters) => {
    const params = new URLSearchParams()
    if (newFilters.category && newFilters.category !== 'all') params.set('category', newFilters.category)
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.sort && newFilters.sort !== 'featured') params.set('sort', newFilters.sort)
    if (newFilters.inStockOnly) params.set('inStock', 'true')
    setSearchParams(params)
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-ocean-900">Shop All Tanks</h1>
          <p className="mt-2 text-ocean-600">
            Browse our full collection of premium aquariums and accessories
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-400" />
            <Input
              placeholder="Search products..."
              defaultValue={filters.search}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateFilters({ ...filters, search: (e.target as HTMLInputElement).value })
                }
              }}
              className="pl-11"
            />
          </div>
        </div>

        <ProductFiltersBar filters={filters} onChange={updateFilters} />

        <p className="mt-6 text-sm text-ocean-500">
          {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
        </p>

        <div className="mt-8">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  )
}
