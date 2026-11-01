# SnapMitra CRM — PixelStory Studios (Hyderabad)
### Mobile-First Luxury Lead Capture & WhatsApp Automation Engine

> **Grand Hackathon Project**: Built for Indian wedding and event photography studios to solve lead leakage, enforce zero-hallucination pricing guardrails, and empower studio owners with 1-click dynamic WhatsApp follow-ups.

---

## 🌟 4-Phase Architecture Implementation

### 🚀 Phase 1: Database Schema & Backend Setup (The Foundation)
- **Table**: `leads` (UUID primary key, timestamps, client details, event specs, AI summary, priority label, status, quote, WhatsApp draft).
- **PostgreSQL / Supabase Migration**: Located at [`supabase/schema.sql`](./supabase/schema.sql).
- **Realistic Mock Data**: 6 pre-seeded Hyderabad leads across Jubilee Hills, Taj Falaknuma, Banjara Hills, Novotel HICC, and Ananthagiri Hills.
- **Resilient State Management**: Dual-mode engine (`src/services/leadService.ts`) connects to live Supabase if credentials are provided in `.env`, or seamlessly falls back to local persistence so it works out-of-the-box.

### 🎨 Phase 2: Mobile-First Frontend & Design System
- **Luxury Aesthetic**: Deep obsidian black (`#0B0B0C`), champagne gold (`#D4AF37`), warm slate, and Playfair Display serif typography.
- **Top Navigation Bar**: Active switcher between **Customer View** and password-protected **Admin Portal** (`admin` / `admin`).
- **Signature Offerings**:
  1. *Traditional Wedding* (Gold Package: ₹75,000)
  2. *Candid Cinematography* (Platinum Package: ₹1,50,000)
  3. *Pre-Wedding & Outdoor Shoots* (Custom Base Packages)
- **Floating Action Button (FAB)**: Pulsing champagne gold "Check Availability & Get Quote" button triggering SnapBot from anywhere.

### 🤖 Phase 3: "SnapBot" Chat Assistant & Guardrails (The AI Moment)
- **Conversational Concierge**: Greets customers, systematically collects Name, Phone, Event Type, Date, and Guest Count.
- **Base Pricing Rules**: Transparently quotes Gold (₹75,000) and Platinum (₹1,50,000).
- **STRICT Guardrail Rule**: For discounts, multi-day schedules, travel outside Hyderabad, or camera modifications, SnapBot strictly and verbatim responds:
  > *"Our lead photographer will review your request and call back with a custom quote."*
- **Built-in Judges Guardrail Tester**: Dropdown inside SnapBot to test discount negotiation, 3-day schedules, destination Goa travel, and RED camera mods with 1 click.
- **Auto-Sync on Chat Complete**: Automatically creates a 2-line event summary, calculates quote, tags priority (`High-Value`, `Medium`, `Standard`), and commits the lead to the database.

### 📊 Phase 4: Admin Dashboard & WhatsApp Automation (The Closer)
- **Stats Row (Metric Cards)**:
  1. **Total Inquiries**: Total lead volume.
  2. **Premium Weddings Booked**: High-Value lead count.
  3. **Quote Pipeline Value**: Sum of quotes for all 'New' and 'Contacted' leads.
- **Interactive Lead Table**: Color-coded badges (🔴 Red for High-Value, 🟡 Yellow for Medium, 🔵 Blue for Standard), filters, and search.
- **Slide-out Lead Details Drawer**: Complete lead dossier, 2-line AI summary, and the **Ready-to-Copy WhatsApp Pitch** in warm Indian English with 1-click clipboard copy (`Copied! ✅` toast) and direct WhatsApp Web launcher.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build
```

- **Customer View**: Browse packages and launch SnapBot via bottom-right FAB or package buttons.
- **Admin Portal**: Click "Admin Portal" on the top navigation bar.
  - **Username**: `admin`
  - **Password**: `admin` (or click "Use Hackathon Demo Credentials")

