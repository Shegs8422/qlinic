import { HugeiconsIcon } from "@hugeicons/react";
import {
  IdentificationIcon,
  Medicine01Icon,
  File01Icon,
  Car01Icon,
  TaskDone01Icon,
  Directions01Icon,
  Call02Icon,
  CheckmarkBadge01Icon,
  ArrowLeft01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState, useCallback } from "react";
import { useSettingsStore } from "../store/settingsStore";
import { useQueueStore } from "../store/queueStore";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Notice } from "../components/Notice";

const prepItems = [
  {
    key: "identification",
    label: "Clinic ID or national ID",
    description: "Bring a valid patient identification document",
    icon: <HugeiconsIcon icon={IdentificationIcon} size={20} />,
  },
  {
    key: "medication",
    label: "Medication list",
    description:
      "Bring your medicines or a written list of names and doses",
    icon: <HugeiconsIcon icon={Medicine01Icon} size={20} />,
  },
  {
    key: "records",
    label: "Referral and recent results",
    description:
      "Pack any referral letter, test results, or clinic booklet",
    icon: <HugeiconsIcon icon={File01Icon} size={20} />,
  },
  {
    key: "transport",
    label: "Transport plan",
    description: "Plan your route to the clinic",
    icon: <HugeiconsIcon icon={Car01Icon} size={20} />,
  },
];

