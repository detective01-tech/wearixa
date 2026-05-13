'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
          <ShoppingBag size={32} style={{ color: 'var(--color-muted)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: '600' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>Discover our premium collections and add items you love.</p>
        <Link href="/shop" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          Shop Now <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const shipping = totalPrice > 100 ? 0 : 12.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Review</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '600' }}>Shopping Cart</h1>
      </div>

      <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        {/* Cart items */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
            <button onClick={() => { clearCart(); showToast('Cart cleared'); }} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Trash2 size={13} /> Clear All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {cartItems.map((item) => (
              <div key={item._id} className="glass cart-item-card" style={{ borderRadius: '8px', padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <Link href={`/product/${item._id}`}>
                  <div style={{ width: '90px', height: '120px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: 'var(--color-surface-2)' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </Link>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/product/${item._id}`}>
                    <h3 style={{ fontWeight: '500', fontSize: '0.95rem', marginBottom: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h3>
                  </Link>
                  <p className="price" style={{ marginBottom: '0.75rem' }}>${item.price.toFixed(2)}</p>

                  <div className="cart-item-details" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden' }}>
                      <button onClick={() => { if (item.qty <= 1) removeFromCart(item._id); else updateQty(item._id, item.qty - 1); }}
                        style={{ width: '32px', height: '32px', background: 'var(--color-surface)', border: 'none', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={13} />
                      </button>
                      <span style={{ width: '40px', textAlign: 'center', fontSize: '0.875rem' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item._id, Math.min(item.stock, item.qty + 1))}
                        style={{ width: '32px', height: '32px', background: 'var(--color-surface)', border: 'none', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={13} />
                      </button>
                    </div>
                    <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                      = ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button onClick={() => { removeFromCart(item._id); showToast(`${item.title} removed from cart`, 'info', item.image); }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '4px', transition: 'color 0.3s', flexShrink: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}>
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="glass" style={{ borderRadius: '12px', padding: '1.75rem', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '600', marginBottom: '1.5rem' }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Subtotal', value: `$${totalPrice.toFixed(2)}` },
                { label: 'Shipping', value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}` },
                { label: 'Tax (8%)', value: `$${tax.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-muted)' }}>{label}</span>
                  <span style={{ color: value === 'FREE' ? '#4ade80' : 'var(--color-text)', fontWeight: '500' }}>{value}</span>
                </div>
              ))}
            </div>

            {shipping > 0 && (
              <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '6px', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '0.78rem', color: 'var(--color-accent)', textAlign: 'center' }}>
                Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', fontSize: '1rem' }}>Total</span>
              <span style={{ fontWeight: '700', fontSize: '1.35rem', color: 'var(--color-accent)' }}>${grandTotal.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', textAlign: 'center', marginBottom: '1rem' }}>
              Proceed to Checkout <ArrowRight size={16} />
            </Link>

            <Link href="/shop" style={{ display: 'block', textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.85rem', transition: 'color 0.3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
          .cart-grid > div { min-width: 0 !important; }
          .cart-item-card { padding: 1rem !important; gap: 0.75rem !important; }
          .cart-item-details { gap: 0.5rem !important; }
        }
      `}</style>
    </div>
  );
}
