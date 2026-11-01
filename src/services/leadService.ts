import { Lead, NewLeadPayload, LeadStatus, LeadLabel, EventType, WhatsAppTemplateId } from '../types/lead';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_MOCK_LEADS } from './mockData';

const LOCAL_STORAGE_KEY = 'snapmitra_leads_v3';

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

export function calculateBaseQuote(
  eventType: EventType,
  packageTier: 'Gold' | 'Platinum' | 'Standard' = 'Gold',
  addons: string[] = []
): number {
  let base = 75000;
  if (eventType === 'Wedding') {
    base = packageTier === 'Platinum' ? 150000 : 75000;
  } else if (eventType === 'Pre-Wedding') {
    base = 75000;
  } else if (eventType === 'Corporate') {
    base = 85000;
  } else if (eventType === 'Birthday') {
    base = 50000;
  } else {
    base = 45000;
  }

  // Add-on pricing
  const addonCost = addons.reduce((sum, item) => {
    if (item.includes('Drone')) return sum + 20000;
    if (item.includes('Album')) return sum + 15000;
    if (item.includes('LED') || item.includes('Projection')) return sum + 25000;
    if (item.includes('360')) return sum + 18000;
    if (item.includes('Reel')) return sum + 12000;
    return sum + 10000;
  }, 0);

  return base + addonCost;
}

export function cleanContactInfo(rawInput: string): { phone: string; email?: string } {
  const trimmed = rawInput.trim();

  // 1. Detect if an email is present anywhere in the text
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = trimmed.match(emailRegex);
  const email = emailMatch ? emailMatch[0].trim() : undefined;

  // 2. Extract phone number digits from text excluding the email part
  const textWithoutEmail = email ? trimmed.replace(email, ' ') : trimmed;
  const digitsOnly = textWithoutEmail.replace(/[^0-9]/g, '');

  let phone: string;
  if (digitsOnly.length === 10) {
    phone = `+91 ${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
  } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    phone = `+91 ${digitsOnly.slice(2, 7)} ${digitsOnly.slice(7)}`;
  } else if (digitsOnly.length >= 7) {
    phone = digitsOnly.startsWith('91') ? `+${digitsOnly}` : `+91 ${digitsOnly}`;
  } else if (email) {
    phone = 'Provided via Email';
  } else {
    phone = trimmed.startsWith('+') ? trimmed : `+91 ${trimmed}`;
  }

  return {
    phone,
    email,
  };
}

export function generateWhatsAppPitch(
  lead: {
    client_name: string;
    event_type: string;
    custom_event_name?: string;
    event_date: string;
    calculated_quote: number;
    chat_summary?: string;
    selected_addons?: string[];
  },
  template: WhatsAppTemplateId = 'initial'
): string {
  const packageType = lead.calculated_quote >= 150000 ? 'Platinum' : 'Gold';
  const summaryText = lead.chat_summary ? lead.chat_summary.replace(/\n/g, ' ') : 'event requirements';
  const addonText = lead.selected_addons && lead.selected_addons.length > 0
    ? `including your requested add-ons (${lead.selected_addons.join(', ')})`
    : '';
  const eventName = lead.custom_event_name || (lead.event_type === 'Other' ? 'special celebration' : lead.event_type);

  switch (template) {
    case 'urgency_hold':
      return `Hi ${lead.client_name}! This is PixelStory Studios Hyderabad. 📸 Regarding your ${eventName} on ${lead.event_date}: this is a peak auspicious Muhurtham date and we have received 2 other inquiries. We have placed a temporary 48-Hour Priority Hold on our ${packageType} cinema team for you. Let us know if you would like a quick 5-minute video call today to secure your date!`;

    case 'festival_bonus':
      return `Namaste ${lead.client_name}! ✨ PixelStory Studios Hyderabad here. We loved reviewing your ${eventName} vision for ${lead.event_date}. If you confirm your ${packageType} Package reservation this week, we are happy to bundle complimentary 4K Aerial Drone Coverage worth ₹20,000 for your main ceremony. Let's create magic together!`;

    case 'call_confirm':
      return `Hi ${lead.client_name}! PixelStory Studios Hyderabad. 📞 Our Lead Photographer Vikram is scheduled to give you a brief call this evening to discuss your camera setups, venue lighting, and wedding film style for ${lead.event_date}. Looking forward to speaking with you!`;

    case 'initial':
    default:
      return `Hi ${lead.client_name}! This is PixelStory Studios Hyderabad. 📸 We are excited to shoot your upcoming ${eventName} on ${lead.event_date}. We have blocked our premium ${packageType} package equipment for you ${addonText}. Our head photographer is reviewing your ${summaryText} and will give you a quick call shortly. Looking forward to capturing your beautiful memories!`;
  }
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
          setLocalLeads(data as Lead[]);
          return data as Lead[];
        }
        console.warn('Supabase fetch fallback to local storage', error);
      } catch (err) {
        console.warn('Supabase fetch exception', err);
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
      client_email: payload.client_email || '',
      event_type: payload.event_type,
      custom_event_name: payload.custom_event_name || '',
      event_date: payload.event_date,
      guest_count: payload.guest_count,
      chat_summary: payload.chat_summary,
      label: payload.label || determineLeadLabel(payload.event_type),
      status: payload.status || 'New',
      calculated_quote: payload.calculated_quote,
      whatsapp_draft: payload.whatsapp_draft || generateWhatsAppPitch(payload),
      notes: payload.notes || '',
      selected_addons: payload.selected_addons || [],
      follow_up_date: payload.follow_up_date || new Date(Date.now() + 2 * 86400 * 1000).toISOString().slice(0, 10),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        let insertRes = await supabase.from('leads').insert([newLead]).select().single();
        // If Supabase schema hasn't added custom_event_name column yet, retry without that field
        if (insertRes.error && insertRes.error.message && insertRes.error.message.includes('custom_event_name')) {
          const { custom_event_name, ...fallbackPayload } = newLead;
          insertRes = await supabase.from('leads').insert([fallbackPayload]).select().single();
        }

        if (!insertRes.error && insertRes.data) {
          const mergedLead = { ...newLead, ...insertRes.data };
          const current = getLocalLeads();
          setLocalLeads([mergedLead, ...current]);
          return mergedLead;
        }
        console.warn('Supabase insert failed, fallback to local', insertRes.error);
      } catch (err) {
        console.warn('Supabase insert exception, fallback to local', err);
      }
    }

    const current = getLocalLeads();
    const updated = [newLead, ...current.filter((l) => l.id !== newLead.id)];
    setLocalLeads(updated);
    return newLead;
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('leads').update(updates).eq('id', id);
        if (error) console.warn('Supabase update failed', error);
      } catch (err) {
        console.warn('Supabase update error', err);
      }
    }

    const current = getLocalLeads();
    const updated = current.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead));
    setLocalLeads(updated);
    return true;
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
    return this.updateLead(id, { status });
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
