import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { PackageOpen } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 shadow-soft animate-pulse">
            <div className="aspect-[4/3] rounded-xl bg-ocean-100" />
            <div className="mt-4 h-4 w-1/3 rounded bg-ocean-100" />
            <div className="mt-2 h-5 w-2/3 rounded bg-ocean-100" />
            <div className="mt-4 h-4 w-full rounded bg-ocean-100" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageOpen size={48} className="text-ocean-300" />
        <h3 className="mt-4 font-display text-xl font-semibold text-ocean-800">No products found</h3>
        <p className="mt-2 text-ocean-500">Try adjusting your filters or search term.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
