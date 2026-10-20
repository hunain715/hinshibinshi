import React from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ChevronLeft, Package } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import { formatPrice } from '@/lib/admin'

export default function Cart() {
  const { items, setQuantity, removeItem, subtotal } = useCart()

  return (
    <div className="bg-white min-h-screen pt-16 md:pt-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Header */}
        <Link to="/products"
          className="inline-flex items-center gap-2 text-muted text-sm hover:text-brand transition-colors mb-5">
          <ChevronLeft size={16} /> Continue Shopping
        </Link>
        <h1 className="font-heading text-2xl md:text-3xl font-black text-dark mb-6">
          Cart {items.length > 0 && <span className="text-muted font-normal text-base ml-1">({items.length})</span>}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-5">
              <ShoppingCart size={28} className="text-brand" />
            </div>
            <h3 className="font-heading text-xl font-bold text-dark mb-3">Your cart is empty</h3>
            <p className="text-muted mb-6 text-sm">Browse our POS hardware catalog.</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-brand-sm">
              Browse Products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-5 md:gap-8">

            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map(item => (
                <div key={item.product_id}
                  className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-card">

                  {/* Top row: image + title + delete */}
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-surface-2 border border-gray-100 shrink-0">
                      {item.image
                        ? <img src={item.image} alt="" className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center"><Package size={18} className="text-gray-300"/></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-dark text-sm leading-snug line-clamp-2">{item.title}</p>
                      <p className="font-mono-body text-[11px] text-muted mt-0.5">{formatPrice(item.price)} each</p>
                    </div>
                    <button onClick={() => removeItem(item.product_id)}
                      className="w-8 h-8 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors shrink-0">
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Bottom row: qty + line total */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => setQuantity(item.product_id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-dark-3 hover:bg-brand-pale hover:text-brand transition-colors">
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center font-mono-body text-sm font-bold text-dark border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button onClick={() => setQuantity(item.product_id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-dark-3 hover:bg-brand-pale hover:text-brand transition-colors">
                        <Plus size={13} />
                      </button>
                    </div>
                    {/* Line total */}
                    <p className="font-heading font-black text-dark text-base">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-card lg:sticky lg:top-24">
                <h2 className="font-heading text-lg font-bold text-dark mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span>
                    <span className="font-semibold text-dark">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 mb-5">
                  <div className="flex justify-between">
                    <span className="font-heading font-bold text-dark">Total</span>
                    <span className="font-heading font-black text-brand text-xl">{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <Link to="/checkout"
                  className="block text-center bg-brand hover:bg-brand-dark text-white py-3.5 rounded-xl font-semibold transition-colors shadow-brand-sm">
                  Proceed to Checkout
                </Link>
                <Link to="/products"
                  className="block text-center text-muted text-sm mt-3 hover:text-brand transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
