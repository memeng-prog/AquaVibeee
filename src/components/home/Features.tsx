import { Droplets, Hammer, Headphones, Leaf } from 'lucide-react'

const features = [
  {
    icon: Droplets,
    title: 'Crystal-Clear Glass',
    description: 'Low-iron ultra-clear panels for museum-quality viewing of your aquatic world.',
  },
  {
    icon: Hammer,
    title: 'Expert Craftsmanship',
    description: 'Hand-finished seams and precision engineering by aquarium specialists since 2008.',
  },
  {
    icon: Leaf,
    title: 'Eco-Conscious',
    description: 'Sustainable materials and energy-efficient equipment for responsible hobbyists.',
  },
  {
    icon: Headphones,
    title: 'Lifetime Support',
    description: 'Dedicated aquarist support team available 7 days a week for setup and care advice.',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-ocean-900 sm:text-4xl">
            Why Choose Us?
          </h2>
          <p className="mt-4 text-ocean-600">
            We combine artisan quality with modern technology to deliver aquariums that last generations.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-ocean-100 bg-sand-50 p-6 transition-all hover:border-ocean-200 hover:shadow-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-100 text-ocean-600 transition-colors group-hover:bg-ocean-600 group-hover:text-white">
                <Icon size={24} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ocean-900">{title}</h3>
              <p className="mt-2 text-sm text-ocean-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
