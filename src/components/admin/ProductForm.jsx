import React, { useMemo, useState, useEffect } from 'react'
import { slugify } from '@/lib/admin'
import { base44 } from '@/api/base44Client'
import { Loader2 } from 'lucide-react'

const inputCls = 'input-white w-full text-sm'
const labelCls = 'block font-mono-body text-[11px] uppercase tracking-wider text-dark-3 mb-1.5'

export default function ProductForm({ product, images = [], onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    title:          product?.title          || '',
    slug:           product?.slug           || '',
    description:    product?.description    || '',
    price:          product?.price          ?? '',
    sale_price:     product?.sale_price     ?? '',
    category:       product?.category       || '',
    condition:      product?.condition      || 'new',
    sku:            product?.sku            || '',
    stock_quantity: product?.stock_quantity ?? 0,
    status:         product?.status         || 'active',
    featured:       !!product?.featured,
  })
  const [imgs, setImgs] = useState(images.length ? images : (product?.images || []))
  const [imgUrl, setImgUrl] = useState('')
  // ── Live categories from DB ──────────────────────────────────────
  const [categories, setCategories] = useState([])
  useEffect(() => {
    base44.entities.Category.list('name').then(setCategories).catch(() => {})
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const valid = useMemo(() =>
    form.title.trim() && Number(form.price) >= 0,
    [form]
  )

  const addImage = () => {
    if (!imgUrl.trim()) return
    setImgs(prev => [...prev, imgUrl.trim()])
    setImgUrl('')
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (valid) onSave({ form: { ...form, slug: form.slug || slugify(form.title) }, images: imgs })
      }}
      className="space-y-5"
    >
      {/* Title */}
      <div>
        <label className={labelCls}>Title <span className="text-brand">*</span></label>
        <input
          value={form.title}
          onChange={e => { set('title', e.target.value); if (!product?.slug) set('slug', slugify(e.target.value)) }}
          className={inputCls}
          placeholder="e.g. Epson TM-T82III Thermal Printer"
        />
      </div>

      {/* Price row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Price (PKR) <span className="text-brand">*</span></label>
          <input
            type="number" min="0" value={form.price}
            onChange={e => set('price', e.target.value)}
            className={inputCls} placeholder="e.g. 18500"
          />
        </div>
        <div>
          <label className={labelCls}>Sale Price (PKR)</label>
          <input
            type="number" min="0" value={form.sale_price}
            onChange={e => set('sale_price', e.target.value)}
            className={inputCls} placeholder="Leave blank if no sale"
          />
        </div>
      </div>

      {/* Category + Condition */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
            <option value="">— Select category —</option>
            {categories.length > 0
              ? categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))
              : (
                // fallback if DB empty
                <>
                  <option value="printers">Printers</option>
                  <option value="scanners">Scanners</option>
                  <option value="terminals">POS Terminals</option>
                  <option value="accessories">Accessories</option>
                </>
              )
            }
          </select>
        </div>
        <div>
          <label className={labelCls}>Condition <span className="text-brand">*</span></label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => set('condition', 'new')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                form.condition === 'new'
                  ? 'bg-orange-50 border-brand text-brand'
                  : 'bg-white border-gray-200 text-muted hover:border-brand hover:text-brand'
              }`}
            >
              New
            </button>
            <button
              type="button"
              onClick={() => set('condition', 'refurbished')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                form.condition === 'refurbished'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-white border-gray-200 text-muted hover:border-green-400 hover:text-green-600'
              }`}
            >
              Refurbished
            </button>
          </div>
        </div>
      </div>

      {/* SKU + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>SKU</label>
          <input
            value={form.sku}
            onChange={e => set('sku', e.target.value)}
            className={inputCls} placeholder="e.g. HB-PR-001"
          />
        </div>
        <div>
          <label className={labelCls}>Stock Quantity</label>
          <input
            type="number" min="0" value={form.stock_quantity}
            onChange={e => set('stock_quantity', e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          rows={4} value={form.description}
          onChange={e => set('description', e.target.value)}
          className={`${inputCls} resize-none`}
          placeholder="Product description…"
        />
      </div>

      {/* Image URL */}
      <div>
        <label className={labelCls}>Product Image URL</label>
        <div className="flex gap-2">
          <input
            value={imgUrl}
            onChange={e => setImgUrl(e.target.value)}
            className={`${inputCls} flex-1`}
            placeholder="https://example.com/image.jpg"
          />
          <button
            type="button"
            onClick={addImage}
            className="px-4 py-2 rounded-xl bg-brand-pale text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-colors"
          >
            Add
          </button>
        </div>
        {imgs.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {imgs.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                <button
                  type="button"
                  onClick={() => setImgs(imgs.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status + Featured */}
      <div className="flex items-center gap-5 pt-1">
        <div>
          <label className={labelCls}>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)} className="input-white text-sm py-2">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer mt-4">
          <div
            onClick={() => set('featured', !form.featured)}
            className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${form.featured ? 'bg-brand' : 'bg-gray-200'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm font-semibold text-dark">Featured on homepage</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-dark-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || !valid}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors shadow-brand-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? 'Saving…' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}
