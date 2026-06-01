import { SITE_NAME } from '@/lib/constants'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { AlertTriangle, Fish, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from 'react'
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
  const { user, logout } = useAuth()
  const isStaffOrAdmin = user?.role === 'staff' || user?.role === 'admin'
  const logoTo = isStaffOrAdmin ? '/dashboard' : '/'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
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
        {isStaffOrAdmin ? (
          <div className="flex items-center gap-2.5 cursor-default select-none" aria-disabled="true">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 text-white shadow-md shadow-ocean-500/30">
              <Fish size={22} strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block text-left">
              <span className="font-display text-lg font-bold text-ocean-900 leading-tight">
                {SITE_NAME}
              </span>
              <span className="block text-xs text-ocean-500">Premium Aquariums</span>
            </div>
          </div>
        ) : (
          <Link to={logoTo} className="flex items-center gap-2.5 group">
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
        )}

        {!isStaffOrAdmin && (
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
        )}

        <div className="flex items-center gap-2">
          {!isStaffOrAdmin && (
            <>
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
                  <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {user ? (
            <div className="relative">
              <UserMenu
                userMenuOpen={userMenuOpen}
                setUserMenuOpen={setUserMenuOpen}
                logout={logout}
              />
            </div>
          ) : (
            <Link
              to="/login"
              className="p-2.5 rounded-xl text-ocean-600 hover:bg-ocean-100 transition-colors"
              aria-label="Login"
            >
              <User size={20} />
            </Link>
          )}

          <button
            className="md:hidden p-2.5 rounded-xl text-ocean-600 hover:bg-ocean-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && !isStaffOrAdmin && (
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

function UserMenu({
  userMenuOpen,
  setUserMenuOpen,
  logout,
}: {
  userMenuOpen: boolean
  setUserMenuOpen: Dispatch<SetStateAction<boolean>>
  logout: () => Promise<void>
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (e.target instanceof Node && !containerRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setUserMenuOpen(false)
    }

    if (userMenuOpen) {
      document.addEventListener('click', handleDocClick)
      document.addEventListener('keydown', handleKey)
    }

    return () => {
      document.removeEventListener('click', handleDocClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [userMenuOpen, setUserMenuOpen])

  return (
    <div ref={containerRef}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setUserMenuOpen((s) => !s)
        }}
        className="p-2.5 rounded-xl text-ocean-600 hover:bg-ocean-100 transition-colors"
        aria-expanded={userMenuOpen}
        aria-label="User menu"
      >
        <User size={20} />
      </button>

      {userMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
          <button
            onClick={async (e) => {
              e.stopPropagation()
              setLogoutConfirmOpen(true)
              setUserMenuOpen(false)
            }}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-ocean-50"
          >
            Logout
          </button>
        </div>
      )}

      {logoutConfirmOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-md animate-fade-in"
          onClick={() => setLogoutConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-float ring-1 ring-white/70 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-coral-500 to-coral-600 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                  <AlertTriangle size={22} strokeWidth={2.25} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Confirm logout</h3>
                  <p className="mt-1 text-sm text-white/85">Your current session will end.</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <p className="text-sm leading-6 text-ocean-600">
                Are you sure you want to logout?
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="rounded-xl border border-ocean-200 px-4 py-2.5 text-sm font-medium text-ocean-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-ocean-50 hover:shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await logout()
                      setLogoutConfirmOpen(false)
                      navigate('/login', { replace: true })
                    } catch (err) {
                      console.error('Logout failed', err)
                    }
                  }}
                  className="rounded-xl bg-coral-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-coral-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-500/30"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
