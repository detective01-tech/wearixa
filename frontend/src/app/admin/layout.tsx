'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, LogOut, Menu, X } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', Icon: Package },
  { href: '/admin/orders', label: 'Orders', Icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', Icon: Users },
  { href: '/admin/categories', label: 'Categories', Icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && user === null) { router.push('/auth/login'); return; }
    if (!loading && user && !isAdmin) { router.push('/'); }
  }, [user, isAdmin, router, loading]);

  if (loading || !user || !isAdmin) return null;

  return (
    <>
      <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{
        width: sidebarOpen ? '240px' : '68px', flexShrink: 0,
        background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease',
        position: 'sticky', top: 0, height: '100vh', overflowX: 'hidden', zIndex: 20
      }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '64px' }}>
          {sidebarOpen && (
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '700', letterSpacing: '0.1em', whiteSpace: 'nowrap' }} className="text-gold">
              WEARIXA
            </span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '4px', marginLeft: sidebarOpen ? 0 : 'auto', marginRight: sidebarOpen ? 0 : 'auto' }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <nav className={`admin-nav ${sidebarOpen ? 'open' : 'closed'}`} style={{ flex: 1, padding: '1rem 0' }}>
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} title={label} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '0.75rem 1.25rem',
                background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                borderLeft: `3px solid ${active ? 'var(--color-accent)' : 'transparent'}`,
                color: active ? 'var(--color-accent)' : 'var(--color-muted)',
                fontWeight: active ? '600' : '400', fontSize: '0.875rem',
                transition: 'all 0.2s', whiteSpace: 'nowrap', textDecoration: 'none',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--color-text)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--color-muted)'; }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarOpen && label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button onClick={logout} title="Logout" style={{
            display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
            background: 'none', border: 'none', color: '#f87171', cursor: 'pointer',
            padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <header className="admin-header" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Admin Panel</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#e8c97a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem', color: '#0d0d0d' }}>
              {user.name.charAt(0)}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{user.name}</span>
          </div>
        </header>
        <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .admin-layout { flex-direction: column !important; }
        .admin-sidebar { width: 100% !important; height: auto !important; position: static !important; }
        .admin-nav.closed { display: none !important; }
        .admin-sidebar > div:last-child { display: none !important; } /* Hide logout block when stacked if needed, or we can leave it */
        .admin-header { display: none !important; }
      }
    `}</style>
    </>
  );
}
