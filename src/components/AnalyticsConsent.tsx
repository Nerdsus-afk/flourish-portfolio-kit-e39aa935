import { useEffect, useState } from "react";
import { getAnalyticsConsent, setAnalyticsConsent } from "@/lib/analytics";

export const AnalyticsConsent = () => {
  const [consent, setConsent] = useState<"granted" | "denied" | "unset">("unset");

  useEffect(() => {
    setConsent(getAnalyticsConsent());
    const onChange = (e: Event) =>
      setConsent((e as CustomEvent).detail as "granted" | "denied");
    window.addEventListener("analytics-consent-change", onChange);
    return () => window.removeEventListener("analytics-consent-change", onChange);
  }, []);

  if (consent !== "unset") return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      className="fixed bottom-4 inset-x-4 md:left-auto md:right-4 md:max-w-sm z-50 rounded-2xl border border-border bg-card/95 backdrop-blur p-4 shadow-glow"
    >
      <p className="text-sm text-foreground">
        Can I record anonymous interaction data (hovers, clicks) to see which
        placement offers people engage with most? Nothing personal is collected.
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setAnalyticsConsent("denied")}
          className="px-3 py-1.5 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground hover:border-amber/60 transition-colors"
        >
          No thanks
        </button>
        <button
          type="button"
          onClick={() => setAnalyticsConsent("granted")}
          className="px-3 py-1.5 rounded-lg text-xs bg-amber text-primary-foreground border border-amber hover:opacity-90 transition-opacity"
        >
          Allow
        </button>
      </div>
    </div>
  );
};
