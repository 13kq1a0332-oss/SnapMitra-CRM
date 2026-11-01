import React, { useState } from 'react';
import { X, Check, Sparkles, ArrowRight, Calculator, ShieldCheck, Film } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { EventType } from '../types/lead';
import { formatINR } from '../services/leadService';

interface AddonOption {
  id: string;
  name: string;
  price: number;
  desc: string;
}

const AVAILABLE_ADDONS: AddonOption[] = [
  { id: 'drone', name: 'Licensed 4K Aerial Drone', price: 20000, desc: 'DGCA compliant cinematic aerial perspectives' },
  { id: 'album_inlaws', name: 'Royal Leather Album (2nd Copy for In-Laws)', price: 15000, desc: '150-page handcrafted flush-mount heirloom album' },
  { id: 'same_day_led', name: 'Same-Day Sangeet/LED Wall Reel Edit', price: 25000, desc: 'Edited cinematic trailer projected same evening' },
  { id: '360_booth', name: '360 Slow-Motion Spin Booth', price: 18000, desc: 'Interactive guest video booth with instant QR download' },
  { id: 'pre_wedding_bundle', name: 'Pre-Wedding Shoot Bundle Add-On', price: 35000, desc: 'Full-day outdoor shoot in Hyderabad with 2 reels' },
];

export const PackageCustomizerModal: React.FC = () => {
  const { isPackageCustomizerOpen, setIsPackageCustomizerOpen, openSnapBotWithPackage } = useLeads();

  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [tier, setTier] = useState<'Gold' | 'Platinum'>('Platinum');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['drone', 'album_inlaws']);

  if (!isPackageCustomizerOpen) return null;

  const basePrice = eventType === 'Wedding' ? (tier === 'Platinum' ? 150000 : 75000) : (eventType === 'Pre-Wedding' ? 75000 : 60000);
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const found = AVAILABLE_ADDONS.find((a) => a.id === id);
    return sum + (found ? found.price : 0);
  }, 0);
  const grandTotal = basePrice + addonsTotal;

  // Milestone schedule
  const advanceToken = Math.round(grandTotal * 0.4);
  const shootDay = Math.round(grandTotal * 0.5);
  const delivery = grandTotal - advanceToken - shootDay;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBookWithCustomQuote = () => {
    setIsPackageCustomizerOpen(false);
    openSnapBotWithPackage(`${tier} ${eventType} (Custom Quote: ${formatINR(grandTotal)})`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-[#111116] rounded-2xl border border-[#D4AF37]/40 shadow-luxury flex flex-col max-h-[92vh] overflow-hidden text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#16161E] border-b border-[#27272E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-gold-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <span>SnapQuote Customizer</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  Transparent Pricing
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Customize equipment, albums &amp; cinema add-ons for your celebration
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPackageCustomizerOpen(false)}
            className="p-2 rounded-xl bg-[#20202A] hover:bg-[#2A2A38] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Step 1: Event Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              1. Select Event Type:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Wedding', 'Pre-Wedding', 'Birthday', 'Corporate'] as EventType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setEventType(type)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    eventType === type
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black shadow-gold-sm font-bold'
                      : 'bg-[#181822] text-gray-300 hover:bg-[#222230] border border-[#2B2B38]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Base Package Tier */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              2. Select Base Production Tier:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setTier('Gold')}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  tier === 'Gold'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-gold-sm'
                    : 'border-[#27272E] bg-[#16161E] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif font-bold text-sm text-white">Gold Package</span>
                  <span className="font-serif font-bold text-[#D4AF37]">
                    {formatINR(eventType === 'Wedding' ? 75000 : 60000)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  2 Master Photographers + 1 Cinematographer + 150p Royal Album
                </p>
              </button>

              <button
                onClick={() => setTier('Platinum')}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  tier === 'Platinum'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-gold-sm'
                    : 'border-[#27272E] bg-[#16161E] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif font-bold text-sm text-white">
                    Platinum Luxury Package ⭐
                  </span>
                  <span className="font-serif font-bold text-[#D4AF37]">
                    {formatINR(eventType === 'Wedding' ? 150000 : 75000)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Full 4K Cinema Directors + Candid Specialists + Aerial Drone + 250p Leather Album
                </p>
              </button>
            </div>
          </div>

          {/* Step 3: Add-on Upgrades */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              3. Select Optional Production Add-ons:
            </label>
            <div className="space-y-2">
              {AVAILABLE_ADDONS.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10'
                        : 'border-[#27272E] bg-[#16161E] hover:border-[#383848]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-black font-bold transition-colors ${
                          isSelected ? 'bg-[#D4AF37]' : 'border border-gray-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{addon.name}</div>
                        <div className="text-[10px] text-gray-400">{addon.desc}</div>
                      </div>
                    </div>
                    <div className="font-serif font-bold text-xs text-[#D4AF37]">
                      +{formatINR(addon.price)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Quote & Milestone Summary Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#1C1C24] to-[#121217] border border-[#D4AF37]/40 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                  Total Estimated Investment
                </span>
                <span className="font-serif text-2xl font-bold text-[#D4AF37]">
                  {formatINR(grandTotal)}
                </span>
              </div>
              <div className="text-right text-[11px] text-gray-400">
                <span>Base: {formatINR(basePrice)}</span>
                <span className="block text-emerald-400">Addons: +{formatINR(addonsTotal)}</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#2C2C38] grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-1.5 rounded-lg bg-black/40">
                <span className="text-gray-400 block">40% Date Hold</span>
                <span className="font-semibold text-white">{formatINR(advanceToken)}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/40">
                <span className="text-gray-400 block">50% Shoot Day</span>
                <span className="font-semibold text-white">{formatINR(shootDay)}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/40">
                <span className="text-gray-400 block">10% Album Handover</span>
                <span className="font-semibold text-white">{formatINR(delivery)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#14141B] border-t border-[#27272E] flex items-center justify-between gap-3">
          <div className="text-xs text-gray-400 hidden sm:block">
            Includes crew travel within Hyderabad &amp; 48h preview teaser.
          </div>
          <button
            onClick={handleBookWithCustomQuote}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C048] to-[#AA7C11] text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-gold-sm hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Proceed with this Quote in SnapBot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

