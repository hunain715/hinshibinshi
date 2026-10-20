import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/lib/CartContext'
import { formatPrice } from '@/lib/admin'
import { base44 } from '@/api/base44Client'
import { getSettings } from '@/lib/siteSettings'
import { ChevronLeft, ShoppingCart, CheckCircle, Loader2, MapPin, Phone, Mail, MessageSquare } from 'lucide-react'

function CheckoutField({ id, label, required, type = 'text', form, setForm, errors, setErrors, ...rest }) {
  return (
    <div>
      <label className="block font-mono-body text-[11px] uppercase tracking-wider text-dark-3 mb-1.5">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={form[id]}
        onChange={e => { setForm(current => ({ ...current, [id]: e.target.value })); setErrors(current => ({ ...current, [id]: '' })) }}
        className={`input-white w-full text-sm ${errors[id] ? 'border-red-400 focus:border-red-500' : ''}`}
        {...rest}
      />
      {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
    </div>
  )
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const nav = useNavigate()
  const settings = getSettings()
  const isFree = settings.shippingFree || (settings.shippingFreeThreshold > 0 && subtotal >= settings.shippingFreeThreshold)
  const shippingCost = isFree ? 0 : (settings.shippingCharge || 0)
  const total = subtotal + shippingCost
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: '', city: 'Karachi',
    payment_method: 'Cash on Delivery', notes: '',
  })
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Full name is required'
    if (!form.phone.trim())   e.phone   = 'Phone number is required'
    if (!form.address.trim()) e.address = 'Shipping address is required'
    if (!form.city.trim())    e.city    = 'City is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async e => {
    e.preventDefault()
    if (!items.length || !validate()) return
    setBusy(true)
    try {
      const order = await base44.entities.Order.create({
        order_number:     `HB-${Date.now().toString().slice(-6)}`,
        customer_name:    form.name,
        phone:            form.phone,
        email:            form.email,
        shipping_address: form.address,
        city:             form.city,
        payment_method:   form.payment_method,
        notes:            form.notes,
        items,
        subtotal,
        shipping: shippingCost,
        total,
        status:   'pending',
      })
      clearCart()
      nav(`/order-confirmation/${order.id}`)
    } catch(err) {
      alert('Order failed: ' + err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-surface-2 min-h-screen pt-16 md:pt-20 pb-16">
      <div className="max-w-[1100px] mx-auto px-6 py-8">

        <Link to="/cart" className="inline-flex items-center gap-2 text-muted text-sm hover:text-brand transition-colors mb-6">
          <ChevronLeft size={16} /> Back to Cart
        </Link>
        <h1 className="font-heading text-3xl font-black text-dark mb-8">Checkout</h1>

        {!items.length ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-card">
            <ShoppingCart size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-dark mb-2">Your cart is empty</h3>
            <Link to="/products" className="text-brand font-semibold hover:underline">Browse products →</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1.2fr_.8fr] gap-8">

            {/* Form */}
            <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200 shadow-card p-7 space-y-5">
              <div>
                <h2 className="font-heading font-bold text-dark text-lg mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-brand" /> Delivery Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <CheckoutField id="name"    label="Full Name"         required placeholder="Muhammad Ali" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
                  <CheckoutField id="phone"   label="Phone Number"      required placeholder="+92 300 0000000" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
                  <CheckoutField id="email"   label="Email"             type="email" placeholder="ali@example.com" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
                  <CheckoutField id="city"    label="City"              required placeholder="Karachi" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
                </div>
                <div className="mt-4">
                  <CheckoutField id="address" label="Shipping Address"  required placeholder="House #, Street, Area" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h2 className="font-heading font-bold text-dark mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-brand" /> Payment Method
                </h2>
                <div className="space-y-2">
                  {['Cash on Delivery', 'Bank Transfer'].map(method => (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        form.payment_method === method
                          ? 'border-brand bg-brand-pale'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        form.payment_method === method ? 'border-brand' : 'border-gray-300'
                      }`}>
                        {form.payment_method === method && <div className="w-2 h-2 rounded-full bg-brand" />}
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={form.payment_method === method}
                        onChange={e => setForm({ ...form, payment_method: e.target.value })}
                        className="sr-only"
                      />
                      <span className="font-semibold text-sm text-dark">{method}</span>
                      {method === 'Cash on Delivery' && (
                        <span className="ml-auto text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-md font-semibold">Recommended</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <label className="block font-mono-body text-[11px] uppercase tracking-wider text-dark-3 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare size={13} /> Order Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any special instructions or questions…"
                  className="input-white w-full text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-4 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold text-sm transition-colors shadow-brand-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {busy ? <><Loader2 size={16} className="animate-spin" /> Placing Order…</> : 'Place Order'}
              </button>
            </form>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
                <h2 className="font-heading font-bold text-dark mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.product_id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-2 overflow-hidden shrink-0">
                        {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-muted">× {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-dark shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-muted">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted">
                    <span>Shipping</span>
                    <span className={isFree ? 'text-green-600 font-semibold' : 'text-dark font-semibold'}>
                      {isFree ? 'Free' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {settings.shippingNote && (
                    <p className="text-xs text-brand mt-1">{settings.shippingNote}</p>
                  )}
                </div>
                <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
                  <span className="font-heading font-bold text-dark">Total</span>
                  <span className="font-heading font-black text-brand text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Contact note */}
              <div className="bg-brand-pale border border-orange-200 rounded-2xl p-5">
                <p className="font-semibold text-dark text-sm mb-2">Need help?</p>
                <div className="space-y-1.5">
                  <a href="tel:+923363376630" className="flex items-center gap-2 text-sm text-dark-3 hover:text-brand">
                    <Phone size={13} className="text-brand" /> 0336-3376630
                  </a>
                  <a href="mailto:binshihinshi@gmail.com" className="flex items-center gap-2 text-sm text-dark-3 hover:text-brand">
                    <Mail size={13} className="text-brand" /> binshihinshi@gmail.com
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
