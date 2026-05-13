'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { authService } from '@/services';
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authService.login(form.email, form.password);
      login(data);
      showToast(`Welcome back, ${data.name}!`);
      router.push('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)' }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/">
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: '700', letterSpacing: '0.15em' }} className="text-gold">WEARIXA</span>
          </Link>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Welcome back</p>
        </div>

        <div className="glass" style={{ borderRadius: '16px', padding: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Sign In</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Don&apos;t have an account? <Link href="/auth/register" style={{ color: 'var(--color-accent)' }}>Register</Link>
          </p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.875rem 1rem', marginBottom: '1.5rem', color: '#f87171', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input className="input-field" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="hello@example.com" required style={{ paddingLeft: '40px' }} autoComplete="email" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input className="input-field" type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" required style={{ paddingLeft: '40px', paddingRight: '44px' }} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(201,168,76,0.05)', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Sparkles size={12} style={{ color: 'var(--color-accent)' }} />
              <span style={{ color: 'var(--color-accent)', fontWeight: '600' }}>Demo Credentials</span>
            </div>
            <p>Admin: admin@wearixa.com / admin123</p>
            <p>User: user@wearixa.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
