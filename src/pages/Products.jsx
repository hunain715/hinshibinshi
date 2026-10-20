import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { base44 } from '@/api/base44Client'
import { ProductCard } from './_StorePage'
import { Search, X, Package, SlidersHorizontal } from 'lucide-react'

const CATEGORIES = [
  { id:'all',         label:'All' },
  { id:'printers',    label:'Printers' },
  { id:'scanners',    label:'Scanners' },
  { id:'terminals',   label:'Terminals' },
  { id:'accessories', label:'Accessories' },
]

const CONDITIONS = [
  { id:'all',         label:'All' },
  { id:'new',         label:'New' },
  { id:'refurbished', label:'Refurbished' },
]

export default function Products() {
  const [searchParams] = useSearchParams()
  const [products,  setProducts]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState(searchParams.get('search') || '')
  const [category,  setCategory]  = useState(searchParams.get('category') || 'all')
  const [condition, setCondition] = useState(searchParams.get('condition') || 'all')
  const [sort,      setSort]      = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setLoading(true)
    base44.entities.Product.list('-created_date', 500).then(p => {
      setProducts(p); setLoading(false)
    })
  }, [])

  useEffect(() => {
    const cat  = searchParams.get('category')
    const cond = searchParams.get('condition')
    const q    = searchParams.get('search')
    if (cat)  setCategory(cat)
    if (cond) setCondition(cond)
    if (q)    setSearch(q)
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = products.filter(p => p.status === 'active')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.title?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q))
    }
    if (category !== 'all') list = list.filter(p => p.category === category)
    if (condition !== 'all') {
      list = list.filter(p => (p.condition || 'new').toLowerCase() === condition)
    }
    switch (sort) {
      case 'price-asc':  list = [...list].sort((a,b) => (a.sale_price??a.price) - (b.sale_price??b.price)); break
      case 'price-desc': list = [...list].sort((a,b) => (b.sale_price??b.price) - (a.sale_price??a.price)); break
      case 'name-az':    list = [...list].sort((a,b) => a.title.localeCompare(b.title)); break
      default: break
    }
    return list
  }, [products, search, category, condition, sort])

  const clearFilters = () => { setSearch(''); setCategory('all'); setCondition('all'); setSort('newest') }
  const hasFilters = search || category !== 'all' || condition !== 'all' || sort !== 'newest'

  return (
    <div className="bg-surface-2 min-h-screen pt-16 md:pt-20 pb-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-5 md:py-8">

        {/* Header */}
        <div className="mb-4 md:mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono-body text-[10px] uppercase tracking-widest text-brand">Catalog</p>
            <h1 className="font-heading text-2xl md:text-4xl font-black text-dark mt-0.5">
              Products
              {!loading && <span className="text-muted font-normal text-base md:text-xl ml-2">({filtered.length})</span>}
            </h1>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-dark-3 shadow-sm"
          >
            <SlidersHorizontal size={15} className="text-brand" />
            Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-brand"></span>}
          </button>
        </div>

        {/* ── DESKTOP filter bar ── */}
        <div className="hidden md:flex bg-white rounded-2xl border border-gray-200 shadow-card p-4 mb-6 flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="input-white w-full pl-9 text-sm" />
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)}
                className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-colors ${
                  category === c.id ? 'bg-brand text-white shadow-brand-sm' : 'bg-surface-2 text-dark-3 hover:bg-brand-pale hover:text-brand'
                }`}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Condition */}
          <div className="flex gap-1 border border-gray-200 rounded-xl p-1 bg-surface-2">
            {CONDITIONS.map(c => (
              <button key={c.id} onClick={() => setCondition(c.id)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  condition === c.id ? 'bg-white text-dark shadow-sm' : 'text-muted hover:text-dark'
                }`}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)} className="input-white text-sm py-2 min-w-[140px]">
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-muted hover:text-brand transition-colors">
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* ── MOBILE filter panel ── */}
        {showFilters && (
          <div className="md:hidden bg-white rounded-2xl border border-gray-200 shadow-card p-4 mb-5 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
                className="input-white w-full pl-9 text-sm" />
            </div>

            {/* Category - scrollable row */}
            <div>
              <p className="font-mono-body text-[10px] uppercase tracking-wider text-muted mb-2">Category</p>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setCategory(c.id)}
                    className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-colors ${
                      category === c.id ? 'bg-brand text-white' : 'bg-surface-2 text-dark-3'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div>
              <p className="font-mono-body text-[10px] uppercase tracking-wider text-muted mb-2">Condition</p>
              <div className="grid grid-cols-3 gap-2">
                {CONDITIONS.map(c => (
                  <button key={c.id} onClick={() => setCondition(c.id)}
                    className={`py-2 rounded-xl text-[12px] font-semibold border-2 transition-all ${
                      condition === c.id ? 'border-brand bg-brand-pale text-brand' : 'border-gray-200 text-muted'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="font-mono-body text-[10px] uppercase tracking-wider text-muted mb-2">Sort By</p>
              <select value={sort} onChange={e => setSort(e.target.value)} className="input-white w-full text-sm">
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
              </select>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={clearFilters} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-muted">
                Clear All
              </button>
              <button onClick={() => setShowFilters(false)}
                className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold">
                Show {filtered.length} Products
              </button>
            </div>
          </div>
        )}

        {/* Active filter chips - mobile */}
        {hasFilters && !showFilters && (
          <div className="md:hidden flex gap-2 flex-wrap mb-4">
            {category !== 'all' && (
              <span className="flex items-center gap-1 bg-brand-pale text-brand text-xs font-semibold px-3 py-1 rounded-full">
                {CATEGORIES.find(c=>c.id===category)?.label}
                <button onClick={() => setCategory('all')}><X size={11}/></button>
              </span>
            )}
            {condition !== 'all' && (
              <span className="flex items-center gap-1 bg-brand-pale text-brand text-xs font-semibold px-3 py-1 rounded-full">
                {CONDITIONS.find(c=>c.id===condition)?.label}
                <button onClick={() => setCondition('all')}><X size={11}/></button>
              </span>
            )}
            {search && (
              <span className="flex items-center gap-1 bg-brand-pale text-brand text-xs font-semibold px-3 py-1 rounded-full">
                "{search}"
                <button onClick={() => setSearch('')}><X size={11}/></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-muted hover:text-brand">Clear all</button>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {Array.from({length:8}).map((_,i)=>(
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-100" />
                <div className="p-3 md:p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3"/>
                  <div className="h-4 bg-gray-100 rounded w-3/4"/>
                  <div className="h-4 bg-gray-100 rounded w-1/2"/>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 md:py-24 bg-white rounded-2xl border border-gray-200">
            <Package size={36} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-heading text-lg md:text-xl font-bold text-dark mb-2">No products found</h3>
            <p className="text-muted mb-4 text-sm">Try adjusting your filters.</p>
            <button onClick={clearFilters} className="text-brand font-semibold hover:underline text-sm">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
