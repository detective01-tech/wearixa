export default function CookiesPage() {
  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-accent)' }}>
          Cookie Policy
        </h1>
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', color: 'var(--color-muted)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Last updated: May 12, 2026
          </p>
          
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>1. What Are Cookies?</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Cookies are small text files that are placed on your computer or mobile device when you browse websites. They are widely used to make websites work more efficiently, as well as to provide reporting information to website owners.
          </p>

          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Cookies</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            Wearixa uses cookies to:
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li>Keep you signed in to your account.</li>
              <li>Remember your preferences and shopping cart items.</li>
              <li>Understand how you use our website to improve our design and services.</li>
              <li>Provide personalized advertisements and content.</li>
            </ul>
          </div>

          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>3. Types of Cookies We Use</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>Essential Cookies:</strong> Required for the operation of our website.<br/>
            <strong>Analytics Cookies:</strong> Allow us to recognize and count the number of visitors.<br/>
            <strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant ads.
          </p>

          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '1rem' }}>4. Managing Cookies</h2>
          <p>
            You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
          </p>
        </div>
      </div>
    </div>
  );
}
