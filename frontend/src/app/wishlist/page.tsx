'use client';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, Heart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    addToCart({
      _id: item._id,
      title: item.title,
      price: item.price,
      image: item.image,
      qty: 1,
      stock: 99, // Fallback for mock
    });
    removeFromWishlist(item._id);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Your Curated List</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '600' }}>Favorites</h1>
        <div style={{ width: '60px', height: '2px', background: 'var(--color-accent)', margin: '1.5rem auto' }} />
      </div>

      {wishlistItems.length === 0 ? (
        <div className="glass" style={{ borderRadius: '16px', padding: '5rem 2rem', textAlign: 'center' }}>
          <Heart size={48} style={{ color: 'var(--color-border)', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>Save items you love to find them easily later.</p>
          <Link href="/shop" className="btn-primary">Explore Collection</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {wishlistItems.map((item) => (
            <div key={item._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/product/${item._id}`} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Link>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{item.brand}</p>
                <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p className="price" style={{ marginBottom: '1.25rem' }}>${item.price.toFixed(2)}</p>
                
                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="btn-primary" 
                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                  <button 
                    onClick={() => removeFromWishlist(item._id)}
                    style={{ 
                      width: '40px', height: '40px', borderRadius: '4px', border: '1px solid var(--color-border)', 
                      background: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {wishlistItems.length > 0 && (
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <Link href="/shop" style={{ color: 'var(--color-accent)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
