'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    orderService.getMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Account</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '600' }}>My Orders</h1>
      </div>

      {loading ? <LoadingSpinner /> : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-muted)' }}>
          <Package size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.4 }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>No orders yet</h2>
          <p>Start shopping to see your orders here.</p>
          <Link href="/shop" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '1.5rem' }}>
            Shop Now <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order: any) => (
            <Link key={order._id} href={`/orders/${order._id}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div className="glass" style={{ borderRadius: '10px', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center', transition: 'border-color 0.3s', border: '1px solid var(--color-border)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Order ID</p>
                    <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Date</p>
                    <p style={{ fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Total</p>
                    <p style={{ fontWeight: '700', color: 'var(--color-accent)' }}>${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600', background: order.isPaid ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', color: order.isPaid ? '#4ade80' : '#f87171', border: `1px solid ${order.isPaid ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600', background: 'rgba(201,168,76,0.1)', color: 'var(--color-accent)', border: '1px solid rgba(201,168,76,0.3)' }}>
                      {order.status || 'Processing'}
                    </span>
                  </div>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
