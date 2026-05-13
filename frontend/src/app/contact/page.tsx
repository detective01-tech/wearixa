'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '1rem' }}>Get in Touch</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '700' }}>
          Contact <span className="text-gold">Us</span>
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '500px', margin: '1rem auto 0', lineHeight: '1.7' }}>
          Have a question about our collections or need assistance with an order? Our dedicated team is here to help.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start' }}>
        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { Icon: Mail, title: 'Email Us', text: 'concierge@wearixa.com', desc: 'Typical response within 24 hours.' },
                { Icon: Phone, title: 'Call Us', text: '+1 (555) 888-9999', desc: 'Mon-Fri from 9am to 6pm EST.' },
                { Icon: MapPin, title: 'Visit Our Atelier', text: '72 Fifth Avenue, New York, NY', desc: 'By appointment only.' },
              ].map(({ Icon, title, text, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '1.25rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>{title}</h4>
                    <p style={{ fontSize: '1rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{text}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass" style={{ borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
            <MessageCircle size={32} style={{ color: 'var(--color-accent)', marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Live Chat</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>Need immediate assistance? Our stylists are available now.</p>
            <button className="btn-outline" style={{ width: '100%' }}>Start Chat</button>
          </div>
        </div>

        {/* Form */}
        <div className="glass" style={{ borderRadius: '16px', padding: '3rem' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(74,222,128,0.1)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Send size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Message Sent!</h3>
              <p style={{ color: 'var(--color-muted)' }}>Thank you for reaching out. We will get back to you shortly.</p>
              <button onClick={() => setSent(false)} className="btn-outline" style={{ marginTop: '2rem' }}>Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Name</label>
                  <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email</label>
                  <input className="input-field" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Subject</label>
                <input className="input-field" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Order inquiry, Stylist advice, etc." required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Message</label>
                <textarea className="input-field" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={6} placeholder="How can we help you?" required />
              </div>
              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '1rem' }}>
                Send Message <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section div[style*="grid-template-columns: 1fr 1.5fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
