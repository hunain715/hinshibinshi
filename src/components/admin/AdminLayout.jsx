import React from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, Layers3, ShoppingBag, Users, LogOut, ExternalLink, Menu, X, ChevronRight, Settings2 } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'

const NAV = [
  ['/admin',            'Dashboard', LayoutDashboard],
  ['/admin/products',   'Products',  Package],
  ['/admin/categories', 'Categories',Layers3],
  ['/admin/orders',     'Orders',    ShoppingBag],
  ['/admin/customers',  'Customers', Users],
  ['/admin/settings',   'Settings',  Settings2],
]

export default function AdminLayout() {
  const [open, setOpen] = React.useState(false)
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-surface-2 flex">

      {/* Sidebar */}
      <aside className={`
        fixed md:static z-50 inset-y-0 left-0 w-64
        bg-white border-r border-gray-200 flex flex-col
        transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link to="/admin">
              <img
                src="https://i.ibb.co/tTcb55FY/logo-png.png"
                alt="Hinshi Binshi"
                className="h-10 w-auto object-contain"
              />
              <span className="hidden font-heading font-black text-[14px] text-dark">HINSHI <span className="text-brand">BINSHI</span></span>
            </Link>
            <button
              className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-dark-3"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
          <p className="font-mono-body text-[9px] text-muted uppercase tracking-widest mt-1.5 ml-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="font-mono-body text-[9px] uppercase tracking-widest text-muted px-3 py-2">Main Menu</p>
          {NAV.map(([to, label, Icon]) => (
            <NavLink
              end={to === '/admin'}
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand text-white shadow-brand-sm'
                    : 'text-dark-3 hover:bg-surface-2 hover:text-dark'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={13} className="opacity-70" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-3 hover:bg-surface-2 hover:text-dark transition-colors"
          >
            <ExternalLink size={16} />
            View Store
          </Link>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-3 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile topbar */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-3 sticky top-0 z-30">
          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-dark-3"
          >
            <Menu size={18} />
          </button>
          <img
            src="https://i.ibb.co/tTcb55FY/logo-png.png"
            alt="Hinshi Binshi"
            className="h-9 w-auto object-contain"
          />
          <span className="hidden font-heading font-black text-sm text-dark">HINSHI <span className="text-brand">BINSHI</span></span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
