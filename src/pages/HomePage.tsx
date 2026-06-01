import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { Features } from '@/components/home/Features'
import { Hero } from '@/components/home/Hero'
import { NewsletterForm } from '@/components/home/NewsletterForm'
import { Testimonials } from '@/components/home/Testimonials'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Button } from '@/components/ui/Button'
import { fetchFeaturedProducts } from '@/services/productService'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '@/types'

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts(4)
      .then(setFeatured)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Hero />
      <CategoryShowcase />

      <section className="py-20 bg-sand-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-ocean-900">Featured Tanks</h2>
              <p className="mt-2 text-ocean-600">Hand-picked favorites from our collection</p>
            </div>
            <Link to="/shop" className="block">
              <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
                View All
              </Button>
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid products={featured} loading={loading} />
          </div>
        </div>
      </section>

      <Features />
      <Testimonials />

      <section className="py-20 bg-ocean-600">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Get Aquarium Tips & Exclusive Deals
          </h2>
          <p className="mt-3 text-ocean-100">
            Join our newsletter for care guides, new arrivals, and member-only discounts.
          </p>
          <div className="mt-8">
            <NewsletterForm variant="inline" />
          </div>
        </div>
      </section>
    </>
  )
}
