import React, { useState } from 'react'
import { base44 } from '@/api/base44Client'
import { Mail, Phone, MapPin, Clock, CheckCircle, Loader2, Send } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', business_type:'', message:'' })
  const [sent, setSent]   = useState(false)
  const [busy, setBusy]   = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async e => {
    e.preventDefault()
    setBusy(true)
    try {
      await base44.entities.Lead.create(form)
      setSent(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white min-h-screen pt-16 md:pt-20">

      {/* Hero */}
      <section className="hero-gradient pt-12 pb-12">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-[11px] font-mono-body uppercase tracking-widest mb-4">
            Contact Us
          </span>
          <h1 className="font-heading text-4xl lg:text-5xl font-black text-dark">
            Get in Touch With Us
          </h1>
          <p className="text-muted mt-3 text-lg max-w-xl mx-auto leading-relaxed">
            Looking for a POS setup, spare parts, or a custom quote? We're here to help.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-[1100px] mx-auto px-6 grid md:grid-cols-[1fr_1.4fr] gap-10">

          {/* Left — contact info */}
          <div>
            <h2 className="font-heading text-xl font-bold text-dark mb-6">Contact Information</h2>

            <div className="space-y-4">
              {[
                { icon: Phone,   label: 'Phone',   value: '0336-3376630',             href: 'tel:+923363376630' },
                { icon: Mail,    label: 'Email',   value: 'binshihinshi@gmail.com',   href: 'mailto:binshihinshi@gmail.com' },
                { icon: MapPin,  label: 'Address', value: 'Karachi, Pakistan',        href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 p-4 bg-surface-2 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-brand" />
                  </div>
                  <div>
                    <p className="font-mono-body text-[10px] uppercase tracking-widest text-muted">{label}</p>
                    {href
                      ? <a href={href} className="font-semibold text-dark hover:text-brand transition-colors">{value}</a>
                      : <p className="font-semibold text-dark">{value}</p>
                    }
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-4 p-4 bg-surface-2 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-brand" />
                </div>
                <div>
                  <p className="font-mono-body text-[10px] uppercase tracking-widest text-muted mb-1">Business Hours</p>
                  <p className="font-semibold text-dark text-sm">Mon – Sat: 9:00 AM – 7:00 PM</p>
                  <p className="text-muted text-sm">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/923000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-7">
            {sent ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-dark">Message Sent!</h3>
                <p className="text-muted mt-2">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name:'', email:'', phone:'', business_type:'', message:'' }) }}
                  className="mt-6 text-brand font-semibold hover:underline text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-heading text-xl font-bold text-dark mb-5">Send us a Message</h2>
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono-body text-[11px] uppercase tracking-wider text-dark-3 mb-1.5">
                        Full Name <span className="text-brand">*</span>
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="Muhammad Ali"
                        className="input-white w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-body text-[11px] uppercase tracking-wider text-dark-3 mb-1.5">
                        Phone
                      </label>
                      <input
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        placeholder="+92 300 0000000"
                        className="input-white w-full text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono-body text-[11px] uppercase tracking-wider text-dark-3 mb-1.5">
                      Email <span className="text-brand">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="ali@example.com"
                      className="input-white w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-body text-[11px] uppercase tracking-wider text-dark-3 mb-1.5">
                      Business Type
                    </label>
                    <select
                      value={form.business_type}
                      onChange={e => set('business_type', e.target.value)}
                      className="input-white w-full text-sm"
                    >
                      <option value="">— Select your business —</option>
                      <option>Restaurant / Fast Food</option>
                      <option>Retail / Boutique</option>
                      <option>Grocery / Supermarket</option>
                      <option>Pharmacy</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono-body text-[11px] uppercase tracking-wider text-dark-3 mb-1.5">
                      Message <span className="text-brand">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={e => set('message', e.target.value)}
                      placeholder="Tell us what you need — printer, scanner, full POS setup, etc."
                      className="input-white w-full text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold transition-colors shadow-brand-sm disabled:opacity-50"
                  >
                    {busy
                      ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                      : <><Send size={15} /> Send Message</>
                    }
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
