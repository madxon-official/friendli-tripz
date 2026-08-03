# Enterprise Architecture Reference — Friendli Tripz

## Overview
Friendli Tripz is built on Next.js 15 App Router, React 19, and Supabase SSR. It employs a multi-tenant enterprise RBAC governance system, immutable ledger tracking, and an isolated V3 atomic presentation layer.

## Architecture Layers

```
+-----------------------------------------------------------------------+
|                        Presentation Layer                             |
|    V3 Atomic Design System (Tokens, Outfit Font, Glassmorphism)      |
+-----------------------------------------------------------------------+
|                        Application Layer                              |
|   App Router (ISR static pre-rendering, Edge Middleware Auth Guard)  |
+-----------------------------------------------------------------------+
|                        Domain / Business Layer                        |
|   Server Actions, RBAC Matrix (8 Roles), Workflow State Engines       |
+-----------------------------------------------------------------------+
|                        Data & Infrastructure                          |
|   Supabase Postgres, Service Role Client, RLS Policies, Audit Logs   |
+-----------------------------------------------------------------------+
```

## Core Architectural Guarantees
1. **Server-Side Security**: All sensitive database operations run through `createServiceRoleClient()` or RLS-enforced server sessions.
2. **Zero Leaked Auth Secrets**: Supabase service role key is strictly isolated to server runtime.
3. **Data Integrity**: Audited multi-user state transitions with immutable activity logs.
