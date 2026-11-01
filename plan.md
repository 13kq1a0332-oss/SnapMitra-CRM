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
4. **Test SnapBot Lead Capture**:
   - Click the bottom-right floating button: **"Check Availability & Get Quote"**.
   - Type your name.
   - When asked for WhatsApp or email, enter `srikanthmallavarapu2@gmail.com`.
   - Select event type (*Birthday*), pick a date, and select guest count (*100*).
   - Complete the quote flow.
5. **Verify in Admin Portal**:
   - Switch to **Admin Portal** using the top-right toggle (`admin` / `admin`).
   - Check the top row for your new lead: verify your email is shown with a mail icon, and NOT prefixed with `+91`.
   - Click the row to open the Lead Drawer.
   - Click **"Official PDF Quote"** to view and print the formal invoice.
