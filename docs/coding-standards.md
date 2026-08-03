# Engineering & Coding Standards — Friendli Tripz

## Architectural Principles
1. **SOLID & Single Responsibility**: Every component and module must do one thing well.
2. **Server Components First**: Avoid `'use client'` on pages unless managing local interactive DOM state.
3. **Strict Type Safety**: No implicit `any` types. All API payloads and Server Action inputs must be validated with Zod.
4. **Structured Logging**: Use `logger.info()`, `logger.warn()`, `logger.error()` instead of raw `console.log`.
5. **No Deprecated Auth APIs**: Always use `supabase.auth.getUser()` on server contexts.
