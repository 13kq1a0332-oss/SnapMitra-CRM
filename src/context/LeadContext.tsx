import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, NewLeadPayload, LeadStatus } from '../types/lead';
import { leadService } from '../services/leadService';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface LeadContextType {
  leads: Lead[];
  loading: boolean;
  activeView: 'customer' | 'admin';
  setActiveView: (view: 'customer' | 'admin') => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  isSnapBotOpen: boolean;
  setIsSnapBotOpen: (open: boolean) => void;
  preselectedPackage: string | null;
  openSnapBotWithPackage: (pkg: string) => void;
  addLead: (payload: NewLeadPayload) => Promise<Lead>;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  resetMockData: () => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: number) => void;
  isUsingSupabase: boolean;
  refreshLeads: () => Promise<void>;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'customer' | 'admin'>('customer');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSnapBotOpen, setIsSnapBotOpen] = useState<boolean>(false);
  const [preselectedPackage, setPreselectedPackage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const isUsingSupabase = leadService.isUsingSupabase();

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await leadService.fetchLeads();
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openSnapBotWithPackage = (pkg: string) => {
    setPreselectedPackage(pkg);
    setIsSnapBotOpen(true);
  };

  const addLead = async (payload: NewLeadPayload): Promise<Lead> => {
    const created = await leadService.createLead(payload);
    setLeads((prev) => [created, ...prev.filter((l) => l.id !== created.id)]);
    showToast(`Lead created for ${created.client_name}! 🚀`, 'success');
    return created;
  };

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    await leadService.updateLeadStatus(id, status);
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(`Status updated to "${status}"`, 'info');
  };

  const deleteLead = async (id: string) => {
    await leadService.deleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selectedLead?.id === id) {
      setSelectedLead(null);
    }
    showToast('Lead removed', 'warning');
  };

  const resetMockData = () => {
    const initial = leadService.resetMockData();
    setLeads(initial);
    setSelectedLead(null);
    showToast('Reset to default 5+ Hyderabad mock leads', 'info');
  };

  const refreshLeads = async () => {
    await loadData();
    showToast('Leads refreshed', 'info');
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        loading,
        activeView,
        setActiveView,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        selectedLead,
        setSelectedLead,
        isSnapBotOpen,
        setIsSnapBotOpen,
        preselectedPackage,
        openSnapBotWithPackage,
        addLead,
        updateLeadStatus,
        deleteLead,
        resetMockData,
        toasts,
        showToast,
        removeToast,
        isUsingSupabase,
        refreshLeads,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = (): LeadContextType => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};

