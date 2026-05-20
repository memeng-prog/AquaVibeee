import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE,
  SITE_TAGLINE,
} from '@/lib/constants'
import { Fish, Mail, MapPin, Phone, Share2, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NewsletterForm } from '@/components/home/NewsletterForm'

export function Footer() {
  return (
    <footer className="bg-ocean-950 text-ocean-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-600">
                <Fish size={22} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">{SITE_NAME}</span>
            </Link>
            <p className="mt-4 text-sm text-ocean-300 leading-relaxed">{SITE_TAGLINE}</p>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-800 text-ocean-300 hover:bg-ocean-700 hover:text-white transition-colors"
                aria-label="Social media"
              >
                <Share2 size={18} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-800 text-ocean-300 hover:bg-ocean-700 hover:text-white transition-colors"
                aria-label="Video channel"
              >
                <Video size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-ocean-300">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=freshwater" className="hover:text-white transition-colors">Freshwater</Link></li>
              <li><Link to="/shop?category=saltwater" className="hover:text-white transition-colors">Saltwater</Link></li>
              <li><Link to="/shop?category=nano" className="hover:text-white transition-colors">Nano Tanks</Link></li>
              <li><Link to="/shop?category=custom" className="hover:text-white transition-colors">Custom Builds</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-ocean-300">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Warranty</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Stay Updated</h3>
            <NewsletterForm variant="footer" />
            <div className="mt-6 space-y-3 text-sm text-ocean-300">
              <a href={`mailto:${SITE_EMAIL}`} className="flex items-center gap-2 hover:text-white">
                <Mail size={16} /> {SITE_EMAIL}
              </a>
              <a href={`tel:${SITE_PHONE}`} className="flex items-center gap-2 hover:text-white">
                <Phone size={16} /> {SITE_PHONE}
              </a>
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" /> {SITE_ADDRESS}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-ocean-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-ocean-400">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <p>Supabase-ready · Built with React & TypeScript</p>
        </div>
      </div>
    </footer>
  )
}
