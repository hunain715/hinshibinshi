export const ORDER_STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled']
export const ORDER_STATUS_LABELS = { pending:'Pending', confirmed:'Confirmed', processing:'Processing', shipped:'Shipped', delivered:'Delivered', cancelled:'Cancelled' }
export function formatPrice(value) { return new Intl.NumberFormat('en-PK', { style:'currency', currency:'PKR', maximumFractionDigits:0 }).format(Number(value || 0)) }
export function stockStatus(qty) { const q = Number(qty || 0); if (q <= 0) return { tone:'out', label:'Out of stock' }; if (q < 10) return { tone:'low', label:'Low stock' }; return { tone:'in', label:'In stock' } }
export function slugify(v='') { return String(v).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') }
export function orderTotal(order) { return Number(order?.total ?? order?.subtotal ?? 0) }
