import { SITE_NAME } from '@/lib/constants'
import { useCart } from '@/context/CartContext'
import { Fish, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const { itemCount } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
      setMobileOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-ocean-100/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 text-white shadow-md shadow-ocean-500/30 transition-transform group-hover:scale-105">
            <Fish size={22} strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block text-left">
            <span className="font-display text-lg font-bold text-ocean-900 leading-tight">
              {SITE_NAME}
            </span>
            <span className="block text-xs text-ocean-500">Premium Aquariums</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-ocean-100 text-ocean-800'
                    : 'text-ocean-600 hover:bg-ocean-50 hover:text-ocean-800',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2 animate-fade-in">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tanks..."
                className="w-40 sm:w-56 rounded-xl border border-ocean-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500/30"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-ocean-500 hover:text-ocean-700"
              >
                <X size={20} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-xl text-ocean-600 hover:bg-ocean-100 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}

          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl text-ocean-600 hover:bg-ocean-100 transition-colors"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-[10px] font-bold text-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2.5 rounded-xl text-ocean-600 hover:bg-ocean-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-ocean-100 px-4 py-4 animate-fade-in">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-lg px-4 py-3 text-sm font-medium',
                  isActive ? 'bg-ocean-100 text-ocean-800' : 'text-ocean-600',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
