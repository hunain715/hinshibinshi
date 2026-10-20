import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import { getSettings } from '@/lib/siteSettings'

const links = [
  ['/','Home'],
  ['/products?category=printers','Printers'],
  ['/products?category=scanners','Scanners'],
  ['/products?category=terminals','POS Terminals'],
  ['/products?category=accessories','Accessories'],
  ['/contact','Contact'],
]

export default function Navbar() {
  const [open, setOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const { count } = useCart()
  const navigate = useNavigate()
  const { announcementActive, announcementText, announcementBg } = getSettings()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/products?search=${encodeURIComponent(query.trim())}`)
    setQuery('')
    setSearchOpen(false)
    setOpen(false)
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Announcement Bar */}
      {announcementActive && announcementText && (
        <div className={`${announcementBg} text-white text-center py-2 px-4 text-xs font-medium`}>
          {announcementText}
        </div>
      )}
      <div className="max-w-[1280px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            src="https://i.ibb.co/tTcb55FY/logo-png.png"
            alt="Hinshi Binshi"
            className="h-12 md:h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-pale text-brand font-semibold'
                    : 'text-dark-3 hover:bg-gray-50 hover:text-dark'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">

          {/* Search bar — desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products…"
                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-brand w-44 focus:w-56 transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </form>

          {/* Search icon — mobile */}
          <button
            className="md:hidden w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-dark-3 hover:bg-brand-pale hover:border-brand hover:text-brand transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={18} />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-dark-3 hover:bg-brand-pale hover:border-brand hover:text-brand transition-colors"
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-dark-3"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products…"
                className="input-white w-full pl-9 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-brand text-white rounded-xl text-sm font-semibold"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-brand-pale text-brand font-semibold' : 'text-dark-3 hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
