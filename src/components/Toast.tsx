import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLeads();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${
            toast.type === 'success'
              ? 'bg-[#121814]/95 border-emerald-500/40 text-emerald-200'
              : toast.type === 'warning'
              ? 'bg-[#1C1510]/95 border-amber-500/40 text-amber-200'
              : 'bg-[#13131A]/95 border-[#D4AF37]/40 text-[#F4F4F6]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />}
          
          <div className="flex-1 text-sm font-medium leading-relaxed">
            {toast.message}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

