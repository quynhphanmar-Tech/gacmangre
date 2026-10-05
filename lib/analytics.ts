// ==============================================================================
// GẠC MĂNG RÊ — Lightweight Privacy-Conscious Analytics Dispatcher
// (Brief M2 Section 13: Track demand funnel without sending sensitive PII)
// ==============================================================================

export type AnalyticsEvent =
  | 'ngan_view'
  | 'ngan_cta_click'
  | 'order_form_view'
  | 'order_form_start'
  | 'order_submit'
  | 'order_success'
  | 'order_error'
  | 'share_ngan';

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
    ...properties,
  };

  // Safe client console logging for development/audit
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[Analytics Event] ${event}:`, payload);
  }

  // Hook to GA4 if initialized
  if (typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', event, payload);
  }

  // Hook to PostHog if initialized
  if (typeof (window as unknown as { posthog?: { capture: (name: string, data: unknown) => void } }).posthog?.capture === 'function') {
    (window as unknown as { posthog: { capture: (name: string, data: unknown) => void } }).posthog.capture(event, payload);
  }
}
