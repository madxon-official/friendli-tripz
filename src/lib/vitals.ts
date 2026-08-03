/**
 * Core Web Vitals & Performance Monitoring Utility for Friendli Tripz
 * Logs LCP, FID, CLS, TTFB, and FCP performance metrics in production.
 */

export interface Metric {
  id: string;
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
  startTime: number;
  value: number;
  label: 'web-vital' | 'custom';
}

export function reportWebVitals(metric: Metric) {
  if (process.env.NODE_ENV !== 'production') {
    // Suppress verbose metrics logging in dev mode
    return;
  }

  // Log Core Web Vitals to server analytics or OpenTelemetry endpoint
  const payload = {
    metric: metric.name,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    id: metric.id,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined' && 'navigator' in window && 'sendBeacon' in navigator) {
    navigator.sendBeacon('/api/health?probe=vital', JSON.stringify(payload));
  }
}
