'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { productService, categoryService } from '@/services';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, pageSize: 12 };
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const data = await productService.getAll(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { categoryService.getAll().then(setCategories); }, []);

  const clearFilters = () => {
    setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', sort: '' });
    setPage(1);
  };

  const hasFilters = filters.keyword || filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Discover
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '600' }}>
            {filters.keyword ? `Search: "${filters.keyword}"` : 'All Collections'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{total} products</span>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                color: 'var(--color-text)', padding: '0.5rem 1rem', borderRadius: '6px',
                cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <SlidersHorizontal size={15} /> Filters
              {hasFilters && <span className="badge">{[filters.keyword, filters.category, filters.minPrice, filters.maxPrice].filter(Boolean).length}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="glass" style={{ borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Search</label>
            <input className="input-field" value={filters.keyword} onChange={(e) => setFilters(f => ({ ...f, keyword: e.target.value }))} placeholder="Search products..." />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Category</label>
            <select className="input-field" value={filters.category} onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
              style={{ appearance: 'none', cursor: 'pointer' }}>
              <option value="">All Categories</option>
              {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Min Price</label>
            <input className="input-field" type="number" value={filters.minPrice} onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))} placeholder="$0" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Max Price</label>
            <input className="input-field" type="number" value={filters.maxPrice} onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))} placeholder="$9999" />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => { setPage(1); fetchProducts(); }} className="btn-primary" style={{ flex: 1, padding: '0.65rem' }}>Apply</button>
            {hasFilters && (
              <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-muted)', padding: '0.65rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--color-muted)' }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No products found</p>
          <p style={{ fontSize: '0.875rem' }}>Try adjusting your filters</p>
          {hasFilters && <button onClick={clearFilters} className="btn-outline" style={{ marginTop: '1.5rem' }}>Clear Filters</button>}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '0.5rem 1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: page === 1 ? 'var(--color-muted)' : 'var(--color-text)', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
                Prev
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ padding: '0.5rem 1rem', background: p === page ? 'var(--color-accent)' : 'var(--color-surface)', border: '1px solid', borderColor: p === page ? 'var(--color-accent)' : 'var(--color-border)', color: p === page ? '#0d0d0d' : 'var(--color-text)', borderRadius: '4px', cursor: 'pointer', fontWeight: p === page ? '700' : '400' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                style={{ padding: '0.5rem 1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: page === pages ? 'var(--color-muted)' : 'var(--color-text)', borderRadius: '4px', cursor: page === pages ? 'not-allowed' : 'pointer' }}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
