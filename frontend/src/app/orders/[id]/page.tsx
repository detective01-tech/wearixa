'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { ChevronLeft, Package, MapPin, CreditCard, CheckCircle, Clock } from 'lucide-react';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    orderService.getById(id)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, user, router]);

  if (!user) return null;
  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Order not found</div>;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
      <Link href="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '2rem', textDecoration: 'none' }}>
        <ChevronLeft size={16} /> Back to My Orders
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '600', marginBottom: '8px' }}>Order Details</h1>
          <p style={{ color: 'var(--color-accent)', fontWeight: '500', letterSpacing: '0.1em' }}>#{order._id.toUpperCase()}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', background: order.isPaid ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', color: order.isPaid ? '#4ade80' : '#f87171', border: `1px solid ${order.isPaid ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {order.isPaid ? 'Paid' : 'Unpaid'}
          </span>
          <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', background: 'rgba(201,168,76,0.1)', color: 'var(--color-accent)', border: '1px solid rgba(201,168,76,0.3)' }}>
            {order.status || 'Processing'}
          </span>
        </div>
      </div>

      <div className="order-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Order Items */}
          <div className="glass" style={{ borderRadius: '12px', padding: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={20} /> Items
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {order.orderItems.map((item: any) => (
                <div key={item._id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '4px' }}>{item.name}</h3>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Quantity: {item.qty}</p>
                    <p style={{ fontWeight: '600', color: 'var(--color-accent)', marginTop: '8px' }}>${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="order-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass" style={{ borderRadius: '12px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> Shipping
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', lineHeight: '1.8' }}>
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: order.isDelivered ? '#4ade80' : '#ffa500', fontSize: '0.8rem' }}>
                {order.isDelivered ? <CheckCircle size={14} /> : <Clock size={14} />}
                {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'}
              </div>
            </div>

            <div className="glass" style={{ borderRadius: '12px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={14} /> Payment
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', textTransform: 'capitalize' }}>Method: {order.paymentMethod}</p>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: order.isPaid ? '#4ade80' : '#f87171', fontSize: '0.8rem' }}>
                {order.isPaid ? <CheckCircle size={14} /> : <Clock size={14} />}
                {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="glass" style={{ borderRadius: '12px', padding: '2rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-muted)' }}>Subtotal</span>
              <span>${(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-muted)' }}>Shipping</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-muted)' }}>Tax</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '700' }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-accent)' }}>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .order-main-grid { grid-template-columns: 1fr !important; }
          .order-info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
