'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { orderService } from '@/services';
import { MapPin, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';

const STEPS = ['Shipping', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [payment, setPayment] = useState({ method: 'stripe' });

  // Fix: Move navigation side-effect to useEffect
  useEffect(() => {
    if (!authLoading && user === null) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) return null;
  if (!user) return null;

  const shippingCost = totalPrice > 100 ? 0 : 12.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shippingCost + tax;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(i => ({ name: i.title, qty: i.qty, image: i.image, price: i.price, product: i._id })),
        shippingAddress: shipping,
        paymentMethod: payment.method,
        taxPrice: tax,
        shippingPrice: shippingCost,
        totalPrice: grandTotal,
      };
      const created = await orderService.create(orderData);
      setOrderId(created._id);
      showToast('Order placed successfully!', 'success');
      clearCart();
      setStep(2);
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { marginBottom: '1rem' };
  const labelStyle = { display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase' as const, marginBottom: '0.5rem' };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Secure</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '600' }}>Checkout</h1>
      </div>

      {/* Step indicator */}
      <div className="checkout-steps" style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i <= step ? 'var(--color-accent)' : 'var(--color-surface)',
              border: `1px solid ${i <= step ? 'var(--color-accent)' : 'var(--color-border)'}`,
              color: i <= step ? '#0d0d0d' : 'var(--color-muted)', fontWeight: '700', fontSize: '0.85rem',
              transition: 'all 0.3s', flexShrink: 0,
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className="step-text" style={{ marginLeft: '8px', fontSize: '0.85rem', color: i === step ? 'var(--color-text)' : 'var(--color-muted)', whiteSpace: 'nowrap' }}>{s}</span>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: '1px', background: i < step ? 'var(--color-accent)' : 'var(--color-border)', margin: '0 1rem', transition: 'background 0.3s' }} />
            )}
          </div>
        ))}
      </div>

      <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Main form */}
        <div>
          {step === 0 && (
            <div className="glass" style={{ borderRadius: '12px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem' }}>
                <MapPin size={20} style={{ color: 'var(--color-accent)' }} />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem' }}>Shipping Address</h2>
              </div>
              <div style={inputStyle}><label style={labelStyle}>Street Address</label><input className="input-field" value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} placeholder="123 Fashion Avenue" required /></div>
              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={inputStyle}><label style={labelStyle}>City</label><input className="input-field" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} placeholder="New York" required /></div>
                <div style={inputStyle}><label style={labelStyle}>Postal Code</label><input className="input-field" value={shipping.postalCode} onChange={e => setShipping(s => ({ ...s, postalCode: e.target.value }))} placeholder="10001" required /></div>
              </div>
              <div style={inputStyle}><label style={labelStyle}>Country</label><input className="input-field" value={shipping.country} onChange={e => setShipping(s => ({ ...s, country: e.target.value }))} placeholder="United States" required /></div>
              <button onClick={() => { if (Object.values(shipping).every(v => v)) setStep(1); }} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Continue to Payment <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="glass" style={{ borderRadius: '12px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem' }}>
                <CreditCard size={20} style={{ color: 'var(--color-accent)' }} />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem' }}>Payment Method</h2>
              </div>
              {['stripe', 'paypal', 'cod'].map((m) => (
                <label key={m} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '8px',
                  border: `1px solid ${payment.method === m ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: payment.method === m ? 'rgba(201,168,76,0.05)' : 'transparent',
                  cursor: 'pointer', marginBottom: '0.75rem', transition: 'all 0.3s',
                }}>
                  <input type="radio" name="payment" value={m} checked={payment.method === m} onChange={() => setPayment({ method: m })} style={{ accentColor: 'var(--color-accent)' }} />
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                      {m === 'stripe' ? 'Credit / Debit Card (Stripe)' : m === 'paypal' ? 'PayPal' : 'Cash on Delivery'}
                    </p>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>
                      {m === 'stripe' ? 'Visa, Mastercard, Amex' : m === 'paypal' ? 'Pay with your PayPal account' : 'Pay when you receive'}
                    </p>
                  </div>
                </label>
              ))}
              <div className="checkout-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setStep(0)} className="btn-outline" style={{ flex: 1 }}>Back</button>
                <button onClick={() => setStep(2)} className="btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Review Order <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && !orderId && (
            <div className="glass" style={{ borderRadius: '12px', padding: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '1.5rem' }}>Order Review</h2>
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-surface-2)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Shipping to</p>
                <p style={{ fontSize: '0.9rem' }}>{shipping.address}, {shipping.city}, {shipping.postalCode}, {shipping.country}</p>
              </div>
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-surface-2)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Payment</p>
                <p style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>{payment.method}</p>
              </div>
              <div className="checkout-actions" style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1 }}>Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}

          {orderId && (
            <div className="glass" style={{ borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
              <CheckCircle size={56} style={{ color: '#4ade80', margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.75rem' }}>Order Placed!</h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: '0.5rem' }}>Thank you for your order.</p>
              <p style={{ color: 'var(--color-accent)', fontSize: '0.85rem', marginBottom: '2rem' }}>Order ID: {orderId}</p>
              <button onClick={() => router.push('/orders')} className="btn-primary">View My Orders</button>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="glass" style={{ borderRadius: '12px', padding: '1.75rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>Your Order</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: '240px', overflowY: 'auto' }}>
            {cartItems.map(item => (
              <div key={item._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '64px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, background: 'var(--color-surface-2)' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>x{item.qty}</p>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-accent)', flexShrink: 0 }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[['Subtotal', `$${totalPrice.toFixed(2)}`], ['Shipping', shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`], ['Tax', `$${tax.toFixed(2)}`]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--color-muted)' }}>{l}</span>
                <span>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-accent)' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-grid > div { min-width: 0 !important; }
          .form-grid-2 { grid-template-columns: 1fr !important; }
          .step-text { display: none !important; }
          .checkout-actions { flex-direction: column-reverse !important; gap: 0.75rem !important; }
        }
      `}</style>
    </div>
  );
}
