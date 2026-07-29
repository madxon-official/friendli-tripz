# Friendli Tripz — Domain Architecture Constitution
## Permanent Engineering & Systems Architecture Principles (Sprint 0 Constitution)

> **Status**: RATIFIED CONSTITUTIONAL LAW  
> **Scope**: Universal (Applies to Destinations, Attractions, Activities, Hotels, Restaurants, Transport, Packages, Departures, Bookings, AI, Vendors, and Reviews)

---

## The 10 Permanent Architectural Rules

### Rule 1: Single Source of Truth
> **Every real-world entity exists exactly once in the system. Everything else references it.**  
Never duplicate entity names, descriptions, addresses, or metadata across tables. A Point of Interest, Hotel, Activity, or Transport provider is defined once in its domain catalog table. Packages, Itineraries, and Bookings store normalized foreign key references.

### Rule 2: Operational vs Commercial vs Financial Tri-Layer Separation
> **Operational data is live. Commercial data is versioned & locked. Financial data is immutable.**
- **Operational Layer** (Live): Catalogs (`destinations`, `attractions`, `activities`, `hotels`) reflect live real-world state, media, descriptions, and operating schedules.
- **Commercial Layer** (Versioned & Locked): Packages and Offerings store explicit commercial contract prices and duration overrides. Master catalog price changes trigger `price_drift_detected` flags without breaking package margins.
- **Financial Layer** (Immutable): Confirmed Bookings freeze an immutable `booking_snapshot` contract. Historical financial receipts can never be altered by catalog updates.

### Rule 3: AI Intelligence Separation
> **LLMs interpret intent. Deterministic engines execute business logic.**  
Large Language Models (LLMs) are restricted to extracting structured traveller intent, preferences, and constraints from natural language prompts. Itinerary construction, pricing calculations, route optimization (TSP), operational availability checks, and capacity constraints are strictly executed by deterministic database queries and algorithmic graph solvers.

### Rule 4: Digital Asset Management (DAM) Rule
> **No domain entity table stores raw image or video URLs. All media flows through the DAM.**  
Domain entities (`destinations`, `attractions`, `activities`, `packages`, `hotels`) NEVER contain direct image URL columns. Images/videos are uploaded once to `media_assets`, processed into WebP/AVIF `media_variants` asynchronously, and attached to domain entities via the generic `entity_media` junction table.

### Rule 5: Enterprise Localization & Internationalization Rule
> **Core domain entities remain language-neutral. Presentation is localized after planning.**  
Core entity IDs, coordinates, prices, and status enums are language-agnostic. All human-readable text (names, taglines, descriptions, guides) is stored in the `entity_translations` registry. Travel route planning and search operations run on language-neutral IDs; localization is applied deterministically at the API/presentation layer with a strict fallback chain (`Requested Locale` ➔ `en-IN` ➔ `Internal Primary`).

### Rule 6: Canonical Content Graph & SEO Rule
> **Every real-world entity has exactly ONE primary canonical URL. Discovery hubs never duplicate canonical content.**  
Attractions derive canonical URLs under their parent destination (`/destinations/[dest]/attractions/[slug]`). Master Activities use standalone canonical URLs (`/activities/[slug]`). Discovery feeds, category lists, search results, and editorial collections link to the canonical URL without duplicating content pages. Slug modifications automatically generate `301 Permanent Redirect` entries in slug history registries.

### Rule 7: Progressive Offline Authority Rule
> **Information may be offline. Financial & inventory authority remains strictly online.**  
Confirmed trip itineraries, attraction details, emergency contacts, and cryptographically signed QR vouchers (HMAC-SHA256) are packaged into an encrypted Offline Trip Vault for traveller convenience. Payments, new inventory allocations, cancellations, and price adjustments remain strictly online-only. Offline traveller actions (notes, reviews, photo uploads) are stored in a local sync queue and reconciled upon reconnection.

### Rule 8: Universal Extensibility Rule
> **Every architectural primitive must support future modules (Hotels, Restaurants, Transport, Events, Guides, Vendors) without schema redesign.**  
Junction tables, operational calendar engines, media asset relations, translation registries, and booking snapshot structures must use generic `entity_type` and `entity_id` patterns so that future modules adopt existing platform capabilities seamlessly.

### Rule 9: Strict RBAC & Audit Governance Rule
> **No state-mutating operation occurs without authorization enforcement and audit field capture.**  
All server actions and API endpoints enforce granular RBAC permissions (`entity.create`, `entity.update`, `entity.delete`, `entity.publish`). All domain tables track `created_at`, `updated_at`, `created_by`, and `updated_by`.

### Rule 10: Zero Superficial Degradation Rule
> **Never swallow errors, return dummy fallbacks, or delete assertions to pass builds.**  
Errors are acknowledged, traced to empirical root causes, logged cleanly, and reported transparently to users with contextual feedback.

---

## System Layering Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION & CLIENT LAYER                        │
│         (Next.js App Router, Public Web, Admin Dashboard, PWA Vault)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    API & SERVER ACTIONS / REPOSITORY LAYER                   │
│        (Zod Validation, RBAC Enforcement, Fallback Localization Filter)     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                   DETERMINISTIC BUSINESS LOGIC & AI SOLVER                  │
│       (TSP Route Optimizer, Operational Calendar Engine, DAM Transcoder)    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                        SUPABASE / POSTGRESQL DATA LAYER                     │
│    (Operational Catalogs, Commercial Templates, Immutable Booking Snapshots) │
└─────────────────────────────────────────────────────────────────────────────┘
```
