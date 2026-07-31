# FRIENDLI TRIPZ — PRODUCTION DEPLOYMENT GUIDE

## 1. Prerequisites
- Vercel Team Account (connected to production Git repository).
- Supabase Cloud Enterprise / Pro Project.
- Custom Domain registered (`friendlitripz.com`).
- Docker engine installed (for self-hosted containerized deployment).

---

## 2. Vercel Deployment Workflow
1. Import repository into Vercel Dashboard.
2. Select **Next.js** framework preset.
3. Configure Environment Variables as specified in `ENVIRONMENT_SETUP.md`.
4. Set Build Command: `npm run build`.
5. Deploy to Production Branch (`main`).

---

## 3. Containerized Deployment (Docker)
```bash
# Build standalone Docker image
docker build -t friendli-tripz:latest .

# Run production container
docker run -d \
  -p 3000:3000 \
  --env-file .env.local \
  --name friendli-app \
  friendli-tripz:latest
```

---

## 4. Post-Deployment Verification
- Run Health Probe: `curl https://friendlitripz.com/api/health`
- Verify HTTP 200 response with status `healthy`.
