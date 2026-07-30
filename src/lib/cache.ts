import { revalidateTag } from 'next/cache';

const memoryCache = new Map<string, { data: any; expiresAt: number }>();

export async function getCachedQuery<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  const freshData = await fetcher();
  memoryCache.set(key, { data: freshData, expiresAt: now + ttlSeconds * 1000 });
  return freshData;
}

export async function purgeCacheTag(tag: string) {
  try {
    revalidateTag(tag);
  } catch (e) {}
}
