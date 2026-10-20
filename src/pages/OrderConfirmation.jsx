import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Package, Phone, Mail } from 'lucide-react'
import { base44 } from '@/api/base44Client'
import { formatPrice } from '@/lib/admin'

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = React.useState(null)

  React.useEffect(() => {
    base44.entities.Order.get(id).then(setOrder).catch(() => setOrder(null))
  }, [id])

  return (
    <div className="bg-surface-2 min-h-screen pt-16 md:pt-20 pb-16">
      <div className="max-w-[640px] mx-auto px-6 py-12">

        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h1 className="font-heading text-4xl font-black text-dark">Order Placed!</h1>
          <p className="text-muted mt-2 text-lg">Thank you for your purchase.</p>
        </div>

        {order && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-7 mb-6">

            {/* Order number + status */}
            <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
              <div>
                <p className="font-mono-body text-[10px] uppercase tracking-widest text-muted">Order Number</p>
                <p className="font-heading font-black text-brand text-xl mt-0.5">{order.order_number || order.id}</p>
              </div>
              <span className="bg-orange-100 text-brand text-[11px] font-semibold px-3 py-1.5 rounded-xl font-mono-body uppercase tracking-wider">
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2.5 mb-5">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-surface-2 rounded-xl">
                  {item.image && (
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark line-clamp-1">{item.title}</p>
                    <p className="text-[11px] text-muted">× {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-dark shrink-0">{formatPrice((item.price||0) * (item.quantity||1))}</p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <span>Shipping</span><span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between font-heading font-black text-dark text-lg pt-1">
                <span>Total</span>
                <span className="text-brand">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Delivery info */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="font-mono-body text-[10px] uppercase tracking-wider text-muted mb-3">Delivery Details</p>
              <div className="space-y-1.5 text-sm text-dark-3">
                <p><span className="font-semibold text-dark">{order.customer_name}</span></p>
                <p>{order.shipping_address}, {order.city}</p>
                <p>{order.phone}</p>
                <p className="text-brand font-semibold">{order.payment_method}</p>
              </div>
            </div>
          </div>
        )}

        {/* What's next */}
        <div className="bg-brand-pale border border-orange-200 rounded-2xl p-6 mb-6">
          <h3 className="font-heading font-bold text-dark mb-3">What happens next?</h3>
          <ul className="space-y-2.5">
            {[
              'Our team will confirm your order within a few hours',
              'We\'ll call you on the provided phone number',
              'Your order will be dispatched same/next working day',
              'You\'ll receive your product in 1–3 working days',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-dark-3">
                <span className="w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-5 mb-6">
          <p className="font-semibold text-dark text-sm mb-3">Need help with your order?</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:+923363376630" className="flex items-center gap-2 text-sm text-dark-3 hover:text-brand transition-colors">
              <Phone size={14} className="text-brand" /> 0336-3376630
            </a>
            <a href="mailto:binshihinshi@gmail.com" className="flex items-center gap-2 text-sm text-dark-3 hover:text-brand transition-colors">
              <Mail size={14} className="text-brand" /> binshihinshi@gmail.com
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/products"
            className="flex-1 flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white py-3.5 rounded-xl font-semibold transition-colors shadow-brand-sm"
          >
            Continue Shopping <ArrowRight size={15} />
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-brand hover:text-brand text-dark-3 py-3.5 rounded-xl font-semibold transition-colors"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}
