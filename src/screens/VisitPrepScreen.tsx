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

  const handleToggle = (key: string) => {
    setVisitPrep({ [key]: !visitPrep[key as keyof typeof visitPrep] } as any);
  };

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
          <div className="prep-list">
            {prepItems.map((item) => {
              const checked = visitPrep[item.key as keyof typeof visitPrep];
              return (
                <button
                  key={item.key}
                  className={`prep-item ${
                    checked ? "prep-item--checked" : ""
                  }`}
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => handleToggle(item.key)}
                >
                  <span className="prep-item__icon">{item.icon}</span>
                  <span className="prep-item__copy">
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                  <span className="prep-item__check" aria-hidden="true">
                    {checked && <HugeiconsIcon icon={Tick02Icon} size={16} />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {isReady && (
          <Notice
            icon={<HugeiconsIcon icon={CheckmarkBadge01Icon} size={19} />}
          >
            Everything is checked. Keep your queue pass or booking reference
            ready for reception.
          </Notice>
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
