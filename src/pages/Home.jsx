import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Printer, ScanLine, Monitor, Wrench,
  Star, Shield, Truck, Headphones,
  ChevronLeft, ChevronRight, CheckCircle
} from 'lucide-react'
import { base44 } from '@/api/base44Client'
import { ProductCard, FeatureStrip } from './_StorePage'
import { getSettings } from '@/lib/siteSettings'

const catCards = [
  { id:'printers',    label:'Printers',     icon:Printer,  desc:'Thermal & label printers',       color:'bg-orange-50 text-brand' },
  { id:'scanners',    label:'Scanners',      icon:ScanLine, desc:'1D/2D wired & wireless scanners', color:'bg-blue-50 text-blue-600' },
  { id:'terminals',   label:'POS Terminals', icon:Monitor,  desc:'All-in-one POS systems',          color:'bg-purple-50 text-purple-600' },
  { id:'accessories', label:'Accessories',   icon:Wrench,   desc:'Cash drawers & more',             color:'bg-green-50 text-green-600' },
]

const whyUs = [
  { icon:Shield,     title:'Genuine Products',     desc:'New products carry full manufacturer warranty.' },
  { icon:Wrench,     title:'Certified Refurbished', desc:'Fully tested, cleaned & 6-month warranty.' },
  { icon:Truck,      title:'Fast Delivery',         desc:'Same-day dispatch in Karachi. 2-4 days nationwide.' },
  { icon:Headphones, title:'After-Sales Support',   desc:'Dedicated support team 6 days a week.' },
]

/* ─── Hero Banner ─────────────────────────────────────────────────── */
function HeroSlider() {
  return (
    <section className="w-full">
      <img
        src="/banner.png"
        alt="Hinshi Binshi — Point of Sales Software & Hardware Solutions"
        className="w-full h-auto block"
        onError={e => { e.target.style.display = 'none' }}
      />
    </section>
  )
}

/* ─── Promo Banners ─────────────────────────────────────────────── */
const banners = [
  {
    id: 'printers', badgeIcon: Printer, badge: 'Thermal Printers',
    title: 'Fast, Reliable Receipt Printing',
    subtitle: 'From budget 58mm to high-speed 80mm — new & refurbished printers for every POS counter.',
    points: ['Print speed up to 300mm/s', 'USB / LAN / Bluetooth', 'Starting from Rs.9,900'],
    btn: { label: 'Shop Printers', to: '/products?category=printers' },
    bg: 'from-orange-600 to-orange-400', icon: Printer,
  },
  {
    id: 'scanners', badgeIcon: ScanLine, badge: 'Barcode Scanners',
    title: 'Scan Smarter, Checkout Faster',
    subtitle: 'Wired & wireless 1D/2D scanners — reads barcodes, QR codes & mobile screens.',
    points: ['1D Laser & 2D Imager', 'USB & Bluetooth', 'Starting from Rs.3,800'],
    btn: { label: 'Shop Scanners', to: '/products?category=scanners' },
    bg: 'from-blue-700 to-blue-500', icon: ScanLine,
  },
]