export function VisitPrepScreen() {
  const navigate = useNavigate();
  const {
    visitPrep,
    setVisitPrep,
  } = useSettingsStore();
  const {
    active,
    selectedClinic,
    selectedService,
    patientsAhead,
  } = useQueueStore();

  const readyCount = Object.values(visitPrep).filter(Boolean).length;
  const isReady = readyCount === prepItems.length;
  const [reorderReady, setReorderReady] = useState(false);

  const handleToggle = (key: string) => {
    setVisitPrep({ [key]: !visitPrep[key as keyof typeof visitPrep] } as any);
  };

  // To-do reorder pointer orchestration (transitions-dev #37)
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    setReorderReady(true);

    let drag: { item: HTMLElement; rows: HTMLElement[]; from: number; to: number; startY: number; step: number } | null = null;
    let pending: { run: () => void; timer: ReturnType<typeof setTimeout> } | null = null;

    const slot = () => {
      const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
      return (list.children[0] as HTMLElement).getBoundingClientRect().height + gap;
    };
    const ms = (name: string, fb: number) => {
      const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
      return Number.isFinite(v) ? v : fb;
    };

    list.addEventListener("pointerdown", (e) => {
      const target = e.target as HTMLElement;
      const item = target.closest(".t-reorder-item") as HTMLElement | null;
      if (!item || e.button !== 0) return;
      if (pending) { clearTimeout(pending.timer); pending.run(); }
      const rows = Array.from(list.children) as HTMLElement[];
      drag = {
        item,
        rows,
        from: rows.indexOf(item),
        to: rows.indexOf(item),
        startY: e.clientY,
        step: slot(),
      };
      try { item.setPointerCapture(e.pointerId); } catch {}
      item.classList.add("is-dragging");
      item.style.setProperty("--dy", "0px");
    });

    list.addEventListener("pointermove", (e) => {
      if (!drag || !list) return;
      const d = drag;
      const dy = e.clientY - d.startY;
      d.item.style.setProperty("--dy", dy + "px");

      const to = Math.max(
        0,
        Math.min(d.rows.length - 1, d.from + Math.round(dy / d.step))
      );
      if (to === d.to) return;
      d.to = to;

      d.rows.forEach((row, i) => {
        if (row === d.item) return;
        let shift = 0;
        if (d.from < to && i > d.from && i <= to) shift = -d.step;
        if (d.from > to && i >= to && i < d.from) shift = d.step;
        row.style.transform = `translateY(${shift}px)`;
      });
    });

    function end() {
      if (!drag || !list) return;
      const d = drag;
      drag = null;
      d.item.classList.remove("is-dragging");
      d.item.style.setProperty("--rest", (d.to - d.from) * d.step + "px");
      d.item.classList.add("is-settling");

      const run = () => {
        if (!pending) return;
        pending = null;
        const ref = d.rows[d.to > d.from ? d.to + 1 : d.to];
        list.insertBefore(d.item, ref || null);
        d.rows.forEach((row) => {
          row.style.transition = "none";
          row.style.transform = "";
          row.style.removeProperty("--dy");
          row.style.removeProperty("--rest");
        });
        d.item.classList.remove("is-settling");
        void list.offsetHeight;
        d.rows.forEach((row) => { row.style.transition = ""; });
      };
      pending = { run, timer: setTimeout(run, ms("--reorder-drop", 260)) };
    }
    list.addEventListener("pointerup", end);
    list.addEventListener("pointercancel", end);

    return () => {
      list.removeEventListener("pointerdown", (e) => {});
      list.removeEventListener("pointermove", (e) => {});
      list.removeEventListener("pointerup", end);
      list.removeEventListener("pointercancel", end);
    };
  }, [reorderReady]);

  const handleToggleReorder = useCallback((key: string) => {
    setVisitPrep({ [key]: !visitPrep[key as keyof typeof visitPrep] } as any);
  }, [visitPrep, setVisitPrep]);

  return (
    <>
      <header className="topbar">
        <div className="flex items-center gap-1 min-w-[44px]">
          <button
            className="icon-button"
            aria-label="Go back"
            onClick={() => navigate("/home")}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </button>
        </div>
        <div className="flex-1 text-center">
          <span className="topbar__title">Visit Companion</span>
        </div>
        <div className="flex items-center justify-end gap-1.5 min-w-[44px]" />
      </header>

      <main className="content visit-prep-screen">
        <section className="visit-prep-intro">
          <Badge tone={isReady ? "success" : "neutral"}>
            {readyCount} of {prepItems.length} ready
          </Badge>
          <h1>
            {isReady
              ? "You’re ready for your visit."
              : "Prepare before you leave."}
          </h1>
          <p>
            A quick check now can prevent delays when you reach the clinic.
          </p>
          <div
            className="prep-progress"
            role="progressbar"
            aria-label="Visit readiness"
            aria-valuemin={0}
            aria-valuemax={prepItems.length}
            aria-valuenow={readyCount}
          >
            <span className={`prep-progress__fill prep-progress__fill--${readyCount}`} />
          </div>
        </section>

        <article className="card card--dark visit-timing-card">
          <span className="eyebrow">
            {active ? "LIVE QUEUE PLAN" : "APPOINTMENT PLAN"}
          </span>
          <h2>
            {active
              ? `${patientsAhead} patients ahead`
              : `TUE, 3 NOVEMBER 2026 · 10:30 AM`}
          </h2>
          <p>
            {active
              ? `Allow about 15 minutes for travel. Start heading in when 5 patients remain ahead of you.`
              : `Plan to arrive 15 minutes early for check-in and triage.`}
          </p>
        </article>

        <section className="settings-section">
          <div className="section-heading">
            <h2>Your checklist</h2>
            <span className="eyebrow">
              {isReady ? "COMPLETE" : `${prepItems.length - readyCount} LEFT`}
            </span>
          </div>
          <ul className="t-reorder" ref={listRef}>
            {prepItems.map((item) => {
              const checked = visitPrep[item.key as keyof typeof visitPrep];
              return (
                <li
                  key={item.key}
                  className={`t-reorder-item ${checked ? "prep-item--checked" : ""}`}
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => handleToggleReorder(item.key)}
                >
                  <span className="prep-item__icon">{item.icon}</span>
                  <span className="prep-item__copy">
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                  <span className="prep-item__check" aria-hidden="true">
                    {checked && <HugeiconsIcon icon={Tick02Icon} size={16} />}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {isReady && (
          <div className="t-success-check" data-state="in" aria-hidden="true">
            <Notice
              icon={<HugeiconsIcon icon={CheckmarkBadge01Icon} size={19} />}
            >
              Everything is checked. Keep your queue pass or booking reference
              ready for reception.
            </Notice>
          </div>
        )}

        <section className="settings-section">
          <h2>Getting there</h2>
          <article className="card visit-location-card">
            <div>
              <strong>{selectedClinic?.name}</strong>
              <p>{selectedClinic?.address}</p>
            </div>
            <small>{selectedClinic?.transit}</small>
            <div className="visit-card-actions">
              <Button
                onClick={() => {
                  // directions modal
                }}
                icon={<HugeiconsIcon icon={Directions01Icon} size={18} />}
              >
                Directions
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  window.location.href = `tel:${selectedClinic?.phone.replace(/\s/g, "")}`;
                }}
                icon={<HugeiconsIcon icon={Call02Icon} size={18} />}
              >
                Call clinic
              </Button>
            </div>
          </article>
        </section>

        <Button variant="quiet" onClick={() => navigate("/home")}>
          Back to active visit
        </Button>
      </main>
    </>
  );
}
