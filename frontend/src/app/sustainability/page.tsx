export default function SustainabilityPage() {
  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-accent)' }}>
          Sustainability
        </h1>
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
          <p style={{ color: 'var(--color-text)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
            Fashion shouldn't cost the earth. At Wearixa, we are deeply committed to ethical sourcing, sustainable materials, and reducing our environmental impact.
          </p>
          
          <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>1. Ethical Sourcing</h3>
              <p style={{ color: 'var(--color-muted)', lineHeight: '1.6' }}>
                We work exclusively with suppliers who adhere to strict labor standards, ensuring fair wages and safe working conditions for everyone involved in creating our garments.
              </p>
            </div>
            
            <div>
              <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>2. Eco-Friendly Materials</h3>
              <p style={{ color: 'var(--color-muted)', lineHeight: '1.6' }}>
                Over 70% of our new collections are crafted from recycled or organic materials. We are constantly researching innovative fabrics that minimize water usage and chemical runoff.
              </p>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>3. Carbon Neutrality</h3>
              <p style={{ color: 'var(--color-muted)', lineHeight: '1.6' }}>
                We offset 100% of our shipping emissions and are working towards a completely carbon-neutral supply chain by the year 2030.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
