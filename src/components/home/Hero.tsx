import { Button } from '@/components/ui/Button'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants'
import { images } from '@/lib/images'
import { ArrowRight, Award, Shield, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-950 text-white">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-ocean-400 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-ocean-500 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <Award size={16} className="text-ocean-300" />
              Trusted by 10,000+ aquarists worldwide
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Craft Your Perfect
              <span className="block text-ocean-300">Underwater Paradise</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ocean-200 leading-relaxed">
              {SITE_TAGLINE}. Discover premium fish tanks, expert-crafted custom builds, and
              everything your aquatic ecosystem needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                  Shop Collection
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Our Story
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { icon: Shield, label: '5-Year Warranty' },
                { icon: Truck, label: 'Free Shipping $299+' },
                { icon: Award, label: 'Expert Support' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center sm:items-start gap-2">
                  <Icon size={22} className="text-ocean-300" />
                  <span className="text-xs sm:text-sm text-ocean-200 text-center sm:text-left">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-float">
              <img
                src={images.hero}
                alt={`${SITE_NAME} premium reef aquarium`}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/60 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl glass px-6 py-4 shadow-float">
              <p className="text-3xl font-display font-bold text-ocean-900">4.9★</p>
              <p className="text-sm text-ocean-600">Average customer rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-sand-50 to-transparent" />
    </section>
  )
}
