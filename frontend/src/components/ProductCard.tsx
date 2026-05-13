'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface Product {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  images: string[];
  rating: number;
  numReviews: number;
  stock: number;
  brand?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const wishlisted = isInWishlist(product._id);
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      _id: product._id,
      title: product.title,
      price: product.discountPrice ? product.discountPrice : product.price,
      image: product.images[0],
      qty: 1,
      stock: product.stock,
    });
    setAdded(true);
    showToast(`${product.title} added to cart`, 'success', product.images[0]);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({
      _id: product._id,
      title: product.title,
      price: product.discountPrice ? product.discountPrice : product.price,
      image: product.images[0],
      brand: product.brand || '',
    });
    showToast(wishlisted ? 'Removed from favorites' : 'Added to favorites', 'success', product.images[0]);
  };

  return (
    <Link href={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div
        className="card"
        style={{ position: 'relative', cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image Container */}
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'var(--color-surface-2)' }}>
          <img
            src={product.images[0] || 'https://placehold.co/400x533?text=Wearixa'}
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />

          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }} />

          {/* Quick actions */}
          <div style={{
            position: 'absolute', top: '1rem', right: '1rem',
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
            transform: hovered ? 'translateX(0)' : 'translateX(60px)',
            transition: 'transform 0.3s ease',
          }}>
            <button
              onClick={handleWishlist}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: wishlisted ? 'rgba(248,113,113,0.9)' : 'rgba(0,0,0,0.7)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(10px)', transition: 'all 0.3s',
              }}
            >
              <Heart size={15} fill={wishlisted ? 'white' : 'none'} color="white" />
            </button>
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(10px)', transition: 'all 0.3s',
              }}
            >
              <Eye size={15} color="white" />
            </div>
          </div>

          {/* Stock badge */}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', top: '1rem', left: '1rem',
              background: 'rgba(239,68,68,0.9)', color: 'white',
              fontSize: '0.7rem', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '20px',
            }}>
              SOLD OUT
            </div>
          )}

          {/* Discount badge */}
          {product.stock > 0 && product.discountPrice && product.discountPrice > 0 && (
            <div style={{
              position: 'absolute', top: '1rem', left: '1rem',
              background: 'var(--color-accent)', color: '#0d0d0d', fontWeight: '700',
              fontSize: '0.7rem', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '20px',
            }}>
              -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
            </div>
          )}

          {/* Add to cart button */}
          <div style={{
            position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.3s ease',
          }}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                width: '100%',
                background: added ? 'rgba(74,222,128,0.9)' : 'rgba(201,168,76,0.95)',
                color: '#0d0d0d',
                border: 'none',
                padding: '0.65rem',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s',
                backdropFilter: 'blur(10px)',
              }}
            >
              <ShoppingBag size={14} />
              {added ? 'Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Product info */}
        <div style={{ padding: '1rem 1rem 1.25rem' }}>
          {product.brand && (
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              {product.brand}
            </p>
          )}
          <h3 style={{
            fontSize: '0.95rem', fontFamily: 'var(--font-body)', fontWeight: '500',
            color: 'var(--color-text)', marginBottom: '0.5rem',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {product.title}
          </h3>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={11} fill={s <= product.rating ? '#c9a84c' : 'none'} color={s <= product.rating ? '#c9a84c' : '#444'} />
              ))}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>({product.numReviews})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {product.discountPrice && product.discountPrice > 0 ? (
                <>
                  <span className="price">${product.discountPrice.toFixed(2)}</span>
                  <span style={{ textDecoration: 'line-through', color: 'var(--color-muted)', fontSize: '0.8rem' }}>
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="price">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