function PromoBanners() {
  const [active, setActive] = React.useState(0)
  React.useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [])
  const b = banners[active]
  const BadgeIcon = b.badgeIcon
  const BigIcon   = b.icon
  return (
    <section className="py-4 md:py-6 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className={`relative rounded-2xl md:rounded-3xl bg-gradient-to-r ${b.bg} overflow-hidden`}>
          <div className="relative grid md:grid-cols-[1fr_auto] gap-4 items-center p-5 md:p-8 lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-mono-body uppercase tracking-widest mb-3">
                <BadgeIcon size={12} /> {b.badge}
              </span>
              <h2 className="font-heading text-xl md:text-3xl lg:text-4xl font-black text-white leading-tight">
                {b.title}
              </h2>
              <p className="text-white/80 mt-2 text-sm md:text-base leading-relaxed max-w-lg">{b.subtitle}</p>
              <ul className="mt-3 space-y-1">
                {b.points.map(pt => (
                  <li key={pt} className="flex items-center gap-2 text-white/90 text-xs md:text-sm">
                    <CheckCircle size={12} className="text-white shrink-0" /> {pt}
                  </li>
                ))}
              </ul>
              <Link
                to={b.btn.to}
                className="inline-flex items-center gap-2 mt-4 md:mt-6 bg-white text-gray-900 hover:bg-gray-50 px-5 md:px-7 py-2.5 md:py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg"
              >
                {b.btn.label} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="hidden md:flex w-36 h-36 lg:w-48 lg:h-48 rounded-2xl bg-white/15 items-center justify-center shrink-0 border border-white/20">
              <BigIcon size={72} className="text-white/70" strokeWidth={1} />
            </div>
          </div>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`rounded-full transition-all ${active === i ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
              />
            ))}
          </div>
          <button onClick={() => setActive(a => (a - 1 + banners.length) % banners.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setActive(a => (a + 1) % banners.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function Home() {
  const [featured, setFeatured] = React.useState([])
  const [printers, setPrinters] = React.useState([])
  const [scanners, setScanners] = React.useState([])

  React.useEffect(() => {
    base44.entities.Product.list('-created_date', 200).then(all => {
      const active = all.filter(p => p.status === 'active')
      setFeatured(active.filter(p => p.featured).slice(0, 4))
      setPrinters(active.filter(p => p.category === 'printers').slice(0, 4))
      setScanners(active.filter(p => p.category === 'scanners').slice(0, 4))
    })
  }, [])

  return (
    <div className="bg-white min-h-screen pt-16 md:pt-20">

      {/* Banner */}
      <HeroSlider />

      {/* Feature strip */}
      <FeatureStrip items={[
        { title:'50+ Products',        copy:'New and refurbished POS hardware across 4 categories.' },
        { title:'PKR Pricing',          copy:'All prices in Pakistani Rupees — no hidden fees.' },
        { title:'Nationwide Delivery',  copy:'Fast delivery to all major cities across Pakistan.' },
      ]} />

      {/* Promo Banners */}
      <PromoBanners />

      {/* Shop by Category */}
      <section className="py-10 md:py-16 section-alt">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="mb-6 md:mb-8 flex items-end justify-between">
            <div>
              <span className="font-mono-body text-[10px] uppercase tracking-widest text-brand">Explore</span>
              <h2 className="font-heading text-2xl md:text-3xl font-black text-dark mt-1">Shop by Category</h2>
            </div>
            <Link to="/products" className="text-brand text-sm font-semibold hover:underline flex items-center gap-1 shrink-0">
              All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {catCards.map(cat => {
              const Icon = cat.icon
              return (
                <Link key={cat.id} to={`/products?category=${cat.id}`}
                  className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6 hover:border-brand hover:shadow-brand-sm transition-all group">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${cat.color} flex items-center justify-center mb-3`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-dark text-sm md:text-base group-hover:text-brand transition-colors">{cat.label}</h3>
                  <p className="text-xs text-muted mt-1 leading-snug hidden sm:block">{cat.desc}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 md:px-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="font-mono-body text-[10px] uppercase tracking-widest text-brand flex items-center gap-1.5">
                  <Star size={11} fill="currentColor" /> Featured
                </span>
                <h2 className="font-heading text-2xl md:text-3xl font-black text-dark mt-1">Top Picks</h2>
              </div>
              <Link to="/products" className="text-brand text-sm font-semibold hover:underline flex items-center gap-1 shrink-0">
                All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Printers */}
      {printers.length > 0 && (
        <section className="py-10 md:py-16 section-alt">
          <div className="max-w-[1280px] mx-auto px-4 md:px-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-brand text-[10px] font-mono-body uppercase tracking-widest mb-2">
                  <Printer size={10} /> Printers
                </span>
                <h2 className="font-heading text-2xl md:text-3xl font-black text-dark">Thermal Printers</h2>
              </div>
              <Link to="/products?category=printers" className="text-brand text-sm font-semibold hover:underline flex items-center gap-1 shrink-0">
                All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {printers.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Scanners */}
      {scanners.length > 0 && (
        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 md:px-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-mono-body uppercase tracking-widest mb-2">
                  <ScanLine size={10} /> Scanners
                </span>
                <h2 className="font-heading text-2xl md:text-3xl font-black text-dark">Barcode Scanners</h2>
              </div>
              <Link to="/products?category=scanners" className="text-brand text-sm font-semibold hover:underline flex items-center gap-1 shrink-0">
                All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {scanners.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-10 md:py-16 bg-brand text-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-black">Why Choose Hinshi Binshi?</h2>
            <p className="text-orange-100 mt-2 text-sm">Pakistan's trusted POS hardware source</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {whyUs.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-3">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-sm md:text-base">{item.title}</h3>
                  <p className="text-orange-100 text-xs md:text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-16 section-alt">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-card p-6 md:p-10 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="font-heading text-xl md:text-3xl font-black text-dark">
                Looking for a complete <span className="text-brand">POS setup?</span>
              </h2>
              <p className="text-muted mt-2 text-sm md:text-lg">
                Tell us your business type — we'll recommend the right bundle.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <Link to="/contact"
                className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-brand-sm">
                Get a Free Quote <ArrowRight size={14} />
              </Link>
              <Link to="/products"
                className="flex items-center justify-center gap-2 border border-gray-200 hover:border-brand hover:text-brand px-6 py-3 rounded-xl text-dark-3 font-semibold text-sm transition-colors">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
