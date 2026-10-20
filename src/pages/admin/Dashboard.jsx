import React from 'react'
import { Link } from 'react-router-dom'
import { base44 } from '@/api/base44Client'
import { formatPrice } from '@/lib/admin'
import { Package, ShoppingBag, Users, TrendingUp, ArrowRight, ArrowUpRight, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react'

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-orange-100 text-orange-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

const STATUS_ICONS = {
  pending:    Clock,
  confirmed:  CheckCircle2,
  processing: Package,
  shipped:    Truck,
  delivered:  CheckCircle2,
  cancelled:  XCircle,
}

export default function Dashboard() {
  const [data, setData] = React.useState({ p: [], o: [], c: [] })

  React.useEffect(() => {
    Promise.all([
      base44.entities.Product.list(),
      base44.entities.Order.list(),
      base44.entities.Customer.list(),
    ]).then(([p, o, c]) => setData({ p, o, c }))
  }, [])

  const revenue      = data.o.reduce((s, o) => s + Number(o.total || 0), 0)
  const activeProds  = data.p.filter(p => p.status === 'active').length
  const newProds     = data.p.filter(p => p.condition === 'new').length
  const refurbProds  = data.p.filter(p => p.condition === 'refurbished').length
  const todayOrders  = data.o.filter(o => {
    const d = new Date(o.created_date)
    const t = new Date()
    return d.toDateString() === t.toDateString()
  }).length

  const stats = [
    { icon: Package,     label: 'Total Products',  value: data.p.length,      sub: `${activeProds} active`,    color: 'bg-orange-50 text-brand',   border: 'border-orange-100' },
    { icon: ShoppingBag, label: 'Total Orders',    value: data.o.length,      sub: `${todayOrders} today`,     color: 'bg-blue-50 text-blue-600',  border: 'border-blue-100' },
    { icon: Users,       label: 'Customers',       value: data.c.length,      sub: 'Registered buyers',        color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
    { icon: TrendingUp,  label: 'Total Revenue',   value: formatPrice(revenue), sub: 'All time',               color: 'bg-green-50 text-green-600', border: 'border-green-100' },
  ]

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-mono-body text-[10px] uppercase tracking-widest text-brand mb-1">Admin Panel</p>
            <h1 className="font-heading text-3xl font-black text-dark">Dashboard</h1>
            <p className="text-muted text-sm mt-1">
              {new Date().toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </p>
          </div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-brand-sm"
          >
            Manage Products <ArrowRight size={14} />
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className={`bg-white rounded-2xl border ${s.border} p-5 shadow-card`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                  <span className="font-mono-body text-[9px] uppercase tracking-widest text-muted">{s.sub}</span>
                </div>
                <p className="font-heading text-2xl font-black text-dark">{s.value}</p>
                <p className="font-mono-body text-[11px] text-muted mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Product breakdown + recent orders */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* Product breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h2 className="font-heading font-bold text-dark mb-5">Product Breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <span className="text-sm font-semibold text-dark">New Products</span>
                <span className="font-heading font-black text-brand text-lg">{newProds}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-sm font-semibold text-dark">Refurbished</span>
                <span className="font-heading font-black text-green-600 text-lg">{refurbProds}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-semibold text-dark">Active Listings</span>
                <span className="font-heading font-black text-dark text-lg">{activeProds}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-semibold text-dark">Total Stock</span>
                <span className="font-heading font-black text-dark text-lg">
                  {data.p.reduce((s, p) => s + (p.stock_quantity || 0), 0)}
                </span>
              </div>
            </div>
            <Link to="/admin/products" className="flex items-center gap-1 text-brand text-sm font-semibold mt-4 hover:underline">
              View all products <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-dark">Recent Orders</h2>
              <Link to="/admin/orders" className="text-brand text-sm font-semibold hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            {data.o.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingBag size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-muted text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.o.slice(0, 7).map(o => {
                  const StatusIcon = STATUS_ICONS[o.status] || Clock
                  return (
                    <Link
                      key={o.id}
                      to={`/admin/orders/${o.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                        <StatusIcon size={15} className="text-brand" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono-body text-sm font-bold text-dark">{o.order_number}</p>
                        <p className="text-[11px] text-muted truncate">{o.customer_name}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full font-mono-body capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                        {o.status}
                      </span>
                      <p className="font-heading font-bold text-dark text-sm w-24 text-right shrink-0">
                        {formatPrice(o.total)}
                      </p>
                      <ArrowRight size={14} className="text-gray-300 group-hover:text-brand transition-colors shrink-0" />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { to:'/admin/products',   icon:Package,     label:'Manage Products',   sub:'Add, edit, delete products',      color:'bg-orange-50 text-brand border-orange-100' },
            { to:'/admin/orders',     icon:ShoppingBag, label:'View Orders',       sub:'Track and update order status',   color:'bg-blue-50 text-blue-600 border-blue-100' },
            { to:'/admin/categories', icon:Package,     label:'Categories',        sub:'Manage product categories',       color:'bg-purple-50 text-purple-600 border-purple-100' },
          ].map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`bg-white rounded-2xl border p-5 hover:shadow-card-hover transition-all group flex items-center gap-4 ${item.color.split(' ')[2]}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color.split(' ').slice(0,2).join(' ')}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-dark group-hover:text-brand transition-colors">{item.label}</p>
                  <p className="text-[11px] text-muted">{item.sub}</p>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-brand transition-colors" />
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  )
}
