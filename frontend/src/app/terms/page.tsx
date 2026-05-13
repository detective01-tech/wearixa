export default function TermsPage() {
  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-accent)' }}>
          Terms of Service
        </h1>
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', color: 'var(--color-muted)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Last updated: May 12, 2026
          </p>
          
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            By accessing and using Wearixa (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>2. Use of Service</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            You agree to use the Service only for lawful purposes. You are prohibited from:
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li>Violating any local, state, national, or international law.</li>
              <li>Infringing on the intellectual property rights of others.</li>
              <li>Transmitting any material that is abusive, harassing, or otherwise objectionable.</li>
            </ul>
          </div>

          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>3. Products and Pricing</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            All products and prices are subject to change at any time without notice. We reserve the right to limit the quantities of any products or services that we offer.
          </p>

          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>4. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
