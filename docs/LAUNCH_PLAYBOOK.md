# FRIENDLI TRIPZ — MASTER LAUNCH PLAYBOOK & OPERATIONS MANUAL
## COMPANY OPERATIONAL HANDBOOK & DAY-1 STANDARD OPERATING PROCEDURES (SOP)
### VERSION 1.0

> **Ratified**: July 31, 2026  
> **Status**: ACTIVE OPERATIONAL LAW  
> **Scope**: Universal (Founders, Executive Leadership, Sales, Operations, Customer Success, Finance, Marketing, Drivers, Hotel Partners, Activity Vendors, and Tour Captains)

---

## TABLE OF CONTENTS
1. [Company Operating Model](#1-company-operating-model)
2. [Team Structure & Organization](#2-team-structure--organization)
3. [Daily Operations Routine](#3-daily-operations-routine)
4. [Sales Standard Operating Procedure (SOP)](#4-sales-standard-operating-procedure-sop)
5. [Booking Standard Operating Procedure (SOP)](#5-booking-standard-operating-procedure-sop)
6. [Operations & Ground Execution SOP](#6-operations--ground-execution-sop)
7. [Customer Communication Templates](#7-customer-communication-templates)
8. [WhatsApp Operations Playbook](#8-whatsapp-operations-playbook)
9. [Customer Support & Incident Handling SOP](#9-customer-support--incident-handling-sop)
10. [Finance & Ledger Accounting SOP](#10-finance--ledger-accounting-sop)
11. [Marketing Execution Playbook](#11-marketing-execution-playbook)
12. [Quality Standards & SLAs](#12-quality-standards--slas)
13. [Emergency Response Playbook](#13-emergency-response-playbook)
14. [KPIs & Operational Dashboards](#14-kpis--operational-dashboards)
15. [First 100 Travellers Acquisition Plan](#15-first-100-travellers-acquisition-plan)
16. [30-60-90 Day Execution Plan](#16-30-60-90-day-execution-plan)
17. [Soft Launch & Pilot Testing Plan](#17-soft-launch--pilot-testing-plan)
18. [Go-Live Day Master Checklist](#18-go-live-day-master-checklist)
19. [Final Appendix](#final-appendix)

---

## 1. COMPANY OPERATING MODEL

### Business Model
Friendli Tripz operates a hybrid model:
1. **Direct-to-Consumer (D2C) Social Travel Brand ("Travel. Vibe. Repeat.")**: Curated small-group weekend escapes sold directly to travellers via the public web (`friendlitripz.com`).
2. **Managed Logistics Engine**: End-to-end ground logistics orchestration (private vehicles, vetted stays, local activity vouchers, and Tour Captains) powered by our multi-portal infrastructure.

### Revenue Model
- **Package Margins**: 22% to 32% gross margin per booked traveller on standard group departures.
- **Custom Group Surcharges**: 25% to 35% gross margin on tailored corporate, college, and private group itineraries created via `/customize`.
- **Add-on Experiences**: Commission margins (15%-25%) on optional high-value activities (e.g. zip-lining, boating, campfire barbecue, photo passes).

### Target Customers
- **Primary**: Young working professionals (Ages 21-32) in Chennai, Bangalore, and Coimbatore seeking weekend getaways.
- **Secondary**: Small friend groups, college graduation trips, and corporate tech team retreats.

### Target Destinations (Phase 1 Launch)
- **Primary Chapter**: Kodaikanal, Tamil Nadu ("Misty Kodaikanal Escape").
- **Phase 2 Expansion**: Ooty & Coonoor, Tamil Nadu.
- **Phase 3 Expansion**: Munnar & Wayanad, Kerala; Coorg & Chikmagalur, Karnataka.

### Trip Categories
- **Social Cohort Trips**: Fixed-date weekend departures (Fri-Sun) for solo travellers and small pairs (8-14 guests per group).
- **Private Custom Escapes**: On-demand departure dates tailored for private friend groups or couples.
- **Corporate & Team Retreats**: Curated 10-25 person team bonding trips with dedicated GST invoicing.

---

## 2. TEAM STRUCTURE & ORGANIZATION

```
                                  FOUNDER & CEO
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │                               │                               │
   CHIEF OPERATING OFFICER         HEAD OF SALES             MARKETING DIRECTOR
  (Ground Ops & Logistics)     (Leads & Conversions)       (Growth & Brand)
        │                               │                               │
  ┌─────┴─────────────┐          ┌──────┴──────────────┐         ┌──────┴──────────────┐
  │                   │          │                     │         │                     │
Ops Manager     Field Captains Sales Execs     Support Lead Content Specialist Growth Exec
(Dispatch)     (Tour Leaders)  (Quotes & CRM)   (WhatsApp) (Social/Blogs)  (Ads/Partnerships)
  │
  ├─ Assigned Drivers (Partner Fleet)
  ├─ Hotel Front-Desk Partners
  └─ Activity Vendors
```

### Roles, Responsibilities & KPIs

| Role | Key Responsibilities | Primary KPIs | Direct Reports |
| :--- | :--- | :--- | :--- |
| **Founder & CEO** | Strategic vision, investor relations, culture, brand integrity. | Company ARR, Net Margin, NPS (>90). | COO, Head of Sales, Marketing Dir. |
| **Chief Operating Officer (COO)** | Ground logistics, driver/hotel onboarding, safety, vendor SLA compliance. | On-time departure %, 0% hotel allocation errors. | Ops Manager, Tour Leaders. |
| **Head of Sales** | Lead conversion, quote accuracy, enquiry pipeline velocity, group bookings. | Lead-to-Booking conversion rate (>15%), Lead response time (<5 mins). | Sales Executives. |
| **Operations Manager** | Daily driver dispatch (`/admin/operations`), hotel confirmation sync, fleet tracking. | Fleet utilization %, Driver duty check-in rate (100%). | Drivers, Hotel Partners. |
| **Tour Captain (Leader)** | On-trip guest coordination, daily headcount, incident logging (`/tour-leader`). | Guest trip satisfaction rating (>4.8/5.0), 0 safety incidents. | None (Field leadership). |
| **Customer Support Lead** | 24/7 traveller assistance, complaint resolution, post-trip review collection. | First response time (<2 mins), Ticket resolution time (<1 hr). | Support Executives. |
| **Finance Manager** | Daily Razorpay reconciliation (`/admin/finance`), driver/vendor settlements, ledger audit. | Unreconciled balance = ₹0, Settlement accuracy (100%). | Accounting staff. |

---

## 3. DAILY OPERATIONS ROUTINE

Every working day at Friendli Tripz follows a disciplined operational schedule:

### Morning Routine (08:00 AM – 10:00 AM)
1. **08:00 AM — Departure & Arrival Audit**:
   - Open `/admin/arrivals` and `/admin/departures`.
   - Verify all today's departing vehicles have initialized GPS tracking via `/driver`.
   - Confirm driver duty check-ins for morning pickups.
2. **08:30 AM — Hotel Arrival Pre-Check**:
   - Verify hotel room allocation confirmations on `/hotel-portal` for today's check-ins.
3. **09:00 AM — Lead Pipeline Review**:
   - Open `/admin/enquiries`. Review overnight web and customizer leads.
   - Assign unassigned leads to Sales Executives (Target SLA: <5 minutes).
4. **09:30 AM — WhatsApp Support Queue**:
   - Clear all overnight WhatsApp customer messages; send morning trip reminders to active travellers.

### Afternoon Routine (12:00 PM – 03:00 PM)
1. **12:00 PM — Mid-Day Logistics Sync**:
   - Check live driver pings on `/driver` and active trip map.
   - Verify hotel check-in status updates from hotel front desks.
2. **01:00 PM — Financial Reconciliation**:
   - Open `/admin/finance`. Match morning Razorpay webhook receipts with database booking snapshots.
   - Verify zero discrepancy in `financial_ledger_entries`.
3. **02:30 PM — Tomorrow's Dispatch Preparation**:
   - Open `/admin/operations`. Assign drivers and vehicles for tomorrow's departing trips.
   - Issue digital hotel confirmation vouchers to hotel partners.

### Evening Routine (05:00 PM – 07:00 PM)
1. **05:00 PM — Sales Pipeline Closing**:
   - Follow up on open quotations sent earlier in the day.
   - Send payment links for finalized itineraries.
2. **06:00 PM — Incident & Feedback Audit**:
   - Review Tour Captain incident logs on `/tour-leader`.
   - Trigger automated review requests to travellers who completed trips today.
3. **06:30 PM — Day-End Briefing**:
   - Executive team reviews daily KPIs (New Leads, Bookings, Revenue, Active Trips).

---

## 4. SALES STANDARD OPERATING PROCEDURE (SOP)

### SLA Mandate
**Every lead submitted via web, customizer, or WhatsApp MUST be contacted within 5 minutes.**

### Step-by-Step Sales Workflow
```
1. Lead Submission ➔ 2. Instant WhatsApp Ping (Automated) ➔ 3. Qualification Call (<5 mins)
                                                                     │
6. Payment Link Sent ◄── 5. Customized Quote Sent ◄── 4. Requirement Capture ◄┘
       │
       ▼
7. Booking Confirmed (Automated Receipt)
```

### Lead Qualification Script (Call / WhatsApp)
- **Greeting**: "Hi [Name]! This is [Agent Name] from Friendli Tripz. I saw your request for the Kodaikanal escape on [Date]!"
- **Key Questions**:
  1. "How many travellers are in your group?"
  2. "Are you looking for a shared social cohort or a private vehicle/stay?"
  3. "Do you have preference for boutique stays or budget hill bungalows?"
  4. "Are there any special celebrations (birthdays, anniversaries)?"
- **Action**: Input captured responses directly into `/admin/enquiries/[id]` notes.

---

## 5. BOOKING STANDARD OPERATING PROCEDURE (SOP)

1. **Quotation Generation**: Sales Executive builds finalized itinerary and pricing breakdown on `/admin/enquiries/[id]`.
2. **Payment Link Dispatch**: Agent clicks "Generate Payment Link" (Razorpay). Send link via WhatsApp and Email.
3. **Payment Receipt & Locking**:
   - Upon successful payment, Razorpay webhook fires `/api/v1/bookings`.
   - System freezes immutable `booking_snapshot` and creates entry in `financial_ledger_entries`.
   - Traveller receives instant SMS/WhatsApp confirmation with reference ID (e.g. `FT-KOD-8841`).
4. **Operations Handover**: Lead status automatically updates to `converted`; booking appears on `/admin/bookings` for logistics allocation.

---

## 6. OPERATIONS & GROUND EXECUTION SOP

### 1. Driver Onboarding & Dispatch Procedure
- **Assignment**: 24 hours prior to departure, Ops Manager assigns driver ID and vehicle ID on `/admin/operations`.
- **Driver Verification**:
  - Valid commercial driving license.
  - Vehicle Fitness Certificate (FC) and commercial insurance up to date.
  - Vehicle clean, air conditioning/heating functional, emergency first-aid kit stocked.
- **Duty Activation**: Driver receives SMS with single-use login link for `/driver`. Driver clicks "Start Duty" at least 30 minutes before first pickup.

### 2. Hotel Confirmation Procedure
- **Voucher Issuance**: Ops Manager transmits guest manifest (Names, Contact, Room Type, Meal Plan) to hotel front desk via `/hotel-portal`.
- **Pre-Check Confirmation**: Hotel manager acknowledges room allocation 12 hours prior to guest arrival.

### 3. Activity Voucher Procedure
- **QR Pass Generation**: System generates HMAC-SHA256 cryptographically signed QR vouchers for inclusions (boating, zip-lining, park entry).
- **Redemption**: Vendors scan voucher on `/vendor-portal` at activity point.

---

## 7. CUSTOMER COMMUNICATION TEMPLATES

### Template 1: Instant WhatsApp Welcome (Lead Submission)
> "Hey [First Name]! 👋 Thanks for reaching out to Friendli Tripz! I'm [Agent Name], your personal travel consultant. I've received your request for the **Misty Kodaikanal Escape** ([Dates], [Guests] Guests). 🌲✨  
> I'm putting together your custom itinerary options right now. Are you available for a quick 2-minute chat?"

### Template 2: Booking Confirmation Notice
> "WOOHOO! 🎉 Your trip to Kodaikanal is CONFIRMED!  
> **Booking ID**: [Booking Reference ID]  
> **Dates**: [Start Date] – [End Date]  
> **Stay**: [Hotel Name]  
> 📲 **View Your Live Itinerary & Offline Pass**: https://friendlitripz.com/trip/[Booking ID]  
> We can't wait to host you!"

### Template 3: 24-Hour Pre-Trip Reminder & Driver Info
> "Get excited! Your trip starts tomorrow! 🚗💨  
> **Your Pickup Time**: [Time]  
> **Your Vehicle**: [Vehicle Model & Number]  
> **Your Driver**: [Driver Name] ([Driver Phone Number])  
> 💡 *Pro Tip*: Save your offline pass on your phone before heading up the hills: https://friendlitripz.com/trip/[Booking ID]"

### Template 4: Post-Trip Review Request
> "Welcome back, [First Name]! 🏔️ We hope you had an unforgettable time in Kodaikanal!  
> Could you spare 60 seconds to share your experience? Your review helps fellow travellers find authentic escapes:  
> ⭐ **Leave a Review**: https://friendlitripz.com/reviews  
> As a thank you, we've added **500 Friendli Loyalty Points** to your account!"

---

## 8. WHATSAPP OPERATIONS PLAYBOOK

- **Primary Business Number**: Registered official WhatsApp Business API (`NEXT_PUBLIC_WHATSAPP_NUMBER`).
- **Response SLAs**:
  - New Enquiries: <5 minutes.
  - Active On-Trip Travellers: <2 minutes (Priority 1).
  - General Support Questions: <15 minutes.
- **Broadcast Guidelines**: Maximum 1 promotional broadcast per month to opted-in lead lists; strictly zero spam.

---

## 9. CUSTOMER SUPPORT & INCIDENT HANDLING SOP

### Tiered Escalation Matrix
- **Level 1 (Support Executive)**: Route questions, general itinerary inquiries, minor stay preferences.
- **Level 2 (Operations Manager)**: Driver delay (>15 mins), hotel room change request, activity schedule modification.
- **Level 3 (COO / Founder)**: Vehicle breakdown, medical emergency, hotel refusal, severe weather disruption.

### Handling Procedures

#### 1. Driver Delay / Missed Pickup
- **Action**: Support agent checks `/driver` live GPS ping.
- **Resolution**: If driver is delayed >20 mins due to traffic, dispatch backup driver or compensate guest with complimentary meal/beverage credit.

#### 2. Hotel Room Issue
- **Action**: Support agent contacts hotel manager directly via `/hotel-portal`.
- **Resolution**: If assigned room does not match booking snapshot, upgrade guest immediately to next higher room category at company cost.

---

## 10. FINANCE & LEDGER ACCOUNTING SOP

### Daily Financial Reconciliation Workflow
```
1. Download Razorpay Settlement Report ➔ 2. Open /admin/finance Dashboard
                                                 │
4. Log Ledger Verification Record ◄── 3. Match Webhook ID & Booking Snapshot ID
```

- **Rule**: Every payment must write a non-deletable record to `financial_ledger_entries`.
- **Vendor Settlements**: Paid every Monday for the preceding week's completed trips via direct bank transfer.
- **Driver Settlements**: Fuel allowance paid 50% prior to departure; balance 50% settled upon duty completion confirmation on `/driver`.

---

## 11. MARKETING EXECUTION PLAYBOOK

### Instagram Strategy (@friendlitripz)
- **Pillars**: 40% Scenic Reels (Kodaikanal mist, hill roads), 30% Traveller Testimonials/Photos, 20% Itinerary Teasers, 10% Local Food & Secret Spots.
- **Cadence**: 1 Reel per day, 3 Stories per day.

### College & Campus Ambassador Program
- Recruit 2 ambassadors per major college in Chennai & Bangalore (SRM, VIT, Loyola, Christ, Jain).
- Offer free trip slot for every 10 booked college group seats.

---

## 12. QUALITY STANDARDS & SLAS

| Quality Metric | SLA Target | Enforcement Action if Breached |
| :--- | :--- | :--- |
| **New Lead Response Time** | <5 Minutes | Automated alert to Head of Sales |
| **Driver Pickup Punctuality** | ±5 Minutes of scheduled time | Driver penalty / Backup dispatch |
| **Hotel Cleanliness & Hygiene** | 100% compliance with audit list | Immediate partner suspension |
| **Net Promoter Score (NPS)** | >90 | Mandatory root-cause investigation |
| **Google/Web Review Average** | >4.8 / 5.0 Stars | Weekly service review meeting |

---

## 13. EMERGENCY RESPONSE PLAYBOOK

### 1. Vehicle Breakdown Emergency
1. Driver pings emergency button on `/driver`. Ops Manager receives instant alert.
2. Ops Manager dispatches backup fleet vehicle from nearest local partner hub (Max wait time: 45 mins).
3. Tour Captain provides complimentary refreshments and keeps travellers comfortable.

### 2. Medical Emergency
1. Tour Captain/Driver immediately contacts local medical facility (Kodaikanal Government Hospital / Van Allen Hospital).
2. Contact Support Lead to notify family/emergency contact listed on booking snapshot.
3. Operations Manager coordinates local hospital admission and transport.

### 3. Severe Weather Disruption (Landslides / Heavy Rain)
1. Ops Manager checks official district collector updates and road advisories.
2. If route is unsafe, trigger alternate safe itinerary route or extend stay at pre-agreed safety rate.

---

## 14. KPIS & OPERATIONAL DASHBOARDS

### Executive Daily Metrics Dashboard (`/admin/analytics`)
- **Total New Enquiries Today**
- **Lead-to-Quote Conversion Rate (%)**
- **Gross Revenue Today (₹)**
- **Active On-Trip Travellers Count**
- **Unassigned Vehicles Alert Count**

---

## 15. FIRST 100 TRAVELLERS ACQUISITION PLAN

```
Phase 1: Founder & Network Outreach (Travellers 1 - 20)
• Host 2 pilot weekend trips for friend groups, tech colleagues, and creators at cost price.
• Capture high-definition video testimonials and unscripted reaction reels.

Phase 2: Targeted Instagram & Campus Growth (Travellers 21 - 60)
• Launch targeted Instagram Ads in Chennai & Bangalore targeting "Weekend Getaways".
• Activate 5 College Campus Ambassadors with exclusive student group discount codes.

Phase 3: Referral & Corporate Tech Outreach (Travellers 61 - 100)
• Launch "Refer a Friend, Get ₹500 Each" campaign on `/loyalty`.
• Target IT startup team leads for Friday-Sunday team bonding escapes.
```

---

## 16. 30-60-90 DAY EXECUTION PLAN

### First 30 Days (Foundation & Soft Launch)
- Complete 5 pilot weekend trips to Kodaikanal (50 travellers).
- Achieve 100% operational reliability on driver dispatch and hotel check-in.
- Maintain average Google/Web review rating of 4.9/5.0.

### First 60 Days (Regional Growth)
- Scale Kodaikanal departures to 4 groups per weekend (100 travellers/month).
- Onboard 10 new vetted boutique stay partners in Kodaikanal.
- Launch Ooty chapter preparation and route mapping.

### First 90 Days (Multi-Destination Expansion)
- Officially launch Ooty & Coonoor chapter.
- Reach ₹25,000,000 monthly gross booking value.
- Onboard dedicated operations leads for Tamil Nadu hill station chapters.

---

## 17. SOFT LAUNCH & PILOT TESTING PLAN

- **Pilot Size**: 5 weekend departures (10 travellers per departure = 50 total pilot guests).
- **Pricing**: Special soft launch trial fare (₹4,999/person all-inclusive).
- **Success Criteria**:
  - 0 missed pickups or transport delays.
  - 0 hotel room allocation errors.
  - >90% survey response rate with >4.8 overall rating.

---

## 18. GO-LIVE DAY MASTER CHECKLIST

### Pre-Launch Night (T-12 Hours)
- [x] Verify production site live at `friendlitripz.com`.
- [x] Test live Razorpay webhook payment flow end-to-end with ₹1 test transaction.
- [x] Verify admin login accessible at `/admin/login` for all team profiles.
- [x] Confirm WhatsApp Business API connectivity and test message delivery.
- [x] Confirm driver login links working on `/driver`.

### Launch Day Morning (T-0 Hours)
- [x] Head of Sales reviews `/admin/enquiries` live queue.
- [x] Marketing Lead launches Instagram announcement post and Google Search campaigns.
- [x] Operations Lead verifies vehicle readiness with pilot fleet drivers.
- [x] Support Lead monitors live WhatsApp queue for incoming queries.

---

## FINAL APPENDIX

### 1. Daily Operations Checklist Printout
- [ ] 08:00 AM — Check `/admin/arrivals` & `/admin/departures`.
- [ ] 08:30 AM — Verify driver GPS duty pings on `/driver`.
- [ ] 09:00 AM — Assign new enquiries on `/admin/enquiries`.
- [ ] 01:00 PM — Reconcile Razorpay transactions on `/admin/finance`.
- [ ] 03:00 PM — Allocate tomorrow's fleet & hotels on `/admin/operations`.
- [ ] 06:00 PM — Review customer feedback & trigger review requests.

### 2. Department Escalation Directory
- **Emergency Hotline**: +91 7603967190 (24/7 Operations Desk)
- **Operations Manager Direct**: +91 9840012345
- **Head of Sales Direct**: +91 9840054321
- **Kodaikanal Hospital Emergency**: +91 4542 241234

---

> **FRIENDLI TRIPZ — MASTER LAUNCH PLAYBOOK**  
> *Operations Manual v1.0 · Ready for Day-1 Production Launch*  
> End of Launch Playbook
