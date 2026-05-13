export default function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-accent)' }}>
          Privacy Policy
        </h1>
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', color: 'var(--color-muted)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Last updated: May 12, 2026
          </p>
          
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
          </p>

          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            We may use the information we collect about you to:
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li>Provide, maintain, and improve our Services.</li>
              <li>Process transactions and send related information, including confirmations and receipts.</li>
              <li>Send you technical notices, updates, security alerts, and support messages.</li>
              <li>Respond to your comments, questions, and requests.</li>
            </ul>
          </div>

          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Security</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
          </p>

          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <strong style={{ color: 'var(--color-accent)' }}>privacy@wearixa.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
