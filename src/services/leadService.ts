import { Lead, NewLeadPayload, LeadStatus, LeadLabel, EventType } from '../types/lead';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_MOCK_LEADS } from './mockData';

const LOCAL_STORAGE_KEY = 'snapmitra_leads_v1';

export function determineLeadLabel(eventType: EventType): LeadLabel {
  switch (eventType) {
    case 'Wedding':
      return 'High-Value';
    case 'Pre-Wedding':
      return 'Medium';
    case 'Birthday':
    case 'Corporate':
    case 'Other':
    default:
      return 'Standard';
  }
}

export function calculateBaseQuote(eventType: EventType, packageTier: 'Gold' | 'Platinum' | 'Standard' = 'Gold'): number {
  if (eventType === 'Wedding') {
    return packageTier === 'Platinum' ? 150000 : 75000;
  }
  if (eventType === 'Pre-Wedding') {
    return 75000;
  }
  if (eventType === 'Corporate') {
    return 85000;
  }
  if (eventType === 'Birthday') {
    return 50000;
  }
  return 45000;
}

export function generateWhatsAppPitch(lead: {
  client_name: string;
  event_type: string;
  event_date: string;
  calculated_quote: number;
  chat_summary?: string;
}): string {
  const packageType = lead.calculated_quote >= 150000 ? 'Platinum' : 'Gold';
  const summaryText = lead.chat_summary ? lead.chat_summary.replace(/\n/g, ' ') : 'event requirements';

  return `Hi ${lead.client_name}! This is PixelStory Studios Hyderabad. 📸 We are excited to shoot your upcoming ${lead.event_type} on ${lead.event_date}. We have blocked our premium ${packageType} package equipment for you. Our head photographer is reviewing your ${summaryText} and will give you a quick call shortly. Looking forward to capturing your beautiful memories!`;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Local Storage helpers
function getLocalLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LEADS));
      return INITIAL_MOCK_LEADS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_LEADS;
  } catch (err) {
    console.error('Failed to parse leads from localStorage', err);
    return INITIAL_MOCK_LEADS;
  }
}

function setLocalLeads(leads: Lead[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('Failed to write leads to localStorage', err);
  }
}

export const leadService = {
  isUsingSupabase(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  async fetchLeads(): Promise<Lead[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Sync locally as cache
          setLocalLeads(data as Lead[]);
          return data as Lead[];
        }
        console.warn('Supabase fetch failed or empty, falling back to local storage', error);
      } catch (err) {
        console.warn('Supabase connection error, using local storage', err);
      }
    }
    return getLocalLeads();
  },

  async createLead(payload: NewLeadPayload): Promise<Lead> {
    const newLead: Lead = {
      id: payload.id || crypto.randomUUID(),
      created_at: payload.created_at || new Date().toISOString(),
      client_name: payload.client_name,
      client_phone: payload.client_phone,
      event_type: payload.event_type,
      event_date: payload.event_date,
      guest_count: payload.guest_count,
      chat_summary: payload.chat_summary,
      label: payload.label || determineLeadLabel(payload.event_type),
      status: payload.status || 'New',
      calculated_quote: payload.calculated_quote,
      whatsapp_draft: payload.whatsapp_draft || generateWhatsAppPitch(payload),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('leads').insert([newLead]).select().single();
        if (!error && data) {
          const current = getLocalLeads();
          setLocalLeads([data as Lead, ...current]);
          return data as Lead;
        }
        console.warn('Supabase insert failed, fallback to local', error);
      } catch (err) {
        console.warn('Supabase insert exception, fallback to local', err);
      }
    }

    const current = getLocalLeads();
    const updated = [newLead, ...current.filter((l) => l.id !== newLead.id)];
    setLocalLeads(updated);
    return newLead;
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('leads').update({ status }).eq('id', id);
        if (error) console.warn('Supabase update status failed', error);
      } catch (err) {
        console.warn('Supabase update status error', err);
      }
    }

    const current = getLocalLeads();
    const updated = current.map((lead) => (lead.id === id ? { ...lead, status } : lead));
    setLocalLeads(updated);
    return true;
  },

  async deleteLead(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) console.warn('Supabase delete failed', error);
      } catch (err) {
        console.warn('Supabase delete error', err);
      }
    }

    const current = getLocalLeads();
    const updated = current.filter((lead) => lead.id !== id);
    setLocalLeads(updated);
    return true;
  },

  resetMockData(): Lead[] {
    setLocalLeads(INITIAL_MOCK_LEADS);
    return INITIAL_MOCK_LEADS;
  },
};

