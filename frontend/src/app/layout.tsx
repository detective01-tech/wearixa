import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

export const metadata: Metadata = {
  title: 'Wearixa – Premium Fashion House',
  description: 'Discover curated fashion collections crafted with elegance. Shop premium clothing, accessories, and more at Wearixa.',
  keywords: 'fashion, clothing, premium, luxury, style, Wearixa',
  openGraph: {
    title: 'Wearixa – Premium Fashion House',
    description: 'Curated fashion for the modern individual.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <Navbar />
                <main style={{ minHeight: '100vh', paddingTop: '72px' }}>
                  {children}
                </main>
                <Footer />
                <ChatWidget />
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
