-- ===================================================================
-- SnapMitra CRM - Supabase / PostgreSQL Schema Migration (v3 Enhanced)
-- Designed for PixelStory Studios (Hyderabad)
-- ===================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create 'leads' Table (with Enhanced Fields & Email Support)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT DEFAULT '',
    event_type TEXT NOT NULL CHECK (event_type IN ('Wedding', 'Pre-Wedding', 'Birthday', 'Corporate', 'Other')),
    event_date DATE NOT NULL,
    guest_count INTEGER DEFAULT 0,
    chat_summary TEXT,
    label TEXT NOT NULL CHECK (label IN ('High-Value', 'Medium', 'Standard')),
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Booked', 'Archived')),
    calculated_quote NUMERIC(12, 2) DEFAULT 0,
    whatsapp_draft TEXT,
    notes TEXT DEFAULT '',
    selected_addons TEXT[] DEFAULT '{}',
    follow_up_date DATE
);

-- 3. Seamless Migration Alter statements (in case table was already created)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'client_email') THEN
        ALTER TABLE leads ADD COLUMN client_email TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'notes') THEN
        ALTER TABLE leads ADD COLUMN notes TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'selected_addons') THEN
        ALTER TABLE leads ADD COLUMN selected_addons TEXT[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'follow_up_date') THEN
        ALTER TABLE leads ADD COLUMN follow_up_date DATE;
    END IF;
END $$;

-- 4. Optimized Indexes for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_label ON leads(label);
CREATE INDEX IF NOT EXISTS idx_leads_event_date ON leads(event_date);
CREATE INDEX IF NOT EXISTS idx_leads_event_type ON leads(event_type);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON leads(follow_up_date);
CREATE INDEX IF NOT EXISTS idx_leads_client_email ON leads(client_email);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Allow public read and write access for SnapMitra leads'
    ) THEN
        CREATE POLICY "Allow public read and write access for SnapMitra leads"
            ON leads
            FOR ALL
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- 6. Seed Mock Data (Hyderabad context with realistic leads, emails & add-ons)
INSERT INTO leads (
    id, created_at, client_name, client_phone, client_email, event_type, event_date, 
    guest_count, chat_summary, label, status, calculated_quote, whatsapp_draft,
    notes, selected_addons, follow_up_date
) VALUES
(
    'e1a3b8c0-82a1-4389-9a2f-111111111101',
    NOW() - INTERVAL '2 hours',
    'Ananya Reddy',
    '+91 98490 23145',
    'ananya.reddy@gmail.com',
    'Wedding',
    '2026-12-14',
    850,
    'Luxury multi-session wedding at Taj Falaknuma Palace. Needs 4K drone cinematography, candid photography, and crane setups.',
    'High-Value',
    'New',
    170000,
    'Hi Ananya Reddy! This is PixelStory Studios Hyderabad. 📸 We are excited to shoot your upcoming Wedding on 2026-12-14. We have blocked our premium Platinum package equipment for you. Our head photographer is reviewing your luxury multi-session wedding at Taj Falaknuma Palace details and will give you a quick call shortly. Looking forward to capturing your beautiful memories!',
    'Father requested private evening consultation call. Highly interested in drone cinema.',
    ARRAY['Licensed 4K Drone', 'Heirloom Leather Album'],
    CURRENT_DATE + INTERVAL '2 days'
),
(
    'e1a3b8c0-82a1-4389-9a2f-111111111102',
    NOW() - INTERVAL '5 hours',
    'Vikram & Sneha Varma',
    '+91 98850 78219',
    'vikram.varma@outlook.com',
    'Pre-Wedding',
    '2026-11-28',
    50,
    'Scenic outdoor pre-wedding shoot at Ananthagiri Hills. Requests 2 cinematic highlight reels and customized sunset portraiture.',
    'Medium',
    'Contacted',
    95000,
    'Hi Vikram & Sneha Varma! This is PixelStory Studios Hyderabad. 📸 We are excited to shoot your upcoming Pre-Wedding on 2026-11-28. We have blocked our premium Gold package equipment for you. Our head photographer is reviewing your scenic outdoor pre-wedding shoot details and will give you a quick call shortly. Looking forward to capturing your beautiful memories!',
    'Sent moodboard via WhatsApp. Couple loves cinematic drone shots.',
    ARRAY['Instagram 4K Reel Teasers'],
    CURRENT_DATE + INTERVAL '1 day'
),
(
    'e1a3b8c0-82a1-4389-9a2f-111111111103',
    NOW() - INTERVAL '14 hours',
    'Rajesh Kulkarni',
    '+91 99480 34102',
    'rajesh.kulkarni@yahoo.com',
    'Wedding',
    '2026-12-22',
    600,
    'Traditional Telugu wedding ceremony in Jubilee Hills. Client opted for traditional coverage plus live LED display streaming.',
    'High-Value',
    'Booked',
    175000,
    'Hi Rajesh Kulkarni! This is PixelStory Studios Hyderabad. 📸 We are excited to shoot your upcoming Wedding on 2026-12-22. We have blocked our premium Platinum package equipment for you. Our head photographer is reviewing your traditional Telugu wedding ceremony details and will give you a quick call shortly. Looking forward to capturing your beautiful memories!',
    'Booking confirmed. Advance token received: ₹50,000 via UPI.',
    ARRAY['Same-Day LED Projection', 'Live Mandap Stream'],
    CURRENT_DATE + INTERVAL '5 days'
),
(
    'e1a3b8c0-82a1-4389-9a2f-111111111104',
    NOW() - INTERVAL '24 hours',
    'Sireesha',
    '+91 84979 80957',
    'srikanthmallavarapu2@gmail.com',
    'Birthday',
    '2026-12-01',
    100,
    'Exclusive birthday celebration for ~100 guests on 2026-12-01.\nClient requested Gold standard coverage package.',
    'Standard',
    'New',
    70000,
    'Hi Sireesha! This is PixelStory Studios Hyderabad. 📸 We are excited to shoot your upcoming Birthday on 2026-12-01. We have blocked our premium Gold package equipment for you. Our head photographer is reviewing your celebration details and will give you a quick call shortly. Looking forward to capturing your beautiful memories!',
    'Client provided email for quotation delivery.',
    ARRAY['Instagram 4K Reel Teasers'],
    CURRENT_DATE + INTERVAL '3 days'
)
ON CONFLICT (id) DO UPDATE SET
    client_email = EXCLUDED.client_email,
    notes = EXCLUDED.notes,
    selected_addons = EXCLUDED.selected_addons,
    follow_up_date = EXCLUDED.follow_up_date;
