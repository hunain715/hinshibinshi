import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingCart, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import { formatPrice } from '@/lib/admin'
import { getProductImage } from '@/lib/productImages'

/* ─── Hero ─────────────────────────────────────────────────────────────────── */
export function Hero({ eyebrow = 'Hinshi Binshi', title, copy, actions }) {
  return (
    <section className="hero-gradient pt-20 md:pt-28 pb-16">
      <div className="max-w-[1280px] mx-auto px-6 flex items-center">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-[11px] font-mono-body uppercase tracking-widest mb-5">
            {eyebrow}
          </span>
          <h1 className="font-heading text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-dark">
            {title}
          </h1>
          {copy && (
            <p className="mt-5 text-lg text-muted leading-relaxed max-w-2xl">{copy}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {actions || (
              <>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-brand-sm"
                >
                  Browse Products <ArrowRight size={15} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border border-gray-200 hover:border-brand hover:text-brand px-6 py-3 rounded-xl text-dark-3 font-semibold text-sm transition-colors"
                >
                  Get in touch
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
/* ─── Feature Strip ─────────────────────────────────────────────────────────── */
export function FeatureStrip({ items }) {
  return (
    <section className="py-12 border-y border-gray-100 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-3 gap-6">
        {items.map((x, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 size={18} className="text-brand" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-dark">{x.title}</h3>
              <p className="text-sm text-muted mt-1 leading-relaxed">{x.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Product Card ─────────────────────────────────────────────────────────── */
export function ProductCard({ product }) {
  const { addItem } = useCart()
  const image = getProductImage(product)
  const secondImage = null // second image hover disabled for now
  // fallback: agar condition nahi set toh 'new' maano
  const isRefurbished = (product.condition || 'new').toLowerCase() === 'refurbished'
  const hasSale = product.sale_price && Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price)
  const inStock  = (product.stock_quantity ?? 1) > 0

  return (
    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden group transition-all duration-300 hover:border-brand hover:shadow-[0_8px_30px_rgba(255,107,0,0.12)] hover:-translate-y-1">
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden aspect-[4/3] bg-surface-2">
        {image ? (
          <>
            <img
              src={image}
              alt={product.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${secondImage ? 'group-hover:opacity-0' : ''}`}
            />
            {secondImage && (
              <img
                src={secondImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart size={32} className="text-gray-200" />
          </div>
        )}

        {/* Condition + Sale badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            isRefurbished
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-orange-100 text-brand border border-orange-200'
          }`}>
            {isRefurbished ? 'Refurbished' : 'New'}
          </span>
          {hasSale && (
            <span className="bg-red-100 text-red-600 border border-red-200 text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Sale
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-dark text-xs font-semibold px-4 py-2 rounded-full shadow-lg translate-y-2 group-hover:translate-y-0">
            View Details
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="font-mono-body text-[10px] uppercase tracking-widest text-muted mb-1">
          {product.category}
        </p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-heading font-semibold text-dark text-[14px] leading-snug line-clamp-2 hover:text-brand transition-colors min-h-[40px]">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            {hasSale ? (
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-black text-brand text-[17px]">
                  {formatPrice(product.sale_price)}
                </span>
                <span className="text-[11px] text-muted line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="font-heading font-black text-dark text-[17px]">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {!inStock && (
            <span className="text-[9px] font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-md uppercase tracking-wider">
              Out of stock
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addItem(product)}
          disabled={!inStock}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-pale text-brand hover:bg-brand hover:text-white active:scale-[.98] transition-all duration-200 text-[12px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={13} />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </article>
  )
}
