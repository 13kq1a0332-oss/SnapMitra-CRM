import React, { useState } from 'react';
import { Lock, User, Key, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { setIsAdminAuthenticated, showToast } = useLeads();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password.trim() === 'admin') {
      setIsAdminAuthenticated(true);
      setError('');
      showToast('Welcome back, Studio Director! Access Granted.', 'success');
      onSuccess();
    } else {
      setError('Invalid credentials. Hint: use admin / admin');
    }
  };

  const autofillDemo = () => {
    setUsername('admin');
    setPassword('admin');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md rounded-2xl glass-panel p-6 sm:p-8 relative shadow-luxury border border-[#D4AF37]/30 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center mb-3 shadow-gold-sm">
            <Lock className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight">Studio Director Portal</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Restricted access for PixelStory Studios admin & lead dispatch
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F0F13] border border-[#27272E] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm text-white placeholder-gray-600 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Secret Key / Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F0F13] border border-[#27272E] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm text-white placeholder-gray-600 transition-colors"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Quick Demo Autofill Hint */}
          <div className="pt-1">
            <button
              type="button"
              onClick={autofillDemo}
              className="w-full py-1.5 px-3 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs text-[#D4AF37] flex items-center justify-center gap-1.5 transition-colors font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Hackathon Demo Credentials (admin / admin)</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C048] to-[#AA7C11] text-black font-semibold text-sm tracking-wide shadow-gold-md hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

