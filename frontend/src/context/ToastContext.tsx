'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  image?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, image?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success', image?: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, image }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none',
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="glass animate-fade-in"
            style={{
              minWidth: '300px',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              pointerEvents: 'auto',
              border: `1px solid ${
                toast.type === 'success' ? 'rgba(74,222,128,0.3)' :
                toast.type === 'error' ? 'rgba(239,68,68,0.3)' :
                toast.type === 'warning' ? 'rgba(251,191,36,0.3)' :
                'rgba(59,130,246,0.3)'
              }`,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {toast.image ? (
                <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <img src={toast.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <>
                  {toast.type === 'success' && <CheckCircle size={20} color="#4ade80" />}
                  {toast.type === 'error' && <XCircle size={20} color="#f87171" />}
                  {toast.type === 'warning' && <AlertTriangle size={20} color="#fbbf24" />}
                  {toast.type === 'info' && <Info size={20} color="#60a5fa" />}
                </>
              )}
            </div>
            <p style={{ flex: 1, fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text)' }}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
