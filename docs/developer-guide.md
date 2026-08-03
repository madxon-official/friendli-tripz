# Developer Onboarding & Engineering Guide — Friendli Tripz

## Quickstart Guide

### 1. Repository Setup
```bash
git clone https://github.com/madxon-official/friendli-tripz.git
cd friendli-tripz
npm install
```

### 2. Environment Setup
Create a `.env.local` file with Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### 3. Local Development
Start Next.js dev server with Turbopack acceleration:
```bash
npm run dev
```

### 4. Code Standards
- Use `npx tsc --noEmit` before submitting PRs.
- Never use `'use client'` on root layout or landing pages unless required for state.
- Always use `supabase.auth.getUser()` for server-side auth validation.
