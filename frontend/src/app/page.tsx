'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { productService, categoryService } from '@/services';
import { ArrowRight, Sparkles, Shield, Truck, RefreshCw } from 'lucide-react';

const HERO_SLIDES = [
  {
    title: 'The Art of\nModern Elegance',
    subtitle: 'Spring / Summer 2026 Collection',
    cta: 'Explore Collection',
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #0d0d0d 100%)',
    accent: '#c9a84c',
  },
  {
    title: 'Redefine\nYour Style',
    subtitle: 'Exclusive Pieces, Timeless Design',
    cta: 'Shop Now',
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a0a2e 50%, #0d0d0d 100%)',
    accent: '#c9a84c',
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, cData] = await Promise.all([
          productService.getAll({ pageSize: 8 }),
          categoryService.getAll(),
        ]);
        setProducts(pData.products || []);
        setCategories(cData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <>
      {/* ── Hero Section ── */}
      <section style={{
        minHeight: '100vh',
        background: current.bg,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 1s ease',
      }}>
        {/* Animated circles */}
        <div style={{
          position: 'absolute', top: '20%', right: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} className="animate-float" />
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '20px', padding: '6px 16px', marginBottom: '2rem',
            }}>
              <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
                {current.subtitle}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: '700',
              lineHeight: '1.1',
              marginBottom: '1.5rem',
              whiteSpace: 'pre-line',
            }}>
              <span className="text-gold">{current.title.split('\n')[0]}</span>
              <br />
              <span style={{ color: 'var(--color-text)' }}>{current.title.split('\n')[1]}</span>
            </h1>

            <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '480px', lineHeight: '1.7' }}>
              Discover handpicked pieces that merge contemporary design with timeless sophistication.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/shop" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {current.cta} <ArrowRight size={16} />
              </Link>
              <Link href="/shop" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                New Arrivals
              </Link>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{
              width: i === slide ? '24px' : '8px', height: '8px',
              borderRadius: '4px', background: i === slide ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, transparent, var(--color-accent))' }} />
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll</span>
        </div>
      </section>

      {/* ── Feature Badges ── */}
      <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {[
              { Icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
              { Icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
              { Icon: Shield, title: 'Secure Payment', desc: 'SSL encrypted checkout' },
              { Icon: Sparkles, title: 'Premium Quality', desc: 'Curated collections' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'rgba(201,168,76,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={20} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{title}</p>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Browse by</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '600' }}>
                Shop <span className="text-gold">Categories</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {categories.map((cat: any) => (
                <Link key={cat._id} href={`/shop?category=${cat.name.toLowerCase()}`} style={{ display: 'block' }}>
                  <div style={{
                    position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden',
                    border: '1px solid var(--color-border)', transition: 'all 0.3s',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-accent)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      <section className="section" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Handpicked for you</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '600' }}>
                Featured <span className="text-gold">Products</span>
              </h2>
            </div>
            <Link href="/shop" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-muted)' }}>
              <p>No products yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Banner CTA ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0d0d0d 100%)',
        borderTop: '1px solid rgba(201,168,76,0.2)',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Limited Time Offer
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '700', marginBottom: '1rem' }}>
            Up to <span className="text-gold">40% Off</span><br />New Season Styles
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginBottom: '2.5rem', maxWidth: '450px', margin: '0 auto 2.5rem' }}>
            Don&apos;t miss out on our seasonal sale. Premium fashion at unbeatable prices.
          </p>
          <Link href="/shop" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '1rem 2.5rem' }}>
            Shop the Sale <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
