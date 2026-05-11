/**
 * Lightweight, consent-gated analytics.
 *
 * - track() is a no-op until the user explicitly grants consent
 *   (via setAnalyticsConsent("granted")).
 * - Events are dispatched to window.dataLayer (GA4-style) when present,
 *   and always console.debug'd for local visibility.
 * - To wire a real provider (Plausible, PostHog, GA4, etc.), replace the
 *   "dispatch" branch below — the consent + queue plumbing stays the same.
 */

const CONSENT_KEY = "analytics-consent";
type Consent = "granted" | "denied" | "unset";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export const getAnalyticsConsent = (): Consent => {
  if (typeof window === "undefined") return "unset";
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "granted" || v === "denied" ? v : "unset";
};

export const setAnalyticsConsent = (value: Exclude<Consent, "unset">) => {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("analytics-consent-change", { detail: value }));
};

export type AnalyticsEvent = {
  name: string;
  props?: Record<string, string | number | boolean | null | undefined>;
};

export const track = (event: AnalyticsEvent): void => {
  if (getAnalyticsConsent() !== "granted") return;
  const payload = { event: event.name, ...(event.props ?? {}), ts: Date.now() };
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(payload);
  }
  // eslint-disable-next-line no-console
  console.debug("[analytics]", payload);
};
