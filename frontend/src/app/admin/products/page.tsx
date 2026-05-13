'use client';
import { useEffect, useState } from 'react';
import { productService, categoryService } from '@/services';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Trash2, Edit, Plus, X, Upload, Search } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [keyword, setKeyword] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    brand: '',
    category: '',
    stock: '',
    images: [] as File[],
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll({ keyword, pageSize: 50 });
      setProducts(data.products || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [keyword]);
  useEffect(() => { categoryService.getAll().then(setCategories); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete product "${title}"?`)) return;
    try {
      await productService.delete(id);
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (p: any) => {
    setEditingProduct(p);
    setForm({
      title: p.title,
      description: p.description,
      price: p.price.toString(),
      discountPrice: p.discountPrice ? p.discountPrice.toString() : '',
      brand: p.brand,
      category: p.category?._id || p.category,
      stock: p.stock.toString(),
      images: [],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('price', form.price);
    if (form.discountPrice) formData.append('discountPrice', form.discountPrice);
    formData.append('brand', form.brand);
    formData.append('category', form.category);
    formData.append('stock', form.stock);
    
    if (form.images.length > 0) {
      form.images.forEach(img => formData.append('images', img));
    }

    try {
      if (editingProduct) {
        await productService.update(editingProduct._id, formData);
      } else {
        await productService.create(formData);
      }
      setShowModal(false);
      setEditingProduct(null);
      setForm({ title: '', description: '', price: '', discountPrice: '', brand: '', category: '', stock: '', images: [] });
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: '600' }}>Products Management</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '4px' }}>{products.length} products total</p>
        </div>
        <button onClick={() => { setEditingProduct(null); setShowModal(true); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
          <input className="input-field" placeholder="Search products..." value={keyword} onChange={e => setKeyword(e.target.value)} style={{ paddingLeft: '40px' }} />
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Brand', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: 'left', color: 'var(--color-muted)', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '52px', borderRadius: '4px', overflow: 'hidden', background: 'var(--color-surface-2)', flexShrink: 0 }}>
                          <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontWeight: '500' }}>{p.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-muted)' }}>{p.category?.name || 'N/A'}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>${p.price.toFixed(2)}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ color: p.stock < 10 ? '#f87171' : 'inherit' }}>{p.stock}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-muted)' }}>{p.brand}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(p)} style={{ background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-muted)', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(p._id, p.title)} style={{ background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-muted)', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '600px', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--color-surface)', zIndex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Title</label>
                <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Description</label>
                <textarea className="input-field" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} required />
              </div>
              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Price ($)</label>
                  <input className="input-field" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Discount ($)</label>
                  <input className="input-field" type="number" step="0.01" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} placeholder="Optional" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Stock</label>
                  <input className="input-field" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Category</label>
                  <select className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                    <option value="">Select Category</option>
                    {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Brand</label>
                  <input className="input-field" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Images</label>
                <div style={{ border: '2px dashed var(--color-border)', borderRadius: '8px', padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  onClick={() => document.getElementById('img-upload')?.click()}
                >
                  <Upload size={32} style={{ color: 'var(--color-muted)', marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>Click to upload images (Max 5)</p>
                  <input id="img-upload" type="file" multiple accept="image/*" onChange={e => {
                    if (e.target.files) setForm(f => ({ ...f, images: Array.from(e.target.files!) }));
                  }} style={{ display: 'none' }} />
                  {form.images.length > 0 && (
                    <p style={{ marginTop: '1rem', color: 'var(--color-accent)', fontWeight: '600' }}>{form.images.length} images selected</p>
                  )}
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '1rem' }}>
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
