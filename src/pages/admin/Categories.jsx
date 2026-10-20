import React, { useState, useEffect } from 'react'
import { base44 } from '@/api/base44Client'
import { Plus, Trash2, Pencil, Check, X, Layers3, Loader2, AlertCircle, Printer, ScanLine, Monitor, Wrench } from 'lucide-react'

const CAT_ICONS = { printers: Printer, scanners: ScanLine, terminals: Monitor, accessories: Wrench }

export default function Categories() {
  const [rows,     setRows]     = useState([])
  const [name,     setName]     = useState('')
  const [loading,  setLoading]  = useState(true)
  const [adding,   setAdding]   = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  // editing state: { id, value }
  const [editing,  setEditing]  = useState(null)
  const [saving,   setSaving]   = useState(false)

  const load = async () => {
    setLoading(true)
    try { setRows(await base44.entities.Category.list()) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!name.trim()) return
    setAdding(true)
    try { await base44.entities.Category.create({ name: name.trim() }); setName(''); await load() }
    finally { setAdding(false) }
  }

  const handleRename = async () => {
    if (!editing || !editing.value.trim()) return
    setSaving(true)
    try {
      await base44.entities.Category.update(editing.id, { name: editing.value.trim() })
      setEditing(null)
      await load()
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try { await base44.entities.Category.delete(toDelete.id); setToDelete(null); await load() }
    finally { setDeleting(false) }
  }

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="max-w-[900px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono-body text-[10px] uppercase tracking-widest text-brand mb-1">Admin</p>
          <h1 className="font-heading text-3xl font-black text-dark">Categories</h1>
          <p className="text-muted text-sm mt-1">Add, rename, or delete product categories</p>
        </div>

        {/* Add */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 mb-6">
          <h2 className="font-heading font-bold text-dark mb-4 flex items-center gap-2">
            <Plus size={18} className="text-brand" /> Add New Category
          </h2>
          <div className="flex gap-3">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Category name (e.g. Monitors, Keyboards…)"
              className="input-white flex-1 text-sm"
            />
            <button
              onClick={handleAdd}
              disabled={adding || !name.trim()}
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-brand-sm disabled:opacity-50 whitespace-nowrap"
            >
              {adding ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              Add
            </button>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-dark">All Categories</h2>
            <span className="font-mono-body text-[11px] text-muted">{rows.length} total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} className="animate-spin text-brand" />
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-16">
              <Layers3 size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-muted">No categories yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map(cat => {
                const CatIcon = CAT_ICONS[cat.id] || Layers3
                return (
                <div key={cat.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-2 transition-colors group">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                    <CatIcon size={18} className="text-brand" />
                  </div>

                  {/* Name — edit mode or display mode */}
                  <div className="flex-1 min-w-0">
                    {editing?.id === cat.id ? (
                      <input
                        autoFocus
                        value={editing.value}
                        onChange={e => setEditing({ ...editing, value: e.target.value })}
                        onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(null) }}
                        className="input-white text-sm w-full max-w-xs"
                      />
                    ) : (
                      <>
                        <p className="font-heading font-semibold text-dark">{cat.name}</p>
                        <p className="font-mono-body text-[10px] text-muted uppercase tracking-wider mt-0.5">ID: {cat.id}</p>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {editing?.id === cat.id ? (
                      <>
                        <button
                          onClick={handleRename}
                          disabled={saving}
                          className="w-8 h-8 rounded-xl bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center transition-colors"
                          title="Save"
                        >
                          {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />}
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditing({ id: cat.id, value: cat.name })}
                          className="w-8 h-8 rounded-xl border border-gray-200 hover:border-brand hover:text-brand text-gray-400 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                          title="Rename"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setToDelete(cat)}
                          className="w-8 h-8 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="mt-4 flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <AlertCircle size={16} className="text-yellow-600 mt-0.5 shrink-0" />
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> Deleting a category won't delete its products — they'll just show "—" as category. Rename is safe to use anytime.
          </p>
        </div>

      </div>

      {/* Delete confirm modal */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setToDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full border border-gray-200">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="font-heading text-lg font-bold text-dark text-center">Delete Category?</h3>
            <p className="text-muted text-sm text-center mt-2 mb-6">
              "<strong>{toDelete.name}</strong>" will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setToDelete(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-dark-3 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
