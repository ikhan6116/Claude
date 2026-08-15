import { useCallback, useEffect, useRef } from 'react';

const DELAY_MS = 30_000;
const ENDPOINT = '/api/loans/partial-lead';

type Payload = Record<string, unknown>;

/**
 * Abandoned-lead capture with a grace period.
 *
 * Call `schedule(payload)` when the visitor reaches phone verification. The
 * partial-lead notification is held for 30s so a lead who finishes verifying
 * doesn't trigger a false "incomplete" alert — call `cancel()` on successful
 * completion to suppress it.
 *
 * If the visitor closes or navigates away from the page before completing, the
 * notification is sent immediately via sendBeacon so a genuine abandoner isn't
 * lost during the grace period. (We intentionally do NOT fire on tab-switch /
 * visibilitychange, since visitors routinely leave to fetch their SMS code.)
 */
export function useAbandonedLead() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const payloadRef = useRef<Payload | null>(null);
  const sentRef = useRef(false);
  const scheduledRef = useRef(false);

  const send = useCallback((useBeacon: boolean) => {
    if (sentRef.current || !payloadRef.current) return;
    sentRef.current = true;
    const body = JSON.stringify(payloadRef.current);
    if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  }, []);

  const schedule = useCallback((payload: Payload) => {
    if (scheduledRef.current || sentRef.current) return;
    scheduledRef.current = true;
    payloadRef.current = payload;
    timerRef.current = setTimeout(() => send(false), DELAY_MS);
  }, [send]);

  const cancel = useCallback(() => {
    // Mark as sent so neither the timer nor a page-leave beacon can fire.
    sentRef.current = true;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => {
    const onLeave = () => {
      if (scheduledRef.current && !sentRef.current) send(true);
    };
    window.addEventListener('pagehide', onLeave);
    return () => {
      window.removeEventListener('pagehide', onLeave);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [send]);

  return { schedule, cancel };
}
