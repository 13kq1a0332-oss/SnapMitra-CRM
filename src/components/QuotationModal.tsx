import React from 'react';
import { X, Printer, Download, Sparkles, CheckCircle2, ShieldCheck, Camera } from 'lucide-react';
import { Lead } from '../types/lead';
import { formatINR } from '../services/leadService';

interface QuotationModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({ lead, isOpen, onClose }) => {
  if (!isOpen || !lead) return null;

  const quoteNumber = `PSS-HYD-${lead.id.slice(0, 6).toUpperCase()}`;
  const isPlatinum = lead.calculated_quote >= 150000;
  const basePackageName = isPlatinum ? 'Platinum Luxury Cinema & Candid Package' : 'Gold Standard Traditional Package';
  const basePrice = isPlatinum ? 150000 : 75000;
  const addonsTotal = Math.max(0, lead.calculated_quote - basePrice);

  const advanceToken = Math.round(lead.calculated_quote * 0.4);
  const shootDayPayment = Math.round(lead.calculated_quote * 0.5);
  const finalDeliveryPayment = lead.calculated_quote - advanceToken - shootDayPayment;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="w-full max-w-3xl bg-[#111116] rounded-2xl border border-[#D4AF37]/50 shadow-luxury flex flex-col text-white my-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="px-6 py-4 bg-[#181822] border-b border-[#27272E] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Formal Studio Quotation</span>
            </span>
            <span className="text-xs text-gray-400 font-mono">({quoteNumber})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-semibold text-xs flex items-center gap-1.5 shadow-gold-sm hover:brightness-110 active:scale-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#22222E] hover:bg-[#2C2C3C] text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Container */}
        <div className="p-6 sm:p-10 bg-[#0E0E13] text-gray-200 font-sans space-y-6 print:bg-white print:text-black print:p-8">
          {/* Studio Letterhead */}
          <div className="border-b border-[#2B2B38] pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:border-gray-300">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] print:border-black print:text-black">
                  <Camera className="w-4 h-4" />
                </div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-white print:text-black">
                  PixelStory <span className="text-[#D4AF37] italic font-normal print:text-black">Studios</span>
                </h1>
              </div>
              <p className="text-xs text-gray-400 mt-1 print:text-gray-600">
                Road No. 36, Jubilee Hills, Hyderabad - 500033 • Telangana, India
              </p>
              <p className="text-[11px] text-gray-500 font-mono print:text-gray-600">
                GSTIN: 36AAECP4921F1ZX • Email: concierge@pixelstorystudios.com
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block print:text-gray-700">
                Official Estimate
              </span>
              <div className="font-mono text-sm font-bold text-white print:text-black mt-0.5">
                {quoteNumber}
              </div>
              <div className="text-xs text-gray-400 print:text-gray-600">
                Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Client & Event Dossier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#14141B] border border-[#27272E] print:bg-gray-50 print:border-gray-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 print:text-gray-600 block mb-1">
                Prepared Exclusively For:
              </span>
              <h3 className="font-serif text-lg font-bold text-white print:text-black">
                {lead.client_name}
              </h3>
              <p className="text-xs text-gray-300 font-mono mt-0.5 print:text-gray-700">
                Phone: {lead.client_phone}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 print:text-gray-600 block mb-1">
                Event Reservation Details:
              </span>
              <div className="text-sm font-semibold text-white print:text-black">
                {lead.event_type} Celebration
              </div>
              <p className="text-xs text-gray-300 print:text-gray-700">
                Date: <strong className="font-mono">{lead.event_date}</strong> (~{lead.guest_count} Guests)
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-[#27272E] rounded-xl overflow-hidden print:border-gray-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181822] text-gray-300 uppercase tracking-wider text-[11px] border-b border-[#27272E] print:bg-gray-100 print:text-gray-700">
                <tr>
                  <th className="py-3 px-4">Production Item &amp; Deliverables</th>
                  <th className="py-3 px-4 text-center">Crew Count</th>
                  <th className="py-3 px-4 text-right">Investment (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22222C] print:divide-gray-200 text-xs">
                <tr>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white print:text-black block">
                      {basePackageName}
                    </span>
                    <span className="text-[11px] text-gray-400 print:text-gray-600">
                      {isPlatinum
                        ? '2 Candid Artists, 2 4K Cinema Directors, 3-5m Teaser, 45m Feature Film, 250p Royal Leather Heirloom Album'
                        : '2 Traditional Photographers, 1 HD Videographer, Full Ceremony Coverage, 150p Royal Album'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-gray-300 print:text-gray-700">
                    {isPlatinum ? '4 Crew' : '3 Crew'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-serif font-bold text-white print:text-black">
                    {formatINR(basePrice)}
                  </td>
                </tr>

                {lead.selected_addons && lead.selected_addons.length > 0 && (
                  <tr>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white print:text-black block">
                        Selected Production Add-Ons
                      </span>
                      <span className="text-[11px] text-gray-400 print:text-gray-600">
                        {lead.selected_addons.join(' • ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-gray-300 print:text-gray-700">
                      Included
                    </td>
                    <td className="py-3.5 px-4 text-right font-serif font-bold text-white print:text-black">
                      +{formatINR(addonsTotal)}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-[#14141B] font-semibold border-t border-[#27272E] print:bg-gray-50 print:border-gray-300">
                <tr>
                  <td colSpan={2} className="py-3.5 px-4 text-right uppercase text-[11px] text-gray-400 print:text-gray-700">
                    Total All-Inclusive Quotation:
                  </td>
                  <td className="py-3.5 px-4 text-right font-serif text-lg font-bold text-[#D4AF37] print:text-black">
                    {formatINR(lead.calculated_quote)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Terms & Schedule */}
          <div className="p-4 rounded-xl bg-[#14141B] border border-[#27272E] print:bg-white print:border-gray-200">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300 print:text-gray-800 block mb-2">
              Payment Milestones:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-black/40 print:bg-gray-100">
                <span className="text-gray-400 print:text-gray-600 block text-[10px]">1. Advance Token (40%)</span>
                <span className="font-serif font-bold text-white print:text-black">{formatINR(advanceToken)}</span>
                <span className="text-[10px] text-gray-500 block">Blocks camera schedules</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 print:bg-gray-100">
                <span className="text-gray-400 print:text-gray-600 block text-[10px]">2. Shoot Day (50%)</span>
                <span className="font-serif font-bold text-white print:text-black">{formatINR(shootDayPayment)}</span>
                <span className="text-[10px] text-gray-500 block">On arrival at venue</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 print:bg-gray-100">
                <span className="text-gray-400 print:text-gray-600 block text-[10px]">3. Album Handover (10%)</span>
                <span className="font-serif font-bold text-white print:text-black">{formatINR(finalDeliveryPayment)}</span>
                <span className="text-[10px] text-gray-500 block">On final delivery</span>
              </div>
            </div>
          </div>

          {/* Signatures & Bank Transfer details */}
          <div className="pt-4 border-t border-[#27272E] flex flex-col sm:flex-row items-end justify-between gap-4 text-xs print:border-gray-300">
            <div className="text-[11px] text-gray-500 print:text-gray-600">
              <p>UPI ID: <strong className="text-gray-300 print:text-black">pixelstory@icici</strong></p>
              <p>Bank: HDFC Bank, Jubilee Hills Branch • A/C: 50200012345678</p>
              <p className="text-[10px] text-gray-600 mt-1">This estimate is valid for 14 days from issue date.</p>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-serif text-sm font-bold text-[#D4AF37] italic print:text-black">
                Vikram Varma
              </div>
              <div className="text-[10px] text-gray-400 print:text-gray-600">
                Lead Director, PixelStory Studios Hyderabad
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
