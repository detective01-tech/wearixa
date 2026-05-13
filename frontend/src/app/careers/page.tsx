export default function CareersPage() {
  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-accent)' }}>
          Careers at Wearixa
        </h1>
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
          <p style={{ color: 'var(--color-muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            We are always looking for passionate, creative, and driven individuals to join our growing team. At Wearixa, we believe in fostering a collaborative environment where innovation thrives.
          </p>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem', marginTop: '2rem' }}>Current Openings</h2>
          <p style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>
            We currently have no open positions. Please check back later or send your resume to <strong style={{ color: 'var(--color-accent)' }}>careers@wearixa.com</strong> and we'll keep you in mind for future opportunities.
          </p>
          
          <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(201,168,76,0.1)', borderRadius: '12px', border: '1px solid rgba(201,168,76,0.3)' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-accent)', marginBottom: '1rem', marginTop: 0 }}>Looking for Digital Services?</h2>
            <p style={{ color: 'var(--color-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
              We don't just design fashion—we design digital experiences. If you love the look and feel of our platform and want to create a stunning website, e-commerce store, or mobile application of your own, our world-class engineering and design team is available for hire.
            </p>
            <p style={{ color: 'var(--color-text)', fontWeight: '600', marginBottom: 0 }}>
              Let's build your vision. Reach out to us at <a href="mailto:services@wearixa.com" style={{ color: 'var(--color-accent)' }}>services@wearixa.com</a> to start your project today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
