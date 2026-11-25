import { useSettingsStore } from "../store/settingsStore";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useRef, useCallback } from "react";

export function Snackbar() {
  const { notifications } = useSettingsStore();
  const stackRef = useRef<HTMLDivElement>(null);
  const enteringIdRef = useRef<string | null>(null);

  // When a new banner arrives (index 0), flash the is-enter class so the
  // rise + cross-blur + scale entry animation plays. We add it, force a
  // reflow, then remove it in the same task — no rAF hop, so the banner
  // never lands motionless when the frame clock is throttled.
  useEffect(() => {
    if (notifications.length === 0) {
      enteringIdRef.current = null;
      return;
    }
    const newestId = notifications[0].id;
    if (enteringIdRef.current === newestId) return;
    enteringIdRef.current = newestId;

    const el = stackRef.current?.querySelector(
      `[data-banner-id="${newestId}"]`
    ) as HTMLElement | null;
    if (!el) return;
    el.classList.add("is-enter");
    void el.offsetWidth; // force reflow
    el.classList.remove("is-enter");
  }, [notifications]);

  const dismiss = useCallback(
    (id: string) => {
      useSettingsStore.setState((prev) => ({
        notifications: prev.notifications.filter((n) => n.id !== id),
      }));
    },
    []
  );

  // Hover spread: geometry-driven, not :hover — the gaps between spread
  // banners belong to no element, and boundary events would fire when a
  // banner animates in under a still pointer.
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const stage = stack.parentElement;
    if (!stage) return;

    const ms = (name: string, fb: number) => {
      const v = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(name)
      );
      return Number.isFinite(v) ? v : fb;
    };
    const spreadHeight = () =>
      (stack.offsetHeight + ms("--stack-spread-gap", 8)) * 2;
    const within = (e: PointerEvent, above: number) => {
      const r = stack.getBoundingClientRect();
      return (
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY <= r.bottom &&
        e.clientY >= r.top - above
      );
    };

    const onMove = (e: PointerEvent) => {
      if (stack.classList.contains("is-spread")) {
        if (!within(e, spreadHeight())) stack.classList.remove("is-spread");
      } else if (within(e, 0)) {
        stack.classList.add("is-spread");
      }
    };
    const onLeave = () => stack.classList.remove("is-spread");

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="t-stack" ref={stackRef} role="status" aria-live="polite">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="t-stack-banner"
          data-depth={String(
            notifications.findIndex((n) => n.id === notification.id)
          )}
          data-banner-id={notification.id}
        >
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
          <span>{notification.message}</span>
          <button
            className="banner-dismiss"
            aria-label="Dismiss notification"
            onClick={() => dismiss(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
