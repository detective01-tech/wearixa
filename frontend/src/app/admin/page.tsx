'use client';
import { useEffect, useState } from 'react';
import { authService, productService, orderService } from '@/services';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [users, products, orders] = await Promise.all([
          authService.getAllUsers(),
          productService.getAll({ pageSize: 1 }),
          orderService.getAllOrders(),
        ]);
        const revenue = orders.reduce((s: number, o: any) => s + (o.isPaid ? o.totalPrice : 0), 0);
        setStats({ users: users.length, products: products.total || 0, orders: orders.length, revenue });
        setRecentOrders(orders.slice(0, 6));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const cards = [
    { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, Icon: DollarSign, color: '#c9a84c', bg: 'rgba(201,168,76,0.1)' },
    { label: 'Total Orders', value: stats.orders, Icon: ShoppingCart, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
    { label: 'Products', value: stats.products, Icon: Package, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    { label: 'Users', value: stats.users, Icon: Users, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: '600', marginBottom: '4px' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {cards.map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="glass" style={{ borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: '700', color }}>{value}</p>
              <p style={{ fontSize: '0.72rem', color: '#4ade80', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <TrendingUp size={11} /> +12% this month
              </p>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} style={{ color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem' }}>Recent Orders</h2>
          <a href="/admin/orders" style={{ fontSize: '0.8rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            View All <ArrowUpRight size={13} />
          </a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Order ID', 'Customer', 'Date', 'Total', 'Paid', 'Delivered'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: 'left', color: 'var(--color-muted)', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: any) => (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-accent)' }}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>{order.user?.name || 'N/A'}</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600', color: 'var(--color-accent)' }}>${order.totalPrice.toFixed(2)}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600', background: order.isPaid ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', color: order.isPaid ? '#4ade80' : '#f87171', border: `1px solid ${order.isPaid ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                      {order.isPaid ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600', background: order.isDelivered ? 'rgba(74,222,128,0.1)' : 'rgba(255,165,0,0.1)', color: order.isDelivered ? '#4ade80' : '#ffa500', border: `1px solid ${order.isDelivered ? 'rgba(74,222,128,0.3)' : 'rgba(255,165,0,0.3)'}` }}>
                      {order.isDelivered ? 'Yes' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-muted)' }}>No orders yet.</p>}
        </div>
      </div>
    </div>
  );
}
