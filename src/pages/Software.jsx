import React from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Package, Users, BarChart3,
  Settings, CheckCircle, ArrowRight, Monitor, Smartphone, Globe
} from 'lucide-react'

const features = [
  {
    icon: LayoutDashboard, title: 'Live Dashboard',
    desc: 'See today\'s orders, revenue, and inventory at a glance. Real-time stats to keep you in control.',
    color: 'bg-orange-50 text-brand',
  },
  {
    icon: Package, title: 'Product & Inventory Management',
    desc: 'Add, edit, categorize and track 50+ products. Set sale prices, stock levels, and featured flags.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: ShoppingBag, title: 'Order Management',
    desc: 'Track every order from placement to delivery. Update statuses, view customer details, and monitor revenue.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Users, title: 'Customer Management',
    desc: 'Customer database with order history. Build relationships and analyze purchasing patterns.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: BarChart3, title: 'Sales Reports',
    desc: 'Daily, weekly, and monthly revenue reports. Understand what\'s selling and when.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Settings, title: 'Store Configuration',
    desc: 'Set your currency (PKR), manage categories, configure shipping, and customize your storefront.',
    color: 'bg-pink-50 text-pink-600',
  },
]

const screenshots = [
  {
    title: 'Admin Dashboard',
    desc: 'Complete command center — orders, revenue, and quick product management in one view.',
    bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
    visual: (
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white/60 font-mono-body text-[10px] uppercase tracking-widest">Dashboard</span>
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
        </div>
        {[['Total Orders','124','↑ 14%'],['Revenue','₨ 2.4M','↑ 9%'],['Products','50','—'],['Customers','38','↑ 3']].map(([l,v,d])=>(
          <div key={l} className="flex justify-between items-center bg-white/5 rounded-lg p-2.5">
            <span className="text-white/50 text-[11px]">{l}</span>
            <span className="text-white font-bold text-[12px]">{v} <span className="text-green-400 text-[10px]">{d}</span></span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Product Catalog',
    desc: 'Full CRUD — add products with images, prices, SKUs, categories, and stock levels.',
    bg: 'bg-gradient-to-br from-brand to-brand-dark',
    visual: (
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white/80 font-mono-body text-[10px] uppercase tracking-widest">Products</span>
          <span className="bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-semibold">+ Add</span>
        </div>
        <div className="space-y-2">
          {['Epson TM-T82III Printer','Honeywell Voyager Scanner','PAX A920 Terminal','Zebra ZD220 Label Printer'].map((name,i)=>(
            <div key={i} className="flex items-center gap-3 bg-white/10 rounded-lg p-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20"></div>
              <span className="text-white text-[11px] flex-1 truncate">{name}</span>
              <span className="text-white/50 text-[10px]">Active</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Order Tracking',
    desc: 'Every order tracked through its lifecycle — pending → confirmed → shipped → delivered.',
    bg: 'bg-gradient-to-br from-slate-800 to-slate-900',
    visual: (
      <div className="p-5">
        <div className="mb-4">
          <span className="text-white/60 font-mono-body text-[10px] uppercase tracking-widest">Recent Orders</span>
        </div>
        <div className="space-y-2">
          {[['HB-1024','Processing','₨ 22,500'],['HB-1023','Shipped','₨ 14,900'],['HB-1022','Delivered','₨ 89,000'],['HB-1021','Pending','₨ 8,500']].map(([num,status,price])=>(
            <div key={num} className="flex items-center justify-between bg-white/5 rounded-lg p-2.5">
              <span className="text-white font-mono-body text-[11px]">{num}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                status === 'Shipped'   ? 'bg-blue-500/20 text-blue-400' :
                status === 'Processing'? 'bg-orange-500/20 text-orange-400' :
                'bg-white/10 text-white/50'
              }`}>{status}</span>
              <span className="text-white/70 text-[11px] font-bold">{price}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

const platforms = [
  { icon: Monitor, title: 'Desktop', desc: 'Full-featured admin on any desktop browser.' },
  { icon: Smartphone, title: 'Mobile', desc: 'Responsive interface works on phones & tablets.' },
  { icon: Globe, title: 'Cloud Ready', desc: 'No installation — access from anywhere.' },
]

export default function Software() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="hero-gradient pt-20 md:pt-28 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-[11px] font-mono-body uppercase tracking-widest mb-5">
              POS Software
            </span>
            <h1 className="font-heading text-5xl lg:text-6xl font-black text-dark leading-tight">
              Manage Your <span className="text-brand">Entire Store</span> From One Screen
            </h1>
            <p className="mt-5 text-lg text-muted leading-relaxed">
              A clean, fast admin panel built for Pakistan's retail businesses. Manage products, orders, customers, and categories — all in PKR.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-brand-sm">
                Request a Demo <ArrowRight size={15} />
              </Link>
              <Link to="/products" className="inline-flex items-center gap-2 border border-gray-200 hover:border-brand hover:text-brand px-6 py-3 rounded-xl text-dark-3 font-semibold text-sm transition-colors">
                View Hardware
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {['Free Setup Included','PKR Currency','No Monthly Fees','Local Support'].map(f=>(
                <span key={f} className="flex items-center gap-1.5 text-sm text-dark-3">
                  <CheckCircle size={14} className="text-brand" /> {f}
                </span>
              ))}
            </div>
          </div>

          {/* Hero visual — dashboard mockup */}
          <div className="hidden lg:block">
            <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-3 font-mono-body text-[11px] text-gray-400">admin.hinshibinshi.com</span>
              </div>
              <div className="flex">
                {/* Sidebar */}
                <div className="w-44 bg-gray-800 p-3 space-y-1">
                  {[['Dashboard','active'],['Products',''],['Orders',''],['Customers',''],['Categories','']].map(([n,a])=>(
                    <div key={n} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${a ? 'bg-brand/20 text-brand' : 'text-gray-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${a ? 'bg-brand' : 'bg-gray-600'}`}></div>
                      <span className="text-[11px] font-medium">{n}</span>
                    </div>
                  ))}
                </div>
                {/* Main content */}
                <div className="flex-1 p-4 bg-gray-900">
                  <p className="text-gray-400 font-mono-body text-[10px] uppercase tracking-widest mb-3">Overview</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[['Orders','124','bg-brand/20 text-brand'],['Revenue','₨2.4M','bg-green-500/20 text-green-400'],['Products','50','bg-blue-500/20 text-blue-400'],['Customers','38','bg-purple-500/20 text-purple-400']].map(([l,v,cls])=>(
                      <div key={l} className={`${cls} rounded-xl p-3`}>
                        <p className="text-[10px] opacity-70 uppercase tracking-wider">{l}</p>
                        <p className="font-bold text-[15px] mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-800 rounded-xl p-3">
                    <p className="text-gray-400 text-[10px] mb-2">Recent orders</p>
                    {['HB-1024  •  Processing','HB-1023  •  Shipped','HB-1022  •  Delivered'].map(o=>(
                      <p key={o} className="text-gray-300 text-[10px] py-1 border-b border-gray-700 last:border-0">{o}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 section-alt">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-black text-dark">Everything You Need to Run Your Store</h2>
            <p className="text-muted mt-2">Built specifically for POS hardware retailers in Pakistan</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-brand hover:shadow-brand-sm transition-all">
                  <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-dark">{f.title}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Screenshots / Visual previews */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-black text-dark">Software in Action</h2>
            <p className="text-muted mt-2">Visual preview of the admin panel</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {screenshots.map((s, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-card">
                <div className={`${s.bg} h-52`}>
                  {s.visual}
                </div>
                <div className="bg-white p-5">
                  <h3 className="font-heading font-bold text-dark">{s.title}</h3>
                  <p className="text-sm text-muted mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform availability */}
      <section className="py-12 section-alt">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-black text-dark">Works Everywhere</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
            {platforms.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:border-brand transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mx-auto mb-3">
                    <Icon size={22} className="text-brand" />
                  </div>
                  <h3 className="font-heading font-bold text-dark">{p.title}</h3>
                  <p className="text-sm text-muted mt-1">{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl font-black text-white">Ready to Get Started?</h2>
          <p className="text-orange-100 mt-3 text-lg">
            Get the software included with your hardware purchase — or contact us for a standalone demo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-brand px-8 py-3.5 rounded-xl font-bold hover:bg-orange-50 transition-colors">
              Book a Demo <ArrowRight size={15} />
            </Link>
            <Link to="/products" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              See Hardware
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
