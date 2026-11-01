import React from 'react';
import { LeadProvider, useLeads } from './context/LeadContext';
import { Navbar } from './components/Navbar';
import { CustomerView } from './components/CustomerView';
import { AdminDashboard } from './components/AdminDashboard';
import { SnapBotModal } from './components/SnapBotModal';
import { PackageCustomizerModal } from './components/PackageCustomizerModal';
import { ToastContainer } from './components/Toast';

const MainLayout: React.FC = () => {
  const { activeView } = useLeads();

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
      <div>
        <Navbar />
        <main>
          {activeView === 'customer' ? <CustomerView /> : <AdminDashboard />}
        </main>
      </div>

      {/* SnapBot Chatbot Dialog / Drawer */}
      <SnapBotModal />

      {/* Interactive Package & Quote Customizer Modal */}
      <PackageCustomizerModal />

      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Luxury Footer */}
      <footer className="border-t border-[#1C1C24] bg-[#0A0A0D] py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-gray-300">
              PixelStory <span className="text-[#D4AF37] italic font-normal">Studios</span>
            </span>
            <span>•</span>
            <span>Jubilee Hills &amp; Banjara Hills, Hyderabad</span>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <span>Built with <strong className="text-gray-200">SnapMitra CRM Engine</strong></span>
            <span>•</span>
            <span className="text-[#D4AF37]">Zero-Hallucination Guardrails &amp; Voice Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LeadProvider>
      <MainLayout />
    </LeadProvider>
  );
};

export default App;
