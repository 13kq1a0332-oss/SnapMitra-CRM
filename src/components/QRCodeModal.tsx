import React from 'react';
import { X, Smartphone, Sparkles, ExternalLink, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const deployedUrl = 'https://snap-mitra-crm.vercel.app/';
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    deployedUrl
  )}&color=D4AF37&bgcolor=0B0B0C`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-sm bg-[#121218] rounded-2xl border border-[#D4AF37]/40 shadow-luxury p-6 text-white text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-3 text-[#D4AF37]">
          <Smartphone className="w-6 h-6" />
        </div>

        <h3 className="font-serif text-xl font-bold text-white mb-1">
          Scan to Test on Mobile
        </h3>
        <p className="text-xs text-gray-400 mb-5">
          Scan with your iPhone or Android camera to test SnapBot and voice lead capture on your mobile phone!
        </p>

        {/* QR Code Container */}
        <div className="p-4 rounded-xl bg-[#09090C] border border-[#27272E] inline-block mb-4 shadow-inner">
          <img
            src={qrCodeImageUrl}
            alt="SnapMitra Mobile QR Code"
            className="w-48 h-48 rounded-lg mx-auto"
          />
        </div>

        <div className="space-y-2">
          <a
            href={deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-mono hover:underline"
          >
            <span>{deployedUrl}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <p className="text-[11px] text-gray-500">
            PixelStory Studios Hyderabad • Mobile-First PWA Experience
          </p>
        </div>
      </div>
    </div>
  );
};
