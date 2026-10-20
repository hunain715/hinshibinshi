import React from 'react'
import { Link } from 'react-router-dom'
import { base44 } from '@/api/base44Client'
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/admin'
import { ShoppingBag, ArrowRight, Loader2, Search, X } from 'lucide-react'

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-orange-100 text-orange-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

export default function Orders() {
  const [rows,    setRows]    = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [search,  setSearch]  = React.useState('')
  const [filter,  setFilter]  = React.useState('all')

  React.useEffect(() => {
    base44.entities.Order.list('-created_date', 500)
      .then(setRows)
      .finally(() => setLoading(false))
  }, [])

  const shown = rows.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (o.order_number || '').toLowerCase().includes(q) ||
      (o.customer_name || '').toLowerCase().includes(q) ||
      (o.phone || '').includes(q)
    return matchFilter && matchSearch
  })

  const totalRevenue = rows
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total || 0), 0)

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-mono-body text-[10px] uppercase tracking-widest text-brand mb-1">Admin</p>
            <h1 className="font-heading text-3xl font-black text-dark">Orders</h1>
            <p className="text-muted text-sm mt-1">{rows.length} total orders · Revenue: {formatPrice(totalRevenue)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search order #, customer name, phone…"
              className="input-white w-full pl-9 text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[['all','All'],['pending','Pending'],['processing','Processing'],['shipped','Shipped'],['delivered','Delivered'],['cancelled','Cancelled']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-colors ${
                  filter === val
                    ? 'bg-brand text-white shadow-brand-sm'
                    : 'bg-surface-2 text-dark-3 hover:bg-brand-pale hover:text-brand'
                }`}
              >
                {label}
              </button>
            ))}
            {(search || filter !== 'all') && (
              <button onClick={() => { setSearch(''); setFilter('all') }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-[12px] text-muted hover:text-brand">
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={28} className="animate-spin text-brand" />
          </div>
        ) : shown.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
            <ShoppingBag size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-dark mb-2">No orders found</h3>
            <p className="text-muted text-sm">Orders will appear here when customers checkout.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-surface-2">
                    <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-5 py-3 text-left">Order #</th>
                    <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-5 py-3 text-left">Customer</th>
                    <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-5 py-3 text-left">Date</th>
                    <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-5 py-3 text-left">Status</th>
                    <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-5 py-3 text-right">Total</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map(o => (
                    <tr key={o.id} className="border-b border-gray-50 hover:bg-surface-2 transition-colors">
                      <td className="px-5 py-4">
                        <Link to={`/admin/orders/${o.id}`} className="font-mono-body font-bold text-brand hover:underline text-sm">
                          {o.order_number}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-dark text-sm">{o.customer_name}</p>
                        <p className="text-muted text-[11px]">{o.phone}</p>
                      </td>
                      <td className="px-5 py-4 font-mono-body text-sm text-muted">
                        {o.created_date ? new Date(o.created_date).toLocaleDateString('en-PK') : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full font-mono-body capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-500'}`}>
                          {ORDER_STATUS_LABELS[o.status] || o.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-heading font-black text-dark text-sm">
                        {formatPrice(o.total)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link to={`/admin/orders/${o.id}`}
                          className="inline-flex items-center gap-1 text-[12px] text-brand font-semibold hover:underline">
                          View <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
