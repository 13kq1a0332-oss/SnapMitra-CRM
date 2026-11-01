import React, { useState } from 'react';
import { Camera, ShieldCheck, Sparkles, LogOut, Database, UserCheck, Smartphone, Phone, Mail, MessageCircle } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { AdminLoginModal } from './AdminLoginModal';
import { QRCodeModal } from './QRCodeModal';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    isUsingSupabase,
    showToast,
  } = useLeads();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const ownerPhone = '8497980957';
  const ownerWhatsAppUrl = `https://wa.me/91${ownerPhone}?text=${encodeURIComponent('Hi PixelStory Studios, I would like to inquire about wedding/event photography packages.')}`;
  const ownerEmail = 'Srikanthmallavarapu14@gmail.com';
  const ownerMailtoUrl = `mailto:${ownerEmail}?subject=${encodeURIComponent('PixelStory Studios Photography Inquiry')}`;

  const handleAdminToggle = () => {
    if (activeView === 'admin') {
      setActiveView('customer');
    } else {
      if (isAdminAuthenticated) {
        setActiveView('admin');
      } else {
        setIsLoginModalOpen(true);
      }
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setActiveView('customer');
    showToast('Logged out of Admin Portal', 'info');
  };

  return (
    <>
      {/* Top Owner Direct Contact Banner */}
      <div className="bg-gradient-to-r from-[#171720] via-[#121217] to-[#171720] border-b border-[#24242E] py-2 px-4 sm:px-6 text-xs text-gray-300 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-gray-300">Studio Director Direct Line:</span>
            <span className="text-[#D4AF37] font-medium hidden md:inline">Jubilee Hills, Hyderabad</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            {/* Direct WhatsApp Call Button */}
            <a
              href={ownerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-gray-200 hover:text-[#25D366] transition-colors group"
              title="Click to Chat on WhatsApp"
            >
              <div className="w-5 h-5 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-3 h-3" />
              </div>
              <span className="group-hover:underline font-mono">+91 {ownerPhone}</span>
            </a>

            <span className="text-gray-600">|</span>

            {/* Direct Email Link */}
            <a
              href={ownerMailtoUrl}
              className="inline-flex items-center gap-1.5 text-gray-200 hover:text-[#D4AF37] transition-colors group"
              title="Click to Email Studio Owner"
            >
              <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Mail className="w-3 h-3" />
              </div>
              <span className="group-hover:underline lowercase font-mono">{ownerEmail}</span>
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B0B0C]/90 border-b border-[#27272E] transition-all print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div 
            onClick={() => setActiveView('customer')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37]/30 to-[#0B0B0C] border border-[#D4AF37]/40 flex items-center justify-center shadow-gold-sm group-hover:scale-105 transition-transform duration-300">
              <Camera className="w-6 h-6 text-[#D4AF37] group-hover:rotate-6 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#D4AF37] transition-colors">
                  PixelStory <span className="text-[#D4AF37] italic font-normal">Studios</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase font-semibold tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                  <Sparkles className="w-2.5 h-2.5" /> Hyderabad
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-sans tracking-wide">
                Luxury Wedding &amp; Candid Cinematography • Jubilee Hills, Hyderabad
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Scan Button */}
            <button
              onClick={() => setIsQRModalOpen(true)}
              title="Scan QR Code to test on Mobile"
              className="px-2.5 py-1.5 rounded-xl bg-[#141418] hover:bg-[#1E1E24] border border-[#27272E] hover:border-[#D4AF37]/50 text-gray-300 hover:text-[#D4AF37] text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Mobile Test</span>
            </button>

            {/* Database indicator */}
            <div
              title={isUsingSupabase ? 'Connected to live Supabase PostgreSQL' : 'Active Local Database (Ready for Supabase)'}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border bg-[#141418] border-[#2A2A33] text-gray-300"
            >
              <Database className={`w-3.5 h-3.5 ${isUsingSupabase ? 'text-emerald-400' : 'text-[#D4AF37]'}`} />
              <span className="text-[11px] font-mono">{isUsingSupabase ? 'Supabase Connected' : 'Postgres Mode'}</span>
            </div>

            {/* View Switcher Toggle */}
            <div className="p-1 rounded-xl bg-[#141418] border border-[#27272E] flex items-center shadow-inner">
              <button
                onClick={() => setActiveView('customer')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  activeView === 'customer'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-semibold shadow-gold-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>Customer View</span>
              </button>

              <button
                onClick={handleAdminToggle}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  activeView === 'admin'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-semibold shadow-gold-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {isAdminAuthenticated ? (
                  <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span>Studio Portal</span>
              </button>
            </div>

            {/* Logout button when inside Admin */}
            {isAdminAuthenticated && activeView === 'admin' && (
              <button
                onClick={handleLogout}
                title="Log Out of Admin"
                className="p-2 rounded-xl bg-[#18181D] hover:bg-[#22222A] text-gray-400 hover:text-red-400 border border-[#27272E] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          setActiveView('admin');
        }}
      />

      {/* QR Code Mobile Test Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </>
  );
};
