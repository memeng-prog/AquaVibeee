import { CATEGORY_OPTIONS } from '@/lib/constants'
import type { ProductFilters as Filters } from '@/types'
import { SlidersHorizontal } from 'lucide-react'

interface ProductFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function ProductFiltersBar({ filters, onChange }: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-soft lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2 text-ocean-700">
        <SlidersHorizontal size={18} />
        <span className="text-sm font-semibold">Filters</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={filters.category ?? 'all'}
          onChange={(e) =>
            onChange({ ...filters, category: e.target.value as Filters['category'] })
          }
          className="rounded-xl border border-ocean-200 px-4 py-2 text-sm text-ocean-800 focus:outline-none focus:ring-2 focus:ring-ocean-500/20"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={filters.sort ?? 'featured'}
          onChange={(e) =>
            onChange({ ...filters, sort: e.target.value as Filters['sort'] })
          }
          className="rounded-xl border border-ocean-200 px-4 py-2 text-sm text-ocean-800 focus:outline-none focus:ring-2 focus:ring-ocean-500/20"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="newest">Newest</option>
        </select>

        <label className="flex items-center gap-2 rounded-xl border border-ocean-200 px-4 py-2 text-sm text-ocean-800 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly ?? false}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="rounded border-ocean-300 text-ocean-600 focus:ring-ocean-500"
          />
          In stock only
        </label>
      </div>
    </div>
  )
}
