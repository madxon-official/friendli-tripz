# Friendli Tripz — Admin Setup & Supabase Migration Guide

This document outlines the step-by-step procedure for initializing the Supabase database schema, creating the first admin user, and configuring environment variables for Vercel deployment.

---

## 1. Supabase Database Migration

1. Log into your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor** from the left navigation.
3. Click **New Query** and paste the entire contents of [`supabase/migrations/20260726000000_phase4_schema.sql`](file:///c:/Viegz/Friendli/supabase/migrations/20260726000000_phase4_schema.sql).
4. Click **Run** to create the following tables, triggers, RLS policies, and RPC functions:
   - `admin_profiles`
   - `enquiries`
   - `enquiry_notes`
   - `enquiry_status_history`
   - `handle_updated_at()` trigger
   - `is_active_admin()` RLS helper function
   - `update_enquiry_status()` RPC procedure

---

## 2. Initial Admin Creation (Bootstrap Procedure)

Since there is **no public signup** on `/admin/login`, initial admin accounts are invited/created deliberately via Supabase Auth:

### Step 2.1 — Create Auth User
1. In Supabase Dashboard, go to **Authentication** → **Users**.
2. Click **Add User** → **Create User**.
3. Enter the initial admin's email address and password.
4. Copy the generated User **UUID** (e.g. `a1b2c3d4-e5f6-7890-abcd-1234567890ab`).

### Step 2.2 — Insert Admin Profile Record
1. Open **SQL Editor** in Supabase and execute:
```sql
INSERT INTO public.admin_profiles (id, full_name, role, is_active)
VALUES (
  'YOUR_USER_UUID_HERE',
  'Chandru Owner',
  'owner',
  true
);
```
*(Replace `YOUR_USER_UUID_HERE` with the actual UUID copied from Step 2.1)*.

---

## 3. Environment Variables (Vercel & Local)

Add these variables to `.env.local` (local) and Vercel Project Settings (Production):

| Variable Name | Description | Scope |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Friendli support phone number e.g. `917603967190` | Public |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL e.g. `https://xxx.supabase.co` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Client Anon Key | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret Key | **Server-Only Secret** |

> [!CAUTION]
> `SUPABASE_SERVICE_ROLE_KEY` must **NEVER** be prefixed with `NEXT_PUBLIC_` or exposed to client-side code bundles.

---

## 4. Production Subdomain Setup (`admin.friendlitripz.com`)

1. In Vercel Project Settings → **Domains**, add `admin.friendlitripz.com`.
2. Set DNS CNAME record for `admin` pointing to `cname.vercel-dns.com`.
3. The included `middleware.ts` will recognize requests coming from `admin.friendlitripz.com` and automatically serve/protect the internal admin routes.
