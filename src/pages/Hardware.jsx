import React from 'react'
import { Link } from 'react-router-dom'
import { Printer, ScanLine, Monitor, Wrench, ArrowRight, CheckCircle, Package } from 'lucide-react'
import { base44 } from '@/api/base44Client'
import { ProductCard, FeatureStrip } from './_StorePage'

const hwCategories = [
  {
    id:'printers', icon:Printer, title:'Thermal Printers',
    desc:'High-speed 80mm thermal receipt printers and label printers from Epson, Star, Xprinter, Zebra and more.',
    features:['Receipt & label printing','USB / LAN / Bluetooth connectivity','Auto-cutter included','Up to 300mm/s print speed'],
  },
  {
    id:'scanners', icon:ScanLine, title:'Barcode Scanners',
    desc:'1D laser and 2D imager scanners for fast, accurate product scanning at checkout or in the warehouse.',
    features:['1D & 2D barcode support','Wired USB or wireless Bluetooth','Reads mobile screen barcodes','Rugged & drop-resistant builds'],
  },
  {
    id:'terminals', icon:Monitor, title:'POS Terminals',
    desc:'All-in-one POS systems, Android smart terminals, and payment card terminals for every business size.',
    features:['Touchscreen & all-in-one options','Android & Windows POS','NFC contactless payment','Customer pole display ready'],
  },
  {
    id:'accessories', icon:Wrench, title:'Accessories & Consumables',
    desc:'Cash drawers, customer displays, MSR readers, thermal paper rolls, and everything else you need.',
    features:['Steel cash drawers', 'Thermal paper & label rolls','Magnetic card readers','Time & attendance devices'],
  },
]

export default function Hardware() {
  const [products, setProducts] = React.useState([])
  const [activeCategory, setActiveCategory] = React.useState('all')

  React.useEffect(() => {
    base44.entities.Product.list('-created_date', 200).then(setProducts)
  }, [])

  const shown = activeCategory === 'all'
    ? products.filter(p => p.status === 'active').slice(0, 8)
    : products.filter(p => p.category === activeCategory && p.status === 'active').slice(0, 8)

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="hero-gradient pt-20 md:pt-28 pb-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-[11px] font-mono-body uppercase tracking-widest mb-5">
            Hardware
          </span>
          <h1 className="font-heading text-5xl lg:text-6xl font-black text-dark leading-tight max-w-3xl">
            POS Hardware for <span className="text-brand">Every Business</span>
          </h1>
          <p className="mt-5 text-lg text-muted max-w-2xl leading-relaxed">
            Complete range of Point of Sales hardware — from budget-friendly refurbished units to brand-new premium systems. All tested, all in PKR.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-brand-sm">
              Shop All Hardware <ArrowRight size={15} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border border-gray-200 hover:border-brand hover:text-brand px-6 py-3 rounded-xl text-dark-3 font-semibold text-sm transition-colors">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      <FeatureStrip items={[
        { title:'New & Refurbished',  copy:'25 brand-new products + 25 certified refurbished units — you choose what fits your budget.' },
        { title:'Tested & Verified',  copy:'Every refurbished unit undergoes full functional testing before dispatch.' },
        { title:'Same-Day Dispatch',  copy:'Orders placed before 2pm in Karachi are dispatched same day.' },
      ]} />

      {/* Category Overview Cards */}
      <section className="py-16 section-alt">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="font-heading text-2xl font-black text-dark mb-8">Hardware Categories</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {hwCategories.map(cat => {
              const Icon = cat.icon
              return (
                <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 p-7 hover:border-brand hover:shadow-brand-sm transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                      <Icon size={22} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-dark text-lg">{cat.title}</h3>
                      <p className="text-sm text-muted mt-1 mb-4 leading-relaxed">{cat.desc}</p>
                      <ul className="space-y-1">
                        {cat.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-sm text-dark-3">
                            <CheckCircle size={13} className="text-brand shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={`/products?category=${cat.id}`}
                        className="inline-flex items-center gap-1.5 mt-4 text-brand text-sm font-semibold hover:underline"
                      >
                        Shop {cat.title} <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products section with filter */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl font-black text-dark">Browse Hardware</h2>
              <p className="text-muted text-sm mt-1">{products.length} products available</p>
            </div>
            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap">
              {[['all','All'],['printers','Printers'],['scanners','Scanners'],['terminals','Terminals'],['accessories','Accessories']].map(([id,label])=>(
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-colors ${
                    activeCategory === id
                      ? 'bg-brand text-white shadow-brand-sm'
                      : 'bg-surface-2 text-dark-3 hover:bg-brand-pale hover:text-brand'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {shown.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {shown.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-muted">No products in this category yet.</p>
            </div>
          )}

          {shown.length >= 8 && (
            <div className="text-center mt-8">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 border border-gray-200 hover:border-brand hover:text-brand px-8 py-3 rounded-xl text-dark-3 font-semibold transition-colors"
              >
                View All Products <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
