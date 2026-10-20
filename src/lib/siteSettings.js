// ─── Site Settings — admin se manage hoga ─────────────────────────────────
// Sari settings localStorage mein permanently save hongi.
// Admin panel se update karo — website pe turant dikh jaayega.

const SETTINGS_KEY = 'hb_settings_v1'

export const DEFAULT_SETTINGS = {
  // ── General ──────────────────────────────────────────────────────────────
  siteName:       'Hinshi Binshi',
  tagline:        'Point of Sales — Software & Hardware Solutions',
  currency:       'PKR',
  currencySymbol: '₨',

  // ── Contact ──────────────────────────────────────────────────────────────
  phone:          '0336-3376630',
  whatsapp:       '923363376630',   // 92XXXXXXXXXX format
  email:          'binshihinshi@gmail.com',
  address:        'Karachi, Pakistan',

  // ── Shipping ─────────────────────────────────────────────────────────────
  shippingFree:         true,           // true = free shipping always
  shippingFreeThreshold: 0,             // free if order above this amount (0 = always free)
  shippingCharge:       250,            // charge if not free
  shippingNote:         'Free delivery on all orders across Pakistan.',

  // ── Hero Banner (Home page main) ─────────────────────────────────────────
  heroTitle:      'Point of Sales Hardware & Software Solutions',
  heroSubtitle:   'New & certified refurbished POS equipment — thermal printers, barcode scanners, terminals and accessories. All in PKR. Ship nationwide.',
  heroBtn1Label:  'Browse Products',
  heroBtn1Link:   '/products',
  heroBtn2Label:  'Get in touch',
  heroBtn2Link:   '/contact',

  // ── Promo Banners (scrolling) ─────────────────────────────────────────────
  banner1Active:    true,
  banner1Badge:     'Thermal Printers',
  banner1Title:     'Fast, Reliable Receipt Printing',
  banner1Subtitle:  'From budget 58mm to high-speed 80mm — new & refurbished thermal printers for every POS counter.',
  banner1BtnLabel:  'Shop Printers',
  banner1BtnLink:   '/products?category=printers',
  banner1Color:     'from-orange-600 to-orange-400',
  banner1Emoji:     'printer',

  banner2Active:    true,
  banner2Badge:     'Barcode Scanners',
  banner2Title:     'Scan Smarter, Checkout Faster',
  banner2Subtitle:  'Wired & wireless 1D/2D barcode scanners — reads any barcode including QR codes on mobile screens.',
  banner2BtnLabel:  'Shop Scanners',
  banner2BtnLink:   '/products?category=scanners',
  banner2Color:     'from-blue-700 to-blue-500',
  banner2Emoji:     'scanner',

  // ── Homepage Sections (on/off) ───────────────────────────────────────────
  showFeatured:   true,
  showPrinters:   true,
  showScanners:   true,
  showWhyUs:      true,
  showCTABanner:  true,

  // ── Announcement Bar ────────────────────────────────────────────────────
  announcementActive:  false,
  announcementText:    'Free delivery on all orders across Pakistan!',
  announcementBg:      'bg-brand',

  // ── Social Links ────────────────────────────────────────────────────────
  facebookUrl:    'https://facebook.com',
  instagramUrl:   'https://instagram.com',
}

// ── Read settings ───────────────────────────────────────────────────────────
export function getSettings() {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_SETTINGS }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      // Merge with defaults so new keys always have values
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
    }
  } catch {}
  return { ...DEFAULT_SETTINGS }
}

// ── Save settings ───────────────────────────────────────────────────────────
export function saveSettings(settings) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }
}

// ── React hook ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'

export function useSettings() {
  const [settings, setSettings] = useState(getSettings)

  const update = (patch) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    saveSettings(next)
  }

  // Re-read if storage changes from another tab
  useEffect(() => {
    const handler = (e) => {
      if (e.key === SETTINGS_KEY) setSettings(getSettings())
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return [settings, update]
}
