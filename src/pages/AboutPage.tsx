import { Button } from '@/components/ui/Button'
import { SITE_NAME } from '@/lib/constants'
import { images } from '@/lib/images'
import { Award, Heart, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-ocean-800 to-ocean-950 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Our Story</h1>
          <p className="mt-6 text-lg text-ocean-200 leading-relaxed">
            Founded in 2008 by master aquarist Meng Tran, {SITE_NAME} began as a small workshop crafting
            custom glass aquariums for local hobbyists. Today, we serve aquarists worldwide with the same
            passion for quality and living art.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="rounded-2xl overflow-hidden shadow-card">
              <img
                src={images.about}
                alt="Aquarium craftsmanship at Meng's Fish Tank"
                className="w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-ocean-900">Crafted with Care</h2>
              <p className="mt-4 text-ocean-600 leading-relaxed">
                Every tank that leaves our San Diego facility is inspected by hand. We use only
                low-iron glass, premium silicone, and hardware tested for decades of use. Our team includes
                marine biologists, aquascapers, and glass artisans who understand what thriving ecosystems need.
              </p>
              <p className="mt-4 text-ocean-600 leading-relaxed">
                Whether you&apos;re starting your first betta bowl or building a 500-gallon reef masterpiece,
                we&apos;re here to guide you from design to delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-ocean-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            {[
              { icon: Users, stat: '10,000+', label: 'Happy Customers' },
              { icon: Award, stat: '17+', label: 'Years of Excellence' },
              { icon: Heart, stat: '100%', label: 'Passion for Aquatics' },
            ].map(({ icon: Icon, stat, label }) => (
              <div key={label} className="rounded-2xl bg-white p-8 shadow-soft">
                <Icon size={32} className="mx-auto text-ocean-600" />
                <p className="mt-4 font-display text-3xl font-bold text-ocean-900">{stat}</p>
                <p className="mt-1 text-ocean-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-ocean-900">Ready to start your aquatic journey?</h2>
        <Link to="/shop" className="mt-6 inline-block">
          <Button size="lg">Explore Our Collection</Button>
        </Link>
      </section>
    </div>
  )
}
