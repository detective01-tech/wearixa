'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MessageCircle, X, Send, Image as ImageIcon, Loader2, ChevronLeft, User as UserIcon } from 'lucide-react';
import api from '@/services/api';

export default function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeCustomer, setActiveCustomer] = useState<any>(null); // For admin only
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [unreadAlert, setUnreadAlert] = useState(false);
  const lastStateHash = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';

  // Poll for messages or conversations
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        if (isAdmin && !activeCustomer) {
          // Fetch inbox
          const { data } = await api.get('/chat/conversations');
          setConversations(data);
          
          const currentHash = data.map((c: any) => c.updatedAt).join(',');
          if (!open && lastStateHash.current && lastStateHash.current !== currentHash) {
             setUnreadAlert(true);
          }
          if (open) lastStateHash.current = currentHash;
        } else {
          // Fetch specific chat
          const query = isAdmin ? `?customerId=${activeCustomer._id}` : '';
          const { data } = await api.get(`/chat${query}`);
          setMessages(data);
          
          const currentHash = data.length.toString();
          if (!open && lastStateHash.current && lastStateHash.current !== currentHash) {
             setUnreadAlert(true);
          }
          if (open) lastStateHash.current = currentHash;
        }
      } catch (err) {
        console.error('Failed to fetch chat data', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [user, open, isAdmin, activeCustomer]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (open && (!isAdmin || activeCustomer)) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, isAdmin, activeCustomer]);

  // Mark as read when admin opens a specific customer's chat
  useEffect(() => {
    if (open && isAdmin && activeCustomer) {
      api.put('/chat/read', { customerId: activeCustomer._id }).catch(err => console.error(err));
      
      // Optimistically clear the unread count in local state
      setConversations(prev => prev.map(c => c._id === activeCustomer._id ? { ...c, unreadCount: 0 } : c));
    }
  }, [open, isAdmin, activeCustomer]);

  // Clear global unread alert when opening
  useEffect(() => {
    if (open) setUnreadAlert(false);
  }, [open]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text);
      if (file) formData.append('image', file);
      
      if (isAdmin && activeCustomer) {
        formData.append('customerId', activeCustomer._id);
        formData.append('customerName', activeCustomer.customerName);
      }

      const { data: newMessage } = await api.post('/chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages((prev) => [...prev, newMessage]);
      setText('');
      setFile(null);
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Hide if not logged in

  const showInbox = isAdmin && !activeCustomer;

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      
      {/* Chat Window */}
      {open && (
        <div className="glass animate-fade-in" style={{ 
          width: '340px', 
          height: '500px', 
          marginBottom: '1rem', 
          borderRadius: '16px',
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          {/* Header */}
          <div style={{ padding: '1rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isAdmin && activeCustomer && (
                <button onClick={() => setActiveCustomer(null)} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <ChevronLeft size={20} />
                </button>
              )}
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', margin: 0 }}>
                {showInbox ? 'Support Inbox' : (isAdmin ? activeCustomer.customerName : 'Support Chat')}
              </h3>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Admin Inbox View */}
          {showInbox ? (
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
              {conversations.length === 0 ? (
                <p style={{ color: 'var(--color-muted)', textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>No active conversations.</p>
              ) : (
                conversations.map((conv) => (
                  <div key={conv._id} onClick={() => setActiveCustomer(conv)} style={{ 
                    padding: '1rem', borderBottom: '1px solid var(--color-border)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '1rem', transition: 'background 0.2s',
                    borderRadius: '8px'
                  }} className="hover:bg-white/5">
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                      <UserIcon size={20} />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
                        {conv.customerName}
                        {conv.unreadCount > 0 && (
                          <span style={{ 
                            background: '#ef4444', color: 'white', fontSize: '0.7rem', 
                            padding: '2px 8px', borderRadius: '10px', fontWeight: '700' 
                          }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: conv.unreadCount > 0 ? 'white' : 'var(--color-muted)', fontWeight: conv.unreadCount > 0 ? '600' : '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.hasImage && !conv.lastMessage ? '📷 Sent an image' : conv.lastMessage}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 ? (
                  <p style={{ color: 'var(--color-muted)', textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>Say hello!</p>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderId === user._id;
                    return (
                      <div key={m._id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                        {!isMe && <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '4px', display: 'block' }}>{m.senderName}</span>}
                        <div style={{ 
                          background: isMe ? 'rgba(201,168,76,0.2)' : 'var(--color-surface)', 
                          border: `1px solid ${isMe ? 'rgba(201,168,76,0.4)' : 'var(--color-border)'}`,
                          padding: '0.75rem', 
                          borderRadius: '12px',
                          borderBottomRightRadius: isMe ? '2px' : '12px',
                          borderBottomLeftRadius: !isMe ? '2px' : '12px',
                        }}>
                          {m.image && (
                            <img src={m.image} alt="Shared image" style={{ maxWidth: '100%', borderRadius: '6px', marginBottom: m.text ? '8px' : '0' }} />
                          )}
                          {m.text && <p style={{ fontSize: '0.85rem', margin: 0, wordBreak: 'break-word' }}>{m.text}</p>}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} style={{ padding: '0.75rem', borderTop: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {file && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(201,168,76,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    <button type="button" onClick={() => setFile(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0 }}><X size={14} /></button>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                    placeholder="Type a message..." 
                    className="input-field" 
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
                    disabled={loading}
                  />
                  <button type="button" onClick={() => document.getElementById('chat-img-upload')?.click()} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-muted)', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ImageIcon size={16} />
                  </button>
                  <input id="chat-img-upload" type="file" accept="image/*" onChange={e => { if (e.target.files) setFile(e.target.files[0]) }} style={{ display: 'none' }} />
                  
                  <button type="submit" disabled={loading || (!text.trim() && !file)} className="btn-primary" style={{ width: '36px', height: '36px', borderRadius: '8px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setOpen(!open)}
        style={{ 
          width: '56px', height: '56px', borderRadius: '50%', 
          background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
          color: '#0d0d0d', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(201,168,76,0.4)',
          transition: 'transform 0.2s',
          transform: open ? 'scale(0.9)' : 'scale(1)',
          position: 'relative'
        }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
        {!open && unreadAlert && (
          <span style={{
            position: 'absolute', top: '0px', right: '0px',
            width: '14px', height: '14px', background: '#ef4444',
            borderRadius: '50%', border: '2px solid var(--color-background)',
            animation: 'pulse 2s infinite'
          }} />
        )}
      </button>
    </div>
  );
}
