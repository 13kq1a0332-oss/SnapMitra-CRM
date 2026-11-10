# 🎯 SnapMitra CRM — Enhancements & Test Plan

This document details all recently implemented features, testing scenarios executed, and step-by-step verification instructions for the live website at **[https://snap-mitra-crm.vercel.app/](https://snap-mitra-crm.vercel.app/)**.

---

## 🚀 Summary of Implemented Features

### 1. Dual-Mode Chatbot Contact Collection (Email ID & Phone Number)
* **Problem Solved**: Previously, if a user provided an email address (e.g. `srikanthmallavarapu2@gmail.com`), the bot prepended `+91 ` (`+91 srikanthmallavarapu2@gmail.com`).
* **Implementation**:
  - Chatbot now explicitly prompts: *"Could you please share your WhatsApp / phone number or email ID so we can share package portfolios?"*
  - Automatically detects whether the input is an email address (containing `@`) or an Indian mobile phone number.
  - Emails are cleanly stored in `client_email` and displayed without any `+91 ` prefix.
  - Phones are normalized to standard Indian format (`+91 98490 XXXXX`).

### 2. Studio Director Immediate Contact Header & Hotline
* **Direct WhatsApp Helpline**: `8497980957` (Clicking it directly opens `https://wa.me/918497980957` with a prefilled inquiry message).
* **Direct Email Contact**: `Srikanthmallavarapu14@gmail.com` (Clicking it opens the default email client with a pre-filled subject line).
* **Placement**: Top announcement bar across the site and in the customer landing page.

### 3. Automated Slides-Wise Background Carousel (6 Unsplash Luxury URLs)
* **Aesthetic**: Dimmed obsidian black linear gradient overlay with 6 high-resolution luxury wedding photography URLs:
  1. *The Nizam Royal Union* (Moody candlelight & gold highlights)
  2. *Traditional Wedding Portfolio* (Jewelry, mandap & warm heritage tones)
  3. *Candid Cinematography* (Golden hour sunset motion)
  4. *Pre-Wedding Outdoor Shoots* (Mist-draped nature portraiture)
  5. *Corporate & High-Society Events* (Champagne celebration)
  6. *Equipment & Behind-The-Scenes* (Sony Cinema Line cameras & lenses)
* **Controls**: Auto-advances every 5.5 seconds with smooth cross-fade, plus previous/next buttons and clickable slide progress indicators.

### 4. Clean Admin Dashboard Table & Lead Drawer
* Displays phone numbers and email addresses with distinct icons (`Phone` vs `Mail`).
* Allows studio admins to both WhatsApp and Email the client directly from the lead drawer.

### 5. Formal Studio PDF Quotation Generator
* Generates an official, printable letterhead estimate with itemized deliverables, payment milestones (40% hold, 50% shoot day, 10% delivery), and director signature.

### 6. "Other" Event Custom Name Flow (SnapBot Conversational Fix)
* **Problem Solved**: When a client selected "Other" as their event type, SnapBot previously skipped asking for the specific event name and awkwardly said: *"Splendid! A Other celebration. When is your planned event date?"*.
* **Implementation**:
  - When "Other" is selected, SnapBot warmly asks: *"Wonderful! PixelStory Studios crafts bespoke cinematography for all special milestones. 🌟 Could you please tell me what kind of event you're celebrating? (e.g. Housewarming, Half-Saree, Baby Shower, Anniversary, Fashion Shoot)"*.
  - Provides quick suggestion chips for popular Indian celebrations:
    - *Half-Saree Ceremony*
    - *Housewarming (Gruhapravesam)*
    - *Baby Shower (Seemantham)*
    - *Silver / Gold Anniversary*
    - *Fashion & Portfolio Shoot*
    - *Engagement / Ring Ceremony*
  - Automatically handles grammatical English articles (*"A Half-Saree Ceremony celebration"* vs *"An Anniversary celebration"*).
  - Preserves the custom celebration name in `custom_event_name`, `chat_summary`, `notes`, Admin Dashboard table, Lead Drawer, WhatsApp follow-ups, and PDF quotation.

### 7. Combined Contact Extraction (Simultaneous Email + Phone in One Message)
* **Problem Solved**: When a customer typed both email and phone in a single message (e.g. `Vijaykumar12@gmail.com and 8899920110`), earlier versions captured the entire combined string into the email field and lost the phone number.
* **Implementation**:
  - Advanced regex parser extracts the email address (`[^\s@]+@[^\s@]+\.[^\s@]+`) AND independently isolates the 10-12 digit phone number.
  - Automatically populates `client_email` with `Vijaykumar12@gmail.com` and `client_phone` with `+91 88999 20110`.

### 8. Interactive AI Wedding Vision & Package Matcher (Real-Time Allocator)
* Interactive 3-variable selector on the customer homepage:
  - **Celebration Setting**: Royal Palace (Taj Falaknuma) / 5-Star Ballroom (Novotel HICC) / Outdoor Lawn (Ananthagiri).
  - **Guest Attendance**: Intimate (~150-300) / Grand (~500-800) / Mega Royal (1000+).
  - **Creative Deliverable Priority**: 4K Cinema Drone Fleet / Regal Portraits & Heirloom Albums / Same-Day LED Projection.
* Real-time dynamic calculation of Recommended Tier, Pricing, Master Crew Count, Camera Optics (Sony FX6/FX3 G-Master), and Direct One-Click Booking in SnapBot.

### 9. Interactive Before & After Color Grading Studio Slider
* Demonstrates professional color grading craft directly on the web page:
  - **Left**: Raw Sony S-Log3 Cine-EI Flat Sensor Output (unprocessed low-contrast logarithmic camera image).
  - **Right**: PixelStory Signature Obsidian & Champagne Gold Master Color Grade.
  - Includes real-time draggable divider line and camera color space specs (10-bit 4:2:2 All-Intra, DaVinci Resolve Studio).

### 10. 4K Cinematic Showreel Video Player Modal
* Fullscreen luxury cinema player accessible via the *"Watch 2026 Showreel"* button in the hero section.
* High-definition video stream with play/mute controls, studio watermark, and direct booking CTA.

### 11. Prestigious Hyderabad 5-Star Venues Marquee & Real-Time Social Proof Ticker
* High-status venue badges: Taj Falaknuma Palace, Novotel HICC, Fort Grand Shamshabad, Ramoji Film City, ITC Kohenur, Golkonda Resorts.
* Real-time discreet social proof ticker in bottom-left displaying recent bookings and sneak peek deliveries across Hyderabad.

### 12. World-Class UI & Motion Architecture (21st.dev, ThreeUI, TasteSkill, GSAP)
* **ThreeUI & Ambient 3D Particle Canvas (`GoldenParticlesCanvas.tsx`)**:
  - Implements an ambient luxury 3D atmosphere with 55+ drifting golden bokeh embers floating upwards like palace candlelight.
  - Interactive cursor repulsion and inertial drift reacting to user mouse movements at silky 60fps.
* **21st.dev Spotlight & 3D Tilt Cards (`SpotlightCard.tsx`)**:
  - Cursor-following golden radial spotlight (`radial-gradient`) tracking mouse coordinates across the card surface.
  - 3D perspective tilt (`rotateX`, `rotateY`, `scale3d`) calculated from normalized distance to card center with specular lighting sheen.
  - Glowing gold border-beam on the featured Studio Masterpiece Platinum package card.
* **GSAP Magnetic Button Physics (`MagneticButton.tsx`)**:
  - Physics-based spring attraction pulling CTA buttons smoothly toward the user's cursor within their proximity.
  - Elastic recoil snapping back to origin with GSAP `elastic.out` easing when mouse exits.
* **GSAP Animated Numerical Counters (`AnimatedCounter.tsx`)**:
  - Viewport-triggered animated rolling number tickers for conversion statistics (`850+ Luxury Celebrations`, `4.9★ Google Reviews`, `15+ Stops Dynamic Range`).
* **Infinite Velocity-Scroll Venue Marquee (`InfiniteMarquee.tsx`)**:
  - Seamless continuous horizontal marquee ribbon showcasing Hyderabad's premier wedding destinations with edge fade gradients and pause-on-hover.
* **Celebration Confetti Cannon (`ConfettiTrigger.ts`)**:
  - Royal champagne gold and white diamond confetti explosion triggered on high-intent actions (e.g. "Chat with SnapBot AI", "Lock AI Package", "Check Availability & Get Quote").
* **Taste Skill Anti-Slop Design Polish**:
  - Editorial typographic hierarchy with Playfair Display serif paired with crisp micro-labels, obsidian glass depth, and hairline gold accents.

### 13. High-Converting Luxury Client Modules
* **Live Auspicious Telugu Muhurtham Slot Availability Checker**:
  - Real-time slot verification for auspicious dates (Nov 2026 – Feb 2027) with quick date buttons, capacity metrics (*"2 of 3 Studio Director Teams already reserved"*), and instant SnapBot date-lock CTA.
* **4K Cinematic Showreel Feature Bento Card**:
  - Full-width cinematic video showcase card with animated pulsing gold play button, resolution/color badges, and one-click launch for the 4K showreel modal.
* **Studio Production Standards & Gear Superpowers Bento Grid**:
  - 6-card high-impact Bento Grid highlighting Sony Cinema Line bodies (FX6/FX3), DGCA-licensed 8K/4K drone fleet, 48-hour sneak peek delivery, Milan handcrafted leather heirloom albums, 32-bit float audio engineering, and zero-delay contractual guarantee.
* **Grand Editorial Luxury Studio Footer**:
  - Comprehensive luxury footer with Jubilee Hills flagship studio address (Road No. 36), direct director WhatsApp and email lines, WedMeGood / WeddingSutra accolades, operating hours, and legal notices.

### 14. Intelligent Category-Specific Guardrail Responses & Seamless Conversation Bridge
* **Problem Solved**:
  - Previously, the chatbot returned the exact same generic canned reply (*"Our lead photographer will review your request and call back with a custom quote."*) for any outstation travel inquiry (e.g. Goa destination beach wedding) as well as any equipment modification inquiry (e.g. RED Komodo cinema cameras).
  - Furthermore, after giving the guardrail reply, the conversation froze without prompting the user for their name or date, leaving prospective clients stranded.
* **Implementation**:
  - **Context-Aware Luxury Responses**: Added `getDetailedGuardrailResponse()` in `src/services/guardrails.ts` that tailors answers across 4 distinct categories while strictly including the required review clause:
    1. **✈️ Outstation & Destination Weddings (Goa, Udaipur, Rajasthan, Vizag)**: Confirms nationwide travel capabilities, outlines transparent travel/stay logistics at actuals, and retains lead director review.
    2. **🎥 Camera & Rig Modifications (RED Komodo 6K, Arri Alexa, Cooke Anamorphic, Sony FX6/FX3)**: Details flagship Sony FX6/FX3 G-Master setup and cinema-grade workflow (focus pullers, DIT data management) for RED/Arri upgrades.
    3. **🗓️ Multi-Day Wedding Celebrations (Haldi, Mehendi, Sangeet, Muhurtham, Reception)**: Outlines dedicated senior crew teams and same-day LED wall teaser edits.
    4. **💎 Pricing & Discount Inquiries**: Explains transparent luxury pricing policy with value-add upgrade options (complimentary 4K drone or extra royal album) for upfront advances.
  - **Domain Badge Indicators**: Messages now render custom badges like `✈️ Destination Travel Policy • Lead Director Review` or `🎥 Custom Cinema Rig Policy • Technical Director Review` instead of a plain warning label.
  - **Conversational Bridge**: After answering the special inquiry, SnapBot automatically queues the next uncompleted step (e.g. *"To help Director Srikanth prepare your customized proposal, may I know your name first?"*) after 1.2s, so the booking flow continues seamlessly.
  - **Admin CRM Logging**: Special requests are tracked in `specialInquiries` and automatically populated into the lead's `notes` and `chat_summary` for studio admin follow-up.



---

## 🧪 Test Scenarios & Verification Matrix

| Test Scenario # | What is Tested | Test Steps | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Chatbot Email Detection | 1. Open SnapBot.<br>2. Enter name (e.g. `Sireesha`).<br>3. Enter email: `srikanthmallavarapu2@gmail.com`. | Bot proceeds to event type. In Admin Portal, the email is stored cleanly without `+91` prefix. | ✅ PASS |
| **TC-02** | Chatbot Phone Number Detection | 1. Open SnapBot.<br>2. Enter 10-digit number `8497980957`. | Bot formats as `+91 84979 80957` and stores in phone field. | ✅ PASS |
| **TC-03** | Studio Director WhatsApp Link | 1. Click `+91 8497980957` in the top header bar. | Browser opens `https://wa.me/918497980957?text=...` ready to message the studio director. | ✅ PASS |
| **TC-04** | Studio Director Email Link | 1. Click `Srikanthmallavarapu14@gmail.com` in top header bar. | Browser triggers `mailto:Srikanthmallavarapu14@gmail.com`. | ✅ PASS |
| **TC-05** | Slide-wise Background Carousel | 1. Open Customer View.<br>2. Observe hero background for 15 seconds.<br>3. Click previous/next arrows and dot indicators. | Images smoothly transition between the 6 luxury URLs with text remaining crisp and readable. | ✅ PASS |
| **TC-06** | Admin Dashboard Contact Formatting | 1. Go to Admin Portal (`admin/admin`).<br>2. Check `Sireesha` lead row. | Displays phone `+91 84979 80957` and email `srikanthmallavarapu2@gmail.com` with respective icons. | ✅ PASS |
| **TC-07** | Lead Drawer Dual Dispatch | 1. Click any lead in the table.<br>2. Check action buttons. | Both **"Launch WhatsApp"** and **"Send Email"** buttons appear if email is present. | ✅ PASS |
| **TC-08** | Formal PDF Quotation | 1. Click **"Official PDF Quote"** in Lead Drawer.<br>2. Click **"Print / Save as PDF"**. | Clean branded letterhead estimate opens in browser print preview. | ✅ PASS |
| **TC-09** | "Other" Event Custom Name Prompt & Chips | 1. Open SnapBot.<br>2. Enter name & contact.<br>3. Select **"Other"** from event chips. | Bot asks what kind of event you're celebrating and displays chips (Half-Saree, Housewarming, Baby Shower, Anniversary). After choosing, bot replies with proper article (*"Splendid! A Half-Saree Ceremony celebration"* or *"Splendid! An Anniversary celebration"*). | ✅ PASS |
| **TC-10** | Combined Email + Phone Parsing | 1. In SnapBot contact prompt, enter: `Vijaykumar12@gmail.com and 8899920110`. | Bot extracts both: phone becomes `+91 88999 20110` and email becomes `Vijaykumar12@gmail.com`. Both are visible in Admin Dashboard. | ✅ PASS |
| **TC-11** | Custom Event Name in Quotation & WhatsApp | 1. Select a lead with custom celebration (e.g. `Half-Saree Ceremony`).<br>2. Check WhatsApp pitch and PDF Quote. | WhatsApp message says *"Regarding your Half-Saree Ceremony..."* instead of *"Regarding your Other..."*. Official PDF quotation header says *"Half-Saree Ceremony Celebration"*. | ✅ PASS |
| **TC-12** | Interactive AI Package Matcher | 1. On homepage, scroll to "Design Your Dream Wedding Film Setup".<br>2. Select "Royal Palace", "Mega Royal", "4K Drone Cinema". | AI dynamically recalculates and recommends Platinum Luxury Masterpiece with exact crew breakdown and Sony FX6 optics. | ✅ PASS |
| **TC-13** | Before & After Color Grade Slider | 1. On homepage, scroll to "From Camera Sensor to Golden Masterpiece".<br>2. Drag the slider handle left and right. | Visually reveals flat raw Sony S-Log3 sensor output vs. warm signature champagne gold master grade. | ✅ PASS |
| **TC-14** | 4K Cinematic Showreel Modal | 1. Click "Watch 2026 Showreel" in hero banner. | High-definition cinema wedding showreel opens with audio toggle and direct SnapBot booking CTA. | ✅ PASS |
| **TC-15** | Live Social Proof Ticker | 1. Observe bottom-left corner of screen on desktop. | Real-time studio booking notification appears and cycles every 6.5s (can be dismissed or clicked). | ✅ PASS |
| **TC-16** | ThreeUI Golden Particles Canvas | 1. Open Customer View homepage.<br>2. Move cursor around the hero banner. | 55+ golden glowing embers drift upwards; embers near cursor gently swirl and repulse with fluid physics. | ✅ PASS |
| **TC-17** | 21st.dev Spotlight & 3D Tilt Cards | 1. Scroll to Signature Portfolio Offerings.<br>2. Hover cursor over the package cards. | Card tilts in 3D perspective following mouse coordinates; radial gold spotlight illuminates card interior and border; Platinum card radiates a glowing border beam. | ✅ PASS |
| **TC-18** | GSAP Magnetic Button Attraction | 1. Hover cursor near the "Chat with SnapBot AI" or "Watch 2026 Showreel" button.<br>2. Move cursor slightly outside button perimeter. | Button smoothly pulls towards cursor with spring physics, and elastically snaps back to position upon exit. | ✅ PASS |
| **TC-19** | GSAP Animated Numerical Counters | 1. Scroll into view of the hero trust badges.<br>2. Observe number counters. | Numbers animate smoothly from 0 to `850+` celebrations, `4.9★` reviews, and `15+` stops dynamic range. | ✅ PASS |
| **TC-20** | Infinite Marquee Venue Ribbon | 1. Scroll to Preferred Cinema Partner section.<br>2. Observe venue cards.<br>3. Hover cursor over any venue card. | Venue cards scroll horizontally in a seamless loop; hovering cursor pauses animation cleanly. | ✅ PASS |
| **TC-21** | Royal Gold Celebration Confetti | 1. Click "Chat with SnapBot AI" in hero, "Lock This AI Package", or the bottom-right floating button. | High-speed champagne gold and diamond confetti explodes across the screen with secondary cannon bursts. | ✅ PASS |
| **TC-22** | Live Muhurtham Slot Checker | 1. Scroll past venues marquee to "Verify Auspicious Muhurtham Slot Availability".<br>2. Click different date pills (e.g. Dec 14, 2026, Jan 18, 2027). | Status dynamically updates with slot availability and auspicious title. Clicking "Lock Date with SnapBot" opens SnapBot with pre-filled event date. | ✅ PASS |
| **TC-23** | 4K Cinematic Showreel Bento Card | 1. Scroll past AI Vision Matcher.<br>2. Observe the full-width showreel bento card with pulsing play button.<br>3. Click anywhere on card. | Fullscreen 4K cinema showreel modal launches smoothly. | ✅ PASS |
| **TC-24** | Studio Standards Bento Grid | 1. Scroll to "Engineered for Timeless Perfection".<br>2. Hover over the 6 capability cards (Sony FX6, Drone, 48h Teaser, Milan Albums, 32-bit Audio, Zero-delay Guarantee). | Cards tilt with 3D perspective and dynamic golden spotlights follow mouse position. | ✅ PASS |
| **TC-25** | Grand Editorial Luxury Footer | 1. Scroll to bottom of homepage.<br>2. Verify studio branding, Jubilee Hills address, direct phone/email links, operating hours, and industry accolades. | Fully styled luxury dark editorial footer is visible with clickable helplines and accolades. | ✅ PASS |
| **TC-26** | Intelligent Category-Specific Guardrail Responses | 1. Open SnapBot Concierge.<br>2. Ask about outstation travel: *"Can your team travel outside Hyderabad for our beach wedding in Goa?"*<br>3. Ask about camera upgrades: *"We want camera modifications with RED Komodo cinema cameras instead of standard ones."* | Each inquiry receives a specific, authoritative domain response (details Goa destination logistics for query 1, and RED Komodo/Sony FX6 cinema glass workflow for query 2) instead of identical generic text. Each response displays a category badge and seamlessly follows up asking for the client's name/contact. | ✅ PASS |

---

## 📝 How to Test the Entire Website (Round-Trip Test)

1. **Visit Production App**:
   👉 [https://snap-mitra-crm.vercel.app/](https://snap-mitra-crm.vercel.app/)
2. **Test Top Contact Bar**:
   - Verify phone `8497980957` and email `Srikanthmallavarapu14@gmail.com` are visible at the very top.
   - Click the WhatsApp link to verify it opens chat with `+91 8497980957`.
3. **Test Background Slides**:
   - Watch the background images transition between the 6 curated photography shots.
   - Click the slide counter pills (01 through 06) at the bottom of the hero banner.
4. **Test SnapBot Intelligent Guardrails & Unique Answers**:
   - Open SnapBot Concierge.
   - Click "Hackathon Guardrail Tester" or type *"Can your team travel outside Hyderabad for our beach wedding in Goa?"*.
   - Observe the tailored response for Goa destination wedding logistics with a dedicated policy badge.
   - Next, type *"We want camera modifications with RED Komodo cinema cameras instead of standard ones."*.
   - Observe the distinct response detailing RED Komodo, Sony FX6 Cinema Line, and Cooke anamorphic optics.
   - Notice how SnapBot does not freeze: it automatically prompts *"To help Director Srikanth prepare your customized proposal, may I know your name first?"*.
5. **Test SnapBot Lead Capture**:
   - Type your name.
   - When asked for WhatsApp or email, enter `srikanthmallavarapu2@gmail.com`.
   - Select event type (*Birthday*), pick a date, and select guest count (*100*).
   - Complete the quote flow.
6. **Verify in Admin Portal**:
   - Switch to **Admin Portal** using the top-right toggle (`admin` / `admin`).
   - Check the top row for your new lead: verify your email is shown with a mail icon, and NOT prefixed with `+91`.
   - Click the row to open the Lead Drawer.
   - Notice the special inquiries (Destination travel / Camera modifications) logged in the lead details and WhatsApp pitch.
   - Click **"Official PDF Quote"** to view and print the formal invoice.

