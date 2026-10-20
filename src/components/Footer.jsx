import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle } from 'lucide-react'
import { getSettings } from '@/lib/siteSettings'

export default function Footer() {
  const s = getSettings()
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-[1280px] mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <img src="https://i.ibb.co/tTcb55FY/logo-png.png" alt="Hinshi Binshi" className="h-20 w-auto object-contain" />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">
            Pakistan's trusted source for Point of Sales hardware and software. New & certified refurbished equipment in PKR.
          </p>
          <div className="flex gap-3">
            {[
              [Facebook,      s.facebookUrl  || 'https://facebook.com',       'Facebook'],
              [Instagram,     s.instagramUrl || 'https://instagram.com',       'Instagram'],
              [MessageCircle, `https://wa.me/${s.whatsapp || '923363376630'}`, 'WhatsApp'],
            ].map(([Icon, href, label]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand transition-colors flex items-center justify-center"
                aria-label={label}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <p className="font-mono-body text-[10px] uppercase tracking-widest text-gray-500 mb-4">Products</p>
          <ul className="space-y-2.5">
            {[
              ['/products?category=printers',     'Thermal Printers'],
              ['/products?category=scanners',     'Barcode Scanners'],
              ['/products?category=terminals',    'POS Terminals'],
              ['/products?category=accessories',  'Accessories'],
              ['/products?condition=new',         'New Products'],
              ['/products?condition=refurbished', 'Refurbished'],
            ].map(([to, label]) => (
              <li key={to}><Link to={to} className="text-sm text-gray-400 hover:text-brand transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <p className="font-mono-body text-[10px] uppercase tracking-widest text-gray-500 mb-4">Categories</p>
          <ul className="space-y-2.5">
            {[
              ['/products?category=printers',    'Printers'],
              ['/products?category=scanners',    'Scanners'],
              ['/products?category=terminals',   'POS Terminals'],
              ['/products?category=accessories', 'Accessories'],
              ['/contact',                       'Contact Us'],
              ['/login',                         'Admin Login'],
            ].map(([to, label]) => (
              <li key={to}><Link to={to} className="text-sm text-gray-400 hover:text-brand transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-mono-body text-[10px] uppercase tracking-widest text-gray-500 mb-4">Contact</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <MapPin size={15} className="text-brand shrink-0 mt-0.5" />
              <span className="text-sm text-gray-400">{s.address || 'Karachi, Pakistan'}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={15} className="text-brand shrink-0" />
              <a href={`tel:${s.phone || '+923363376630'}`} className="text-sm text-gray-400 hover:text-brand transition-colors">
                {s.phone || '0336-3376630'}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-brand shrink-0" />
              <a href={`mailto:${s.email || 'binshihinshi@gmail.com'}`} className="text-sm text-gray-400 hover:text-brand transition-colors">
                {s.email || 'binshihinshi@gmail.com'}
              </a>
            </li>
          </ul>
          <div className="mt-5 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[12px] font-semibold text-white mb-1">Business Hours</p>
            <p className="text-[11px] text-gray-400">Mon – Sat: 9:00 AM – 7:00 PM</p>
            <p className="text-[11px] text-gray-400">Sunday: Closed</p>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {s.siteName || 'Hinshi Binshi'}. All rights reserved.
          </p>
          <a href="https://ashnetic.com" target="_blank" rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-brand transition-colors">
            Powered by <span className="font-semibold text-gray-400 hover:text-brand">Ashnetic Digital</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
