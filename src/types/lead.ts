export type EventType = 'Wedding' | 'Pre-Wedding' | 'Birthday' | 'Corporate' | 'Other';

export type LeadLabel = 'High-Value' | 'Medium' | 'Standard';

export type LeadStatus = 'New' | 'Contacted' | 'Booked' | 'Archived';

export interface Lead {
  id: string;
  created_at: string;
  client_name: string;
  client_phone: string;
  event_type: EventType;
  event_date: string;
  guest_count: number;
  chat_summary: string;
  label: LeadLabel;
  status: LeadStatus;
  calculated_quote: number;
  whatsapp_draft: string;
}

export type NewLeadPayload = Omit<Lead, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

