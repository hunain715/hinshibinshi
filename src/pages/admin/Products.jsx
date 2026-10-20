import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Copy, Star, Search, X, Loader2, Package } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { formatPrice, stockStatus, slugify } from "@/lib/admin";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        base44.entities.Product.list("-created_date", 200),
        base44.entities.Category.list("-created_date", 200),
      ]);
      setProducts(p);
      setCategories(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const catName = (id) => {
    const c = categories.find((x) => x.id === id);
    return c ? c.name : id && id.length > 20 ? "—" : id || "—";
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => (p.title || "").toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "all") list = list.filter((p) => p.category === categoryFilter);
    if (statusFilter !== "all") list = list.filter((p) => p.status === statusFilter);
    switch (sort) {
      case "price-asc": list.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case "price-desc": list.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case "stock-asc": list.sort((a, b) => (a.stock_quantity || 0) - (b.stock_quantity || 0)); break;
      case "title": list.sort((a, b) => (a.title || "").localeCompare(b.title || "")); break;
      default: break;
    }
    return list;
  }, [products, search, categoryFilter, statusFilter, sort]);

  const handleSave = async ({ form, images }) => {
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug || slugify(form.title),
        description: form.description,
        price: Number(form.price),
        sale_price: form.sale_price === "" ? null : Number(form.sale_price),
        category: form.category,
        sku: form.sku,
        stock_quantity: form.stock_quantity === "" ? 0 : Number(form.stock_quantity),
        status: form.status,
        featured: !!form.featured,
        images: images || [],
        primary_image: (images && images[0]) || "",
      };
      if (editing?.id) {
        await base44.entities.Product.update(editing.id, payload);
      } else {
        await base44.entities.Product.create(payload);
      }
      setEditing(null);
      await loadAll();
    } catch (e) {
      console.error(e);
      alert("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (product) => {
    try {
      await base44.entities.Product.create({
        title: `${product.title} (Copy)`,
        slug: slugify(`${product.title} copy`),
        description: product.description,
        price: product.price,
        sale_price: product.sale_price,
        category: product.category,
        sku: "",
        stock_quantity: product.stock_quantity || 0,
        status: "inactive",
        featured: false,
        images: product.images || [],
        primary_image: product.primary_image || "",
      });
      await loadAll();
    } catch (e) {
      console.error(e);
      alert("Failed to duplicate product.");
    }
  };

  const toggleStatus = async (product) => {
    try {
      await base44.entities.Product.update(product.id, {
        status: product.status === "active" ? "inactive" : "active",
      });
      await loadAll();
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  const toggleFeatured = async (product) => {
    try {
      await base44.entities.Product.update(product.id, { featured: !product.featured });
      await loadAll();
    } catch (e) {
      alert("Failed to update featured status.");
    }
  };

  const confirmDelete = async () => {
    try {
      await base44.entities.Product.delete(toDelete.id);
      setToDelete(null);
      await loadAll();
    } catch (e) {
      alert("Failed to delete product.");
    }
  };

  const editingImages = editing?.id ? editing.images || [] : [];

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto min-h-screen bg-surface-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="font-mono-body text-[11px] uppercase tracking-[0.3em] text-brand mb-3 block">Catalog</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark">Products</h1>
        </div>
        <button onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-mono-body text-[12px] uppercase tracking-widest font-semibold rounded-xl hover:bg-brand-dark transition-colors shadow-brand-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col lg:flex-row gap-3 lg:items-center shadow-card">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or SKU…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl font-mono-body text-sm bg-surface-2 border border-gray-200 text-dark placeholder:text-gray-400 focus:border-brand outline-none transition-colors"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl font-mono-body text-sm bg-surface-2 border border-gray-200 text-dark focus:border-brand outline-none">
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl font-mono-body text-sm bg-surface-2 border border-gray-200 text-dark focus:border-brand outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-xl font-mono-body text-sm bg-surface-2 border border-gray-200 text-dark focus:border-brand outline-none">
          <option value="newest">Newest</option>
          <option value="title">Title A–Z</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="stock-asc">Stock ↑</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32"><Loader2 size={32} className="animate-spin text-cobalt" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-6">
            <Package size={28} className="text-gray-400" />
          </div>
          <h3 className="font-heading text-xl font-bold text-dark mb-2">No products found</h3>
          <p className="font-mono-body text-muted mb-6">Add a product or adjust your filters.</p>
          <button onClick={() => setEditing({})} className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-mono-body text-[12px] uppercase tracking-widest font-semibold rounded-xl hover:bg-brand-dark transition-colors shadow-brand-sm">
            <Plus size={16} /> Add Product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-card">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100 text-left bg-surface-2">
                <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-4 py-3">Product</th>
                <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-4 py-3">Category</th>
                <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-4 py-3">Price</th>
                <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-4 py-3">Stock</th>
                <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-4 py-3">Status</th>
                <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-4 py-3 text-center">Featured</th>
                <th className="font-mono-body text-[10px] uppercase tracking-widest text-muted px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const st = stockStatus(p.stock_quantity);
                const toneText = { in: "text-green-600", low: "text-amber-600", out: "text-red-500" }[st.tone];
                const toneBg   = { in: "bg-green-50",    low: "bg-amber-50",    out: "bg-red-50"   }[st.tone];
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-surface-2 shrink-0 border border-gray-100">
                          {p.primary_image && <img src={p.primary_image} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono-body text-sm text-dark truncate max-w-[200px]">{p.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {p.sku && <p className="font-mono-body text-[10px] text-muted">SKU: {p.sku}</p>}
                            {p.condition && (
                              <span className={`text-[9px] font-mono-body uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold ${p.condition === 'new' ? 'badge-new' : 'badge-refurbished'}`}>
                                {p.condition}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono-body text-sm text-muted">{catName(p.category)}</td>
                    <td className="px-4 py-3">
                      <span className="font-heading text-sm font-bold text-dark">{formatPrice(p.price)}</span>
                      {p.sale_price != null && p.sale_price > 0 && p.sale_price < p.price && (
                        <p className="font-mono-body text-[10px] text-brand">Sale {formatPrice(p.sale_price)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-mono-body text-xs font-semibold ${toneText} ${toneBg}`}>
                        {p.stock_quantity || 0} — {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(p)}
                        className={`px-3 py-1.5 rounded-lg font-mono-body text-[10px] uppercase tracking-widest font-semibold transition-colors ${
                          p.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}>
                        {p.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleFeatured(p)} title="Toggle featured"
                        className={`p-1.5 rounded-full transition-colors ${p.featured ? "text-brand" : "text-gray-300 hover:text-gray-400"}`}>
                        <Star size={16} fill={p.featured ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setEditing(p)} title="Edit" className="w-8 h-8 rounded-xl border border-gray-200 hover:border-brand hover:text-brand text-gray-500 flex items-center justify-center transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDuplicate(p)} title="Duplicate" className="w-8 h-8 rounded-xl border border-gray-200 hover:border-brand hover:text-brand text-gray-500 flex items-center justify-center transition-colors">
                          <Copy size={14} />
                        </button>
                        <button onClick={() => setToDelete(p)} title="Delete" className="w-8 h-8 rounded-xl border border-gray-200 hover:border-red-400 hover:text-red-500 text-gray-500 flex items-center justify-center transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-heading text-2xl font-bold text-dark">{editing?.id ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-xl border border-gray-200 hover:border-gray-300 text-dark-3 flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
            </div>
            <ProductForm
              product={editing?.id ? editing : null}
              images={editingImages}
              existingProducts={products}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this product?"
        message={`"${toDelete?.title}" will be permanently removed from the catalog. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}