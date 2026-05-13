'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authService, orderService } from '@/services';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { User, Package, Settings, Save } from 'lucide-react';

type Tab = 'profile' | 'orders';

export default function ProfilePage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [form, setForm] = useState({ 
    name: '', email: '', password: '', 
    address: '', city: '', postalCode: '', country: '', phone: '' 
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    setForm({ 
      name: user.name, 
      email: user.email, 
      password: '',
      address: user.address || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
      country: user.country || '',
      phone: user.phone || ''
    });
  }, [user, router]);

  useEffect(() => {
    if (tab === 'orders') {
      setLoadingOrders(true);
      orderService.getMyOrders().then(setOrders).catch(console.error).finally(() => setLoadingOrders(false));
    }
  }, [tab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const updated = await authService.updateProfile({ 
        name: form.name, 
        email: form.email, 
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
        phone: form.phone,
        ...(form.password ? { password: form.password } : {}) 
      });
      login(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Update failed.');
    } finally { setSaving(false); }
  };

  if (!user) return null;

  const statusColor: Record<string, string> = { pending: '#ffa500', processing: '#60a5fa', shipped: '#a78bfa', delivered: '#4ade80', cancelled: '#f87171' };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>My Account</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '600' }}>Welcome, {user.name.split(' ')[0]}</h1>
      </div>

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#e8c97a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', fontWeight: '700', color: '#0d0d0d' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p style={{ fontWeight: '600', marginBottom: '2px' }}>{user.name}</p>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>{user.email}</p>
            {user.role === 'admin' && (
              <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '2px 10px', background: 'rgba(201,168,76,0.15)', color: 'var(--color-accent)', borderRadius: '20px', fontSize: '0.7rem', border: '1px solid rgba(201,168,76,0.3)' }}>Admin</span>
            )}
          </div>
          {[
            { key: 'profile', label: 'Profile Settings', Icon: Settings },
            { key: 'orders', label: 'My Orders', Icon: Package },
          ].map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setTab(key as Tab)} style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '1rem 1.5rem',
              background: tab === key ? 'rgba(201,168,76,0.1)' : 'none', border: 'none',
              borderLeft: `3px solid ${tab === key ? 'var(--color-accent)' : 'transparent'}`,
              color: tab === key ? 'var(--color-accent)' : 'var(--color-muted)', cursor: 'pointer', fontSize: '0.875rem',
              fontWeight: tab === key ? '600' : '400', transition: 'all 0.3s', textAlign: 'left',
            }}>
              <Icon size={16} /> {label}
            </button>
          ))}
          {user.role === 'admin' && (
            <Link href="/admin" style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.5rem',
              color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: '600',
              borderTop: '1px solid var(--color-border)', textDecoration: 'none',
            }}>
              <Settings size={16} /> Admin Panel
            </Link>
          )}
        </div>

        {/* Content */}
        <div>
          {tab === 'profile' && (
            <div className="glass" style={{ borderRadius: '12px', padding: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '1.75rem' }}>Profile Settings</h2>
              {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.875rem', marginBottom: '1.5rem', color: '#f87171', fontSize: '0.875rem' }}>{error}</div>}
              {saved && <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '8px', padding: '0.875rem', marginBottom: '1.5rem', color: '#4ade80', fontSize: '0.875rem' }}>Profile updated successfully!</div>}
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Full Name</label>
                    <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email</label>
                    <input className="input-field" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={14} /> Shipping Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Street Address</label>
                      <input className="input-field" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Fashion St" />
                    </div>
                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>City</label>
                        <input className="input-field" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="New York" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Postal Code</label>
                        <input className="input-field" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} placeholder="10001" />
                      </div>
                    </div>
                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Country</label>
                        <input className="input-field" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="USA" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Phone Number</label>
                        <input className="input-field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555-0123" />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={14} /> Security
                  </h3>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>New Password (leave blank to keep current)</label>
                    <input className="input-field" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
                  </div>
                </div>

                <button type="submit" disabled={saving} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.875rem 2.5rem' }}>
                  {saving ? 'Updating...' : 'Save All Changes'}
                </button>
              </form>
            </div>
          )}

          {tab === 'orders' && (
            <div className="glass" style={{ borderRadius: '12px', padding: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '1.75rem' }}>My Orders</h2>
              {loadingOrders ? <LoadingSpinner /> : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>
                  <Package size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                  <p>No orders yet.</p>
                  <Link href="/shop" className="btn-outline" style={{ display: 'inline-flex', marginTop: '1rem' }}>Start Shopping</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map((order: any) => (
                    <Link key={order._id} href={`/orders/${order._id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ padding: '1.25rem', background: 'var(--color-surface-2)', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', transition: 'border-color 0.3s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}>
                        <div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '2px' }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>${order.totalPrice.toFixed(2)}</p>
                          <p style={{ color: 'var(--color-muted)', fontSize: '0.78rem', marginTop: '2px' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: `rgba(${order.isPaid ? '74,222,128' : '239,68,68'},0.1)`, color: order.isPaid ? '#4ade80' : '#f87171', border: `1px solid rgba(${order.isPaid ? '74,222,128' : '239,68,68'},0.3)` }}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                          <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: `rgba(201,168,76,0.1)`, color: 'var(--color-accent)', border: '1px solid rgba(201,168,76,0.3)' }}>
                            {order.status || 'Processing'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
          .form-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
