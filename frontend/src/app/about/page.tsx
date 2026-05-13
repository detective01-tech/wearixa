'use client';
import { Sparkles, Shield, Heart, Users, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ color: 'var(--color-text)' }}>
      {/* Hero */}
      <section style={{
        padding: '6rem 1.5rem',
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Our Story</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '700', lineHeight: '1.1', marginBottom: '1.5rem' }}>
            Defining the Future of <span className="text-gold">Modern Fashion</span>
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
            Wearixa was founded on the belief that fashion should be a seamless blend of art, quality, and individuality. We curate collections that empower you to express your true self.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/5' }}>
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800" alt="Fashion Design" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1.5rem' }}>The Wearixa <span className="text-gold">Philosophy</span></h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', lineHeight: '1.8' }}>
                Every piece in our collection is meticulously selected for its craftsmanship and design. We don&apos;t just follow trends; we set the standard for timeless elegance. Our commitment to sustainability ensures that your style choice is also a responsible one.
              </p>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {[
                  { Icon: Shield, title: 'Uncompromising Quality', desc: 'We partner with the world\'s finest artisans to ensure every stitch is perfect.' },
                  { Icon: Heart, title: 'Ethical Sourcing', desc: 'Our materials are sourced from suppliers who share our values of fairness and respect.' },
                  { Icon: Sparkles, title: 'Exclusive Designs', desc: 'Limited edition pieces that you won\'t find anywhere else.' },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.5' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--color-surface)', padding: '5rem 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
            {[
              { label: 'Founded', value: '2018' },
              { label: 'Countries', value: '25+' },
              { label: 'Styles', value: '1k+' },
              { label: 'Happy Clients', value: '50k+' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>{value}</p>
                <p style={{ fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Join */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <Users size={48} style={{ color: 'var(--color-accent)', margin: '0 auto 1.5rem', opacity: 0.8 }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem' }}>Join the Movement</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '2.5rem' }}>
            We are always looking for passionate individuals to join our global team of designers, dreamers, and doers.
          </p>
          <a href="/shop" className="btn-primary" style={{ display: 'inline-block' }}>Explore Collections</a>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
