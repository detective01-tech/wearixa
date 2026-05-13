'use client';
import { useEffect, useState } from 'react';
import { categoryService } from '@/services';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Trash2, Edit, Plus, X, Tag } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (c: any) => {
    setEditingCategory(c);
    setForm({
      name: c.name,
      description: c.description || '',
      image: c.image || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory._id, form);
      } else {
        await categoryService.create(form);
      }
      setShowModal(false);
      setEditingCategory(null);
      setForm({ name: '', description: '', image: '' });
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: '600' }}>Categories</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Manage product categories</p>
        </div>
        <button onClick={() => { setEditingCategory(null); setShowModal(true); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {categories.map((c) => (
            <div key={c._id} className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ height: '140px', background: 'var(--color-surface-2)', position: 'relative' }}>
                <img src={c.image || 'https://placehold.co/400x200?text=' + c.name} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => handleEdit(c)} style={{ background: 'white', border: 'none', color: '#0d0d0d', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(c._id, c.name)} style={{ background: '#f87171', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{c.name}</h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>{c.description || 'No description provided.'}</p>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', border: '1px dashed var(--color-border)', borderRadius: '12px' }}>
              <Tag size={40} style={{ color: 'var(--color-muted)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--color-muted)' }}>No categories found. Create your first one!</p>
            </div>
          )}
        </div>
      )}

      {/* Category Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '440px', borderRadius: '16px' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Name</label>
                <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Description</label>
                <textarea className="input-field" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Image URL</label>
                <input className="input-field" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
