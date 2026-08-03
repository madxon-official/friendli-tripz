# Enterprise Deployment Manual — Friendli Tripz

## Deployment Target
- **Production Framework**: Next.js 15.5+ App Router
- **Runtime Environment**: Node.js 20 LTS / Docker / Vercel Enterprise
- **Database Target**: Supabase Managed Postgres with RLS

## Pre-Deployment Verification Checklist
1. `npx tsc --noEmit` returns 0 errors.
2. `npm run build` generates static HTML pre-rendered pages.
3. Environment variables configured in deployment manager.
4. Database health probe `/api/health` returns `200 OK`.

## Production Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=production
```
