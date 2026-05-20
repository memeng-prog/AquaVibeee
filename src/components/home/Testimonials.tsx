import { StarRating } from '@/components/ui/StarRating'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Reef Enthusiast',
    text: 'My Azure Reef 120 is absolutely stunning. The glass clarity is unmatched and Meng\'s team helped me through the entire setup process.',
    rating: 5,
  },
  {
    name: 'Marcus Rivera',
    role: 'Aquascaper',
    text: 'The Serenity Fresh 75 transformed my living room. Professional packaging, flawless delivery, and the cabinet quality exceeded expectations.',
    rating: 5,
  },
  {
    name: 'Emily Watson',
    role: 'First-time Hobbyist',
    text: 'Started with the Coral Mini 20 and fell in love. Perfect for my desk shrimp colony. Customer support answered every question patiently.',
    rating: 4.9,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-ocean-50 to-sand-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-ocean-900 sm:text-4xl">
            Loved by Aquarists
          </h2>
          <p className="mt-4 text-ocean-600">Join thousands of happy customers building their dream tanks.</p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="relative rounded-2xl bg-white p-8 shadow-soft"
            >
              <Quote size={32} className="absolute right-6 top-6 text-ocean-100" />
              <StarRating rating={t.rating} size="md" />
              <p className="mt-4 text-ocean-700 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <footer className="mt-6 border-t border-ocean-100 pt-4">
                <cite className="not-italic font-semibold text-ocean-900">{t.name}</cite>
                <p className="text-sm text-ocean-500">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
