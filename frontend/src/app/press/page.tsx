export default function PressPage() {
  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-accent)' }}>
          Press & Media
        </h1>
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
          <p style={{ color: 'var(--color-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>
            Welcome to the Wearixa press room. Here you can find our latest announcements, media resources, and brand guidelines.
          </p>
          
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>Recent Press Releases</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <span style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 'bold' }}>May 12, 2026</span>
              <h3 style={{ margin: '0.5rem 0', color: 'var(--color-text)' }}>Wearixa Launches Summer Collection</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', margin: 0 }}>Discover the inspiration behind our most vibrant collection yet.</p>
            </div>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <span style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 'bold' }}>March 04, 2026</span>
              <h3 style={{ margin: '0.5rem 0', color: 'var(--color-text)' }}>Commitment to Zero-Waste Manufacturing</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', margin: 0 }}>Our bold new initiative to reduce our carbon footprint by 2030.</p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem', marginTop: '3rem' }}>Media Contact</h2>
          <p style={{ color: 'var(--color-muted)', lineHeight: '1.8' }}>
            For all press inquiries, high-resolution imagery, and interview requests, please contact our PR team at:<br/>
            <strong style={{ color: 'var(--color-accent)' }}>press@wearixa.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
