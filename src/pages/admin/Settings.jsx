import React, { useState } from 'react'
import { useSettings } from '@/lib/siteSettings'
import {
  Phone, Truck,
  Save, CheckCircle, AlertCircle, Globe, Megaphone,
  Share2
} from 'lucide-react'

const TABS = [
  { id: 'general',      label: 'General',      icon: Globe },
  { id: 'contact',      label: 'Contact',      icon: Phone },
  { id: 'shipping',     label: 'Shipping',     icon: Truck },
  { id: 'announcement', label: 'Announcement', icon: Megaphone },
  { id: 'social',       label: 'Social',       icon: Share2 },
]

// Reusable field components
const Label = ({ children, required }) => (
  <label className="block font-mono-body text-[11px] uppercase tracking-wider text-dark-3 mb-1.5">
    {children} {required && <span className="text-brand">*</span>}
  </label>
)
const Input = ({ value, onChange, placeholder, type = 'text', ...rest }) => (
  <input
    type={type}
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className="input-white w-full text-sm"
    {...rest}
  />
)
const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="input-white w-full text-sm resize-none"
  />
)
const Toggle = ({ value, onChange, label, desc }) => (
  <div className="flex items-center justify-between p-4 bg-surface-2 rounded-xl">
    <div>
      <p className="font-semibold text-dark text-sm">{label}</p>
      {desc && <p className="text-muted text-xs mt-0.5">{desc}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${value ? 'bg-brand' : 'bg-gray-300'}`}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
)
const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 space-y-4">
    {title && <h3 className="font-heading font-bold text-dark border-b border-gray-100 pb-3">{title}</h3>}
    {children}
  </div>
)

export default function Settings() {
  const [settings, update] = useSettings()
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const [local, setLocal] = useState({ ...settings })

  const set = (key, val) => setLocal(s => ({ ...s, [key]: val }))

  const handleSave = () => {
    update(local)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const hasChanges = JSON.stringify(local) !== JSON.stringify(settings)

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="max-w-[1000px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-mono-body text-[10px] uppercase tracking-widest text-brand mb-1">Admin</p>
            <h1 className="font-heading text-3xl font-black text-dark">Site Settings</h1>
            <p className="text-muted text-sm mt-1">Control everything on your website from here</p>
          </div>
          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-brand-sm ${
              saved
                ? 'bg-green-500 text-white'
                : hasChanges
                ? 'bg-brand hover:bg-brand-dark text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!hasChanges && !saved}
          >
            {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
          </button>
        </div>

        {/* Unsaved notice */}
        {hasChanges && (
          <div className="flex items-center gap-2.5 p-3.5 bg-yellow-50 border border-yellow-200 rounded-xl mb-5">
            <AlertCircle size={15} className="text-yellow-600 shrink-0" />
            <p className="text-yellow-700 text-sm font-medium">You have unsaved changes — click "Save Changes" to apply.</p>
          </div>
        )}

        <div className="flex gap-6">

          {/* Sidebar tabs */}
          <div className="w-44 shrink-0 space-y-1">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-brand text-white shadow-brand-sm'
                      : 'text-dark-3 hover:bg-white hover:text-dark'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 space-y-5">

            {/* ── GENERAL ── */}
            {activeTab === 'general' && (
              <>
                <Card title="Store Identity">
                  <div>
                    <Label>Store Name</Label>
                    <Input value={local.siteName} onChange={v => set('siteName', v)} placeholder="Hinshi Binshi" />
                  </div>
                  <div>
                    <Label>Tagline</Label>
                    <Input value={local.tagline} onChange={v => set('tagline', v)} placeholder="Point of Sales Solutions" />
                  </div>
                </Card>
                <Card title="Homepage Hero Banner">
                  <div>
                    <Label>Hero Main Title</Label>
                    <Input value={local.heroTitle} onChange={v => set('heroTitle', v)} placeholder="Point of Sales Hardware..." />
                    <p className="text-xs text-muted mt-1">Bold text shown on homepage top section</p>
                  </div>
                  <div>
                    <Label>Hero Subtitle</Label>
                    <Textarea value={local.heroSubtitle} onChange={v => set('heroSubtitle', v)} placeholder="Short description..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Button 1 Label</Label>
                      <Input value={local.heroBtn1Label} onChange={v => set('heroBtn1Label', v)} placeholder="Browse Products" />
                    </div>
                    <div>
                      <Label>Button 1 Link</Label>
                      <Input value={local.heroBtn1Link} onChange={v => set('heroBtn1Link', v)} placeholder="/products" />
                    </div>
                    <div>
                      <Label>Button 2 Label</Label>
                      <Input value={local.heroBtn2Label} onChange={v => set('heroBtn2Label', v)} placeholder="Get in touch" />
                    </div>
                    <div>
                      <Label>Button 2 Link</Label>
                      <Input value={local.heroBtn2Link} onChange={v => set('heroBtn2Link', v)} placeholder="/contact" />
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* ── CONTACT ── */}
            {activeTab === 'contact' && (
              <Card title="Contact Information">
                <div>
                  <Label>Phone Number</Label>
                  <Input value={local.phone} onChange={v => set('phone', v)} placeholder="+92 300 0000000" />
                </div>
                <div>
                  <Label>WhatsApp Number</Label>
                  <Input value={local.whatsapp} onChange={v => set('whatsapp', v)} placeholder="923000000000" />
                  <p className="text-xs text-muted mt-1">Format: 92XXXXXXXXXX — no + or spaces. Used for floating button and product page.</p>
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input value={local.email} onChange={v => set('email', v)} type="email" placeholder="binshihinshi@gmail.com" />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={local.address} onChange={v => set('address', v)} placeholder="Karachi, Pakistan" />
                </div>
              </Card>
            )}

            {/* ── SHIPPING ── */}
            {activeTab === 'shipping' && (
              <>
                <Card title="Shipping Configuration">
                  <Toggle
                    value={local.shippingFree}
                    onChange={v => set('shippingFree', v)}
                    label="Free Shipping"
                    desc="Turn ON for free shipping on all orders"
                  />
                  {!local.shippingFree && (
                    <>
                      <div>
                        <Label>Shipping Charge (PKR)</Label>
                        <Input
                          type="number"
                          value={local.shippingCharge}
                          onChange={v => set('shippingCharge', Number(v))}
                          placeholder="250"
                        />
                      </div>
                      <div>
                        <Label>Free Shipping Above (PKR)</Label>
                        <Input
                          type="number"
                          value={local.shippingFreeThreshold}
                          onChange={v => set('shippingFreeThreshold', Number(v))}
                          placeholder="0 = always charge"
                        />
                        <p className="text-xs text-muted mt-1">Set to 0 to always charge. E.g. 5000 = free if order &gt; ₨5,000</p>
                      </div>
                    </>
                  )}
                  <div>
                    <Label>Shipping Note (shown at checkout)</Label>
                    <Input value={local.shippingNote} onChange={v => set('shippingNote', v)} placeholder="Free delivery on all orders..." />
                  </div>
                </Card>

                {/* Preview */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <p className="font-mono-body text-[10px] uppercase tracking-widest text-muted mb-3">Preview — Checkout Summary</p>
                  <div className="flex justify-between text-sm text-muted py-2 border-b border-gray-100">
                    <span>Subtotal</span><span>₨ 15,000</span>
                  </div>
                  <div className="flex justify-between text-sm py-2">
                    <span className="text-muted">Shipping</span>
                    <span className={local.shippingFree || (local.shippingFreeThreshold > 0 && 15000 >= local.shippingFreeThreshold) ? 'text-green-600 font-semibold' : 'text-dark font-semibold'}>
                      {local.shippingFree || (local.shippingFreeThreshold > 0 && 15000 >= local.shippingFreeThreshold)
                        ? 'Free'
                        : `₨ ${local.shippingCharge?.toLocaleString()}`
                      }
                    </span>
                  </div>
                  <p className="text-xs text-brand mt-2">{local.shippingNote}</p>
                </div>
              </>
            )}

            {/* ── ANNOUNCEMENT ── */}
            {activeTab === 'announcement' && (
              <>
                <Card title="Announcement Bar (top of site)">
                  <Toggle
                    value={local.announcementActive}
                    onChange={v => set('announcementActive', v)}
                    label="Show Announcement Bar"
                    desc="Displays a banner at the very top of every page"
                  />
                  <div>
                    <Label>Announcement Text</Label>
                    <Input
                      value={local.announcementText}
                      onChange={v => set('announcementText', v)}
                      placeholder="🎉 Free delivery on all orders!"
                    />
                  </div>
                  <div>
                    <Label>Background Color</Label>
                    <select
                      value={local.announcementBg}
                      onChange={e => set('announcementBg', e.target.value)}
                      className="input-white w-full text-sm"
                    >
                      <option value="bg-brand">Orange (Brand)</option>
                      <option value="bg-dark">Dark / Black</option>
                      <option value="bg-green-600">Green</option>
                      <option value="bg-blue-600">Blue</option>
                      <option value="bg-red-600">Red</option>
                    </select>
                  </div>
                </Card>

                {/* Preview */}
                {local.announcementActive && (
                  <div className={`${local.announcementBg} text-white text-center py-2.5 px-4 rounded-xl text-sm font-medium`}>
                    {local.announcementText || 'Your announcement here'}
                  </div>
                )}
              </>
            )}

            {/* ── SOCIAL ── */}
            {activeTab === 'social' && (
              <Card title="Social Media Links">
                <div>
                  <Label>Facebook URL</Label>
                  <Input value={local.facebookUrl} onChange={v => set('facebookUrl', v)} placeholder="https://facebook.com/yourpage" />
                </div>
                <div>
                  <Label>Instagram URL</Label>
                  <Input value={local.instagramUrl} onChange={v => set('instagramUrl', v)} placeholder="https://instagram.com/yourpage" />
                </div>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
