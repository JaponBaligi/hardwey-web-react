import { useState, useEffect } from 'react';

let contentCache: Record<string, any> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cacheInvalidationListeners: Set<() => void> = new Set();

export function useContent<T = any>(sectionKey: string, fallback?: T): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(fallback || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const listener = () => setRefreshTrigger(prev => prev + 1);
    cacheInvalidationListeners.add(listener);
    
    const now = Date.now();
    if (contentCache && now - cacheTimestamp < CACHE_TTL) {
      setData(contentCache[sectionKey] || fallback || null);
      setLoading(false);
      return () => {
        cacheInvalidationListeners.delete(listener);
      };
    }

    let cancelled = false;
    setLoading(true);
    fetch('/api/content')
      .then(r => r.json())
      .then((json: { content: Record<string, any> }) => {
        if (cancelled) return;
        contentCache = json.content;
        cacheTimestamp = Date.now();
        setData(json.content[sectionKey] || fallback || null);
        setError(null);
      })
      .catch(e => {
        if (cancelled) return;
        setError(e.message);
        setData(fallback || null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      cacheInvalidationListeners.delete(listener);
    };
  }, [sectionKey, fallback, refreshTrigger]);

  return { data, loading, error };
}

export function invalidateContentCache() {
  contentCache = null;
  cacheTimestamp = 0;
  // Notify all components to refetch
  cacheInvalidationListeners.forEach(listener => listener());
}

