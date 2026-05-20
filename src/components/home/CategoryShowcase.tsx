import { categoryImage } from '@/lib/images'
import type { ProductCategory } from '@/types'
import { Box, Droplet, Sparkles, Waves, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'

const categories: {
  slug: ProductCategory
  name: string
  description: string
  icon: typeof Waves
  color: string
}[] = [
  {
    slug: 'saltwater',
    name: 'Saltwater',
    description: 'Reef-ready systems',
    icon: Waves,
    color: 'from-ocean-600 to-ocean-800',
  },
  {
    slug: 'freshwater',
    name: 'Freshwater',
    description: 'Planted & aquascape',
    icon: Droplet,
    color: 'from-emerald-600 to-teal-800',
  },
  {
    slug: 'nano',
    name: 'Nano Tanks',
    description: 'Compact perfection',
    icon: Box,
    color: 'from-cyan-600 to-ocean-800',
  },
  {
    slug: 'custom',
    name: 'Custom',
    description: 'Your vision, built',
    icon: Sparkles,
    color: 'from-violet-600 to-ocean-900',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    description: 'Filters, LEDs & more',
    icon: Wrench,
    color: 'from-slate-600 to-ocean-900',
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-ocean-900">Shop by Category</h2>
            <p className="mt-2 text-ocean-600">Find the perfect tank for your aquatic journey</p>
          </div>
          <Link to="/shop" className="hidden sm:inline text-sm font-semibold text-ocean-600 hover:text-ocean-800">
            View all →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-[4/5]"
            >
              <img
                src={categoryImage(cat.slug)}
                alt={`${cat.name} aquarium category`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
              <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                <cat.icon size={24} className="mb-2 opacity-90" />
                <h3 className="font-display text-lg font-bold">{cat.name}</h3>
                <p className="text-sm text-white/80">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
