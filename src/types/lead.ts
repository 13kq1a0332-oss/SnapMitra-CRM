export type EventType = 'Wedding' | 'Pre-Wedding' | 'Birthday' | 'Corporate' | 'Other';

export type LeadLabel = 'High-Value' | 'Medium' | 'Standard';

export type LeadStatus = 'New' | 'Contacted' | 'Booked' | 'Archived';

export interface Lead {
  id: string;
  created_at: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  event_type: EventType;
  custom_event_name?: string;
  event_date: string;
  guest_count: number;
  chat_summary: string;
  label: LeadLabel;
  status: LeadStatus;
  calculated_quote: number;
  whatsapp_draft: string;
  notes?: string;
  selected_addons?: string[];
  follow_up_date?: string;
}

export type NewLeadPayload = Omit<Lead, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type WhatsAppTemplateId = 'initial' | 'urgency_hold' | 'festival_bonus' | 'call_confirm';

export interface WhatsAppTemplate {
  id: WhatsAppTemplateId;
  title: string;
  badge: string;
  generate: (lead: Lead) => string;
}
