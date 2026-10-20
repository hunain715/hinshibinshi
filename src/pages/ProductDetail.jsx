import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { base44 } from '@/api/base44Client'
import { useCart } from '@/lib/CartContext'
import { formatPrice } from '@/lib/admin'
import { getProductImage } from '@/lib/productImages'
import { ChevronLeft, ChevronRight, ShoppingCart, CheckCircle, Package, ArrowRight, Zap } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/config'

function getImages(product) {
  if (!product) return []
  const imgs = []
  if (product.primary_image) imgs.push(product.primary_image)
  if (Array.isArray(product.images)) {
    product.images.forEach(u => { if (u && !imgs.includes(u)) imgs.push(u) })
  }
  return imgs
}

export default function ProductDetail() {
  const { slug }    = useParams()
  const [product,   setProduct]   = React.useState(null)
  const [related,   setRelated]   = React.useState([])
  const [added,     setAdded]     = React.useState(false)
  const [imgIdx,    setImgIdx]    = React.useState(0)
  const { addItem } = useCart()
  const navigate    = useNavigate()

  React.useEffect(() => {
    base44.entities.Product.list().then(rows => {
      const p = rows.find(x => x.slug === slug) || null
      setProduct(p)
      if (p) setRelated(rows.filter(x => x.category === p.category && x.id !== p.id && x.status === 'active').slice(0, 4))
    })
    setAdded(false); setImgIdx(0)
  }, [slug])

  if (!product) return (
    <div className="bg-white min-h-screen pt-32 flex items-center justify-center">
      <div className="text-center">
        <Package size={40} className="text-gray-300 mx-auto mb-4" />
        <p className="text-muted">Loading product…</p>
      </div>
    </div>
  )

  const images      = getImages(product)
  const fallback    = getProductImage(product)
  const activeImage = images[imgIdx] || fallback
  const hasSale     = product.sale_price && Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price)
  const isRefurb    = (product.condition || 'new').toLowerCase() === 'refurbished'
  const inStock     = (product.stock_quantity ?? 1) > 0

  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 2000) }
  const handleOrderNow = () => { addItem(product); navigate('/checkout') }
  const handleWhatsApp = () => {
    const price = product.sale_price ?? product.price
    const msg = encodeURIComponent(`Hello! I want to order:\n\n*${product.title}*\nPrice: PKR ${Number(price).toLocaleString()}\n\nPlease confirm availability.`)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }

  return (
    <div className="bg-white min-h-screen pt-16 md:pt-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center gap-2 text-muted text-sm hover:text-brand transition-colors mb-5 md:mb-8">
          <ChevronLeft size={15} /> Back to Products
        </Link>

        {/* Main grid — stacks on mobile */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 mb-10 md:mb-16">

          {/* ── Image section ── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-surface-2 border border-gray-100">
              {activeImage
                ? <img src={activeImage} alt={product.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><Package size={48} className="text-gray-200" /></div>
              }
              {/* Condition badge */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className={`text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  isRefurb ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-brand border border-orange-200'
                }`}>
                  {isRefurb ? 'Refurbished' : 'New'}
                </span>
                {hasSale && <span className="bg-red-100 text-red-600 border border-red-200 text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">Sale</span>}
              </div>
              {/* Arrows if multiple images */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-dark flex items-center justify-center shadow-sm">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-dark flex items-center justify-center shadow-sm">
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails — horizontal scroll on mobile */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {images.map((url, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-colors ${
                      imgIdx === i ? 'border-brand' : 'border-gray-100 hover:border-brand/50'
                    }`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div>
            <p className="font-mono-body text-[11px] uppercase tracking-widest text-brand mb-1">{product.category}</p>
            <h1 className="font-heading text-2xl md:text-4xl font-black text-dark leading-tight">
              {product.title}
            </h1>
            {product.sku && <p className="font-mono-body text-[11px] text-muted mt-1.5">SKU: {product.sku}</p>}

            {/* Price */}
            <div className="mt-4 md:mt-6">
              {hasSale ? (
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-heading text-2xl md:text-3xl font-black text-brand">{formatPrice(product.sale_price)}</span>
                  <span className="font-heading text-lg text-muted line-through">{formatPrice(product.price)}</span>
                  <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg">
                    Save {formatPrice(product.price - product.sale_price)}
                  </span>
                </div>
              ) : (
                <span className="font-heading text-2xl md:text-3xl font-black text-dark">{formatPrice(product.price)}</span>
              )}
              <p className="font-mono-body text-[10px] text-muted mt-1 uppercase tracking-wider">All prices in PKR ₨</p>
            </div>

            {/* Description */}
            <p className="text-dark-3 leading-relaxed mt-4 text-sm md:text-[15px] line-clamp-5 md:line-clamp-none">
              {product.description}
            </p>

            {/* Key points */}
            <ul className="mt-4 space-y-1.5">
              {(isRefurb
                ? ['Professionally cleaned & tested','6-month replacement warranty','Cost-effective POS solution']
                : ['Brand new in original packaging','Full manufacturer warranty','Genuine product']
              ).map(point => (
                <li key={point} className="flex items-center gap-2 text-sm text-dark-3">
                  <CheckCircle size={13} className="text-brand shrink-0" /> {point}
                </li>
              ))}
            </ul>

            {/* Stock */}
            <div className="mt-4 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className={`text-sm font-semibold ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                {inStock ? `In Stock (${product.stock_quantity} units)` : 'Out of Stock'}
              </span>
            </div>

            {/* Action buttons */}
            <div className="mt-5 space-y-2.5">
              {/* Add to Cart */}
              <button onClick={handleAdd} disabled={!inStock}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  added ? 'bg-green-500 text-white'
                  : inStock ? 'bg-brand hover:bg-brand-dark text-white shadow-brand-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}>
                {added ? <><CheckCircle size={15}/> Added!</> : <><ShoppingCart size={15}/> Add to Cart</>}
              </button>

              {/* Order Now + WhatsApp */}
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={handleOrderNow} disabled={!inStock}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-dark hover:bg-dark-2 text-white font-semibold text-sm transition-colors disabled:opacity-40">
                  <Zap size={14}/> Order Now
                </button>
                <button onClick={handleWhatsApp} disabled={!inStock}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-[12px] transition-colors disabled:opacity-40">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="border-t border-gray-100 pt-8 md:pt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl md:text-2xl font-black text-dark">More in {product.category}</h2>
              <Link to={`/products?category=${product.category}`}
                className="text-brand text-sm font-semibold hover:underline flex items-center gap-1">
                View all <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {related.map(p => {
                const img = getProductImage(p)
                return (
                  <Link key={p.id} to={`/product/${p.slug}`}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-brand hover:shadow-brand-sm transition-all">
                    <div className="aspect-[4/3] bg-surface-2 overflow-hidden">
                      {img && <img src={img} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>}
                    </div>
                    <div className="p-3">
                      <h3 className="font-heading font-bold text-dark text-xs md:text-sm line-clamp-2">{p.title}</h3>
                      <p className="font-heading font-bold text-brand mt-1 text-sm">{formatPrice(p.sale_price ?? p.price)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
