import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { base44 } from '@/api/base44Client'
import { ArrowLeft, Loader2, Printer, Package, MapPin, Phone, Mail, CreditCard, MessageSquare } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { formatPrice, ORDER_STATUSES, ORDER_STATUS_LABELS } from '@/lib/admin'

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed:  'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-orange-100 text-orange-700 border-orange-200',
  shipped:    'bg-purple-100 text-purple-700 border-purple-200',
  delivered:  'bg-green-100 text-green-700 border-green-200',
  cancelled:  'bg-red-100 text-red-700 border-red-200',
}

function buildInvoiceHTML(order) {
  const rows = (order.items || []).map(it => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0">${it.title || ''}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:center">${it.quantity || 1}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right">${formatPrice(it.price)}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:bold">${formatPrice((it.price||0)*(it.quantity||1))}</td>
    </tr>`).join('')

  return `<!DOCTYPE html><html><head><title>${order.order_number} — Invoice</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:Arial,sans-serif;color:#111;max-width:760px;margin:40px auto;padding:0 24px;font-size:14px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #FF6B00}
    .logo{font-size:22px;font-weight:900;color:#111}
    .logo span{color:#FF6B00}
    .badge{display:inline-block;padding:4px 12px;border-radius:999px;background:#FFF3E8;color:#FF6B00;font-size:11px;font-weight:bold;text-transform:uppercase;border:1px solid #FFD4AA}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th{padding:10px 8px;border-bottom:2px solid #111;text-align:left;font-size:11px;text-transform:uppercase;color:#666}
    .totals-table{margin-top:16px;margin-left:auto;width:260px}
    .totals-table td{padding:6px 8px;font-size:13px}
    .grand td{font-weight:bold;font-size:15px;border-top:2px solid #111;padding-top:10px;color:#FF6B00}
    .section{margin-top:20px;padding:16px;background:#F9FAFB;border-radius:8px}
    .label{font-size:10px;text-transform:uppercase;color:#999;margin-bottom:4px}
    .footer{margin-top:40px;text-align:center;color:#999;font-size:12px;border-top:1px solid #eee;padding-top:16px}
  </style></head><body>
  <div class="header">
    <div>
      <div class="logo">HINSHI <span>BINSHI</span></div>
      <div style="color:#666;font-size:12px;margin-top:4px">Point of Sales — Software & Hardware</div>
      <div style="color:#666;font-size:12px">binshihinshi@gmail.com · 0336-3376630</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:20px;font-weight:900">INVOICE</div>
      <div style="color:#666;margin-top:4px">${order.order_number}</div>
      <div style="color:#666;font-size:12px">${order.created_date ? new Date(order.created_date).toLocaleDateString('en-PK',{year:'numeric',month:'long',day:'numeric'}) : ''}</div>
      <div style="margin-top:6px"><span class="badge">${ORDER_STATUS_LABELS[order.status]||order.status}</span></div>
    </div>
  </div>
  <div class="section">
    <div class="label">Bill To</div>
    <div style="font-weight:bold;margin-bottom:4px">${order.customer_name||''}</div>
    <div style="color:#666">${[order.phone,order.email,order.shipping_address,order.city].filter(Boolean).join(' · ')}</div>
  </div>
  <table style="margin-top:20px">
    <thead><tr><th>Product</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <table class="totals-table">
    <tr><td style="color:#666">Subtotal</td><td style="text-align:right">${formatPrice(order.subtotal)}</td></tr>
    <tr><td style="color:#666">Shipping</td><td style="text-align:right">${order.shipping > 0 ? formatPrice(order.shipping) : 'Free'}</td></tr>
    <tr class="grand"><td>Total (PKR)</td><td style="text-align:right">${formatPrice(order.total)}</td></tr>
  </table>
  <div class="section" style="margin-top:20px">
    <span class="label">Payment: </span>${order.payment_method||'—'}
    ${order.notes ? `&nbsp;&nbsp;·&nbsp;&nbsp;<span class="label">Notes: </span>${order.notes}` : ''}
  </div>
  <div class="footer">Thank you for your business! · Hinshi Binshi · Karachi, Pakistan</div>
  </body></html>`
}

export default function OrderDetail() {
  const { id } = useParams()
  const [order,    setOrder]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [toCancel, setToCancel] = useState(false)
  const [saving,   setSaving]   = useState(false)

  const load = async () => {
    setLoading(true)
    try { setOrder(await base44.entities.Order.get(id)) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  const changeStatus = async (status) => {
    if (status === 'cancelled') { setToCancel(true); return }
    setSaving(true)
    try { await base44.entities.Order.update(order.id, { status }); await load() }
    catch { alert('Failed to update status.') }
    finally { setSaving(false) }
  }

  const confirmCancel = async () => {
    try { await base44.entities.Order.update(order.id, { status: 'cancelled' }); setToCancel(false); await load() }
    catch { alert('Failed to cancel order.') }
  }

  const printInvoice = () => {
    const w = window.open('', '_blank')
    if (!w) { alert('Please allow popups to print.'); return }
    w.document.write(buildInvoiceHTML(order))
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 400)
  }

  if (loading) return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-brand" />
    </div>
  )

  if (!order) return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center">
      <div className="text-center">
        <Package size={40} className="text-gray-300 mx-auto mb-4" />
        <p className="text-muted mb-4">Order not found.</p>
        <Link to="/admin/orders" className="text-brand font-semibold hover:underline">← Back to Orders</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="max-w-[1100px] mx-auto px-6 py-8">

        {/* Back + header */}
        <Link to="/admin/orders" className="inline-flex items-center gap-2 text-muted text-sm hover:text-brand transition-colors mb-6">
          <ArrowLeft size={15} /> Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <p className="font-mono-body text-[10px] uppercase tracking-widest text-brand mb-1">Order Detail</p>
            <h1 className="font-heading text-3xl font-black text-dark">{order.order_number}</h1>
            <p className="text-muted text-sm mt-1">
              {order.created_date ? new Date(order.created_date).toLocaleString('en-PK', { dateStyle:'long', timeStyle:'short' }) : ''}
            </p>
          </div>
          <button
            onClick={printInvoice}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-semibold transition-colors shadow-brand-sm"
          >
            <Printer size={15} /> Print Invoice
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Items */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
              <h2 className="font-heading font-bold text-dark mb-4 flex items-center gap-2">
                <Package size={17} className="text-brand" /> Ordered Items
              </h2>
              <div className="space-y-3">
                {(order.items || []).map((it, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-surface-2 rounded-xl">
                    {it.image && (
                      <img src={it.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark text-sm line-clamp-1">{it.title}</p>
                      <p className="text-muted text-[11px]">{formatPrice(it.price)} × {it.quantity}</p>
                    </div>
                    <p className="font-heading font-black text-dark text-sm shrink-0">
                      {formatPrice((it.price || 0) * (it.quantity || 1))}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-5 border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted">
                  <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted">
                  <span>Shipping</span>
                  <span className={order.shipping > 0 ? '' : 'text-green-600 font-semibold'}>
                    {order.shipping > 0 ? formatPrice(order.shipping) : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between font-heading font-black text-dark text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-brand">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment + notes */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                    <CreditCard size={16} className="text-brand" />
                  </div>
                  <div>
                    <p className="font-mono-body text-[10px] uppercase tracking-wider text-muted">Payment Method</p>
                    <p className="font-semibold text-dark text-sm mt-0.5">{order.payment_method || '—'}</p>
                  </div>
                </div>
                {order.notes && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                      <MessageSquare size={16} className="text-brand" />
                    </div>
                    <div>
                      <p className="font-mono-body text-[10px] uppercase tracking-wider text-muted">Notes</p>
                      <p className="font-semibold text-dark text-sm mt-0.5">{order.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right col */}
          <div className="space-y-5">

            {/* Status */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
              <h2 className="font-heading font-bold text-dark mb-4">Order Status</h2>
              <div className="mb-3">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold border ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {ORDER_STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <select
                value={order.status}
                onChange={e => changeStatus(e.target.value)}
                disabled={saving || order.status === 'cancelled'}
                className="input-white w-full text-sm mt-2"
              >
                {ORDER_STATUSES.map(s => (
                  <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                ))}
              </select>
              {saving && (
                <div className="flex items-center gap-2 mt-2 text-muted text-sm">
                  <Loader2 size={13} className="animate-spin" /> Updating…
                </div>
              )}
            </div>

            {/* Customer */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
              <h2 className="font-heading font-bold text-dark mb-4">Customer Details</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                    <span className="text-brand font-black text-sm">{(order.customer_name||'?')[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{order.customer_name}</p>
                    <p className="text-muted text-[11px]">{order.city}</p>
                  </div>
                </div>
                {order.phone && (
                  <a href={`tel:${order.phone}`} className="flex items-center gap-2.5 text-sm text-dark-3 hover:text-brand transition-colors">
                    <Phone size={14} className="text-brand" /> {order.phone}
                  </a>
                )}
                {order.email && (
                  <a href={`mailto:${order.email}`} className="flex items-center gap-2.5 text-sm text-dark-3 hover:text-brand transition-colors">
                    <Mail size={14} className="text-brand" /> {order.email}
                  </a>
                )}
                {order.shipping_address && (
                  <div className="flex items-start gap-2.5 text-sm text-dark-3">
                    <MapPin size={14} className="text-brand shrink-0 mt-0.5" />
                    <span>{order.shipping_address}, {order.city}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <ConfirmDialog
        open={toCancel}
        title="Cancel this order?"
        message={`Order ${order.order_number} will be marked as cancelled. This cannot be undone.`}
        confirmLabel="Yes, Cancel Order"
        onConfirm={confirmCancel}
        onCancel={() => setToCancel(false)}
      />
    </div>
  )
}
