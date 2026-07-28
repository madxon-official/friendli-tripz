# FRIENDLI TRIPZ — PHASE 5.3 ENTERPRISE RBAC & DEPARTMENTS SETUP GUIDE

This document outlines the database migration steps, Supabase Dashboard settings, Vercel environment variables, and enterprise role permission architecture for **Phase 5.3: Enterprise Role-Based Access Control (RBAC), Departments, Assignment Engine, Audit Logging & Realtime Notifications**.

---

## 1. ROLE HIERARCHY & PERMISSION MATRIX

Friendli Admin supports six enterprise roles:

| Role | Display Name | Authority Level & Key Scope | Assignable via Invite | Management Boundaries |
| :--- | :--- | :--- | :--- | :--- |
| `owner` | **Owner** | Highest authority (Level 100). Full control over security, team, departments, payments, trips, settings. | ❌ (Manual DB promotion) | Can manage all roles including Owners & Admins. |
| `admin` | **Admin** | Daily operational manager (Level 80). Manages Operations, Sales, Support, Viewers, departments, and enquiry archiving. | ✅ | **Cannot manage Owners** (cannot edit, deactivate, or delete Owner accounts). |
| `operations` | **Operations** | Trip operations team (Level 50). Manages assigned enquiries, bookings, travellers, vehicles, hotels. | ✅ | Cannot manage team members. |
| `sales` | **Sales** | Lead conversion team (Level 50). Views enquiries, updates follow-ups, calls, WhatsApp, assigns leads. | ✅ | Cannot archive or manage team members. |
| `support` | **Support** | Customer support team (Level 50). Views assigned travellers and updates customer support notes. | ✅ | Cannot manage team members. |
| `viewer` | **Viewer** | Read-only access (Level 10) across allowed operational dashboards and enquiries. | ✅ | Read-only. |

---

## 2. SUPABASE DATABASE MIGRATION

Run the SQL migration script located in `supabase/migrations/20260728000000_enterprise_rbac_and_departments.sql` in your Supabase SQL Editor:

```sql
-- Apply 20260728000000_enterprise_rbac_and_departments.sql
```

---

## 3. SUPABASE DASHBOARD AUTH CONFIGURATION

1. Open your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
2. Set **Site URL**: `https://friendli-tripz.vercel.app` (or custom domain).
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - `https://friendli-tripz.vercel.app/**`
4. Click **Save**.

---

## 4. ENVIRONMENT VARIABLES

```env
NEXT_PUBLIC_SUPABASE_URL=https://ovsrfytzylxcofahhbcy.supabase.co/
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_APP_URL=https://friendli-tripz.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=917603967190
```

---

## 5. SECURITY RULES & SAFEGUARDS

1. **Owner Authority Protection**: Admins are strictly prohibited from changing Owner credentials, deleting Owners, or demoting Owner roles.
2. **Server-Side Authorization**: Every API and route validates caller session, active profile status, and role permission via `requirePermission()`.
3. **Audit Trail**: Every invitation, role change, status update, assignment, and deletion generates a sanitized `admin_activity_logs` entry.
