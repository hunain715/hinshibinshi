import React from 'react'
import { Link } from 'react-router-dom'
import { base44 } from '@/api/base44Client'
import { Users, Search, Phone, Mail, ArrowRight, Loader2 } from 'lucide-react'

export default function Customers() {
  const [rows, setRows]     = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch]  = React.useState('')

  React.useEffect(() => {
    base44.entities.Customer.list('-created_date', 200)
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = rows.filter(c => {
    const q = search.toLowerCase()
    return (
      (c.full_name || '').toLowerCase().includes(q) ||
      (c.email     || '').toLowerCase().includes(q) ||
      (c.phone     || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto min-h-screen bg-surface-2">
      {/* Header */}
      <div className="mb-8">
        <span className="font-mono-body text-[11px] uppercase tracking-[0.3em] text-brand mb-3 block">CRM</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark">Customers</h1>
        <p className="text-muted text-sm mt-1">{rows.length} total customers</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-card">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl font-mono-body text-sm bg-surface-2 border border-gray-200 text-dark placeholder:text-gray-400 focus:border-brand outline-none transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-brand" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-6">
            <Users size={28} className="text-gray-400" />
          </div>
          <h3 className="font-heading text-xl font-bold text-dark mb-2">No customers yet</h3>
          <p className="text-muted text-sm">Customers appear here after they place an order.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-surface-2">
                <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-5 py-3 text-left">Name</th>
                <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-5 py-3 text-left">Email</th>
                <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-5 py-3 text-left">Phone</th>
                <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-5 py-3 text-left">Joined</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-surface-2 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                        <Users size={15} className="text-brand" />
                      </div>
                      <span className="font-semibold text-dark text-sm">{c.full_name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-muted">
                      <Mail size={13} />
                      {c.email || '—'}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-muted">
                      <Phone size={13} />
                      {c.phone || '—'}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">
                    {c.created_date ? new Date(c.created_date).toLocaleDateString('en-PK') : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      to={`/admin/customers/${c.id}`}
                      className="w-8 h-8 rounded-xl border border-gray-200 hover:border-brand hover:text-brand text-gray-400 flex items-center justify-center transition-colors ml-auto"
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
