import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, UserIcon, Settings02Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";
import { pastAppointmentsList } from "../data/mockData";
import { useRef, useEffect, useState } from "react";
import { Badge } from "../components/Badge";

export function AppointmentsScreen() {
  const navigate = useNavigate();
  const {
    setReturnScreen,
  } = useSettingsStore();

  const [appointmentTab, setAppointmentTab] = useState<"upcoming" | "past">("upcoming");
  const tabsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = tabsRef.current;
    const pillEl = pillRef.current;
    if (!bar || !pillEl) return;

    const pill = pillEl;

    const tabs = [...bar.querySelectorAll<HTMLElement>(".t-tab")];

    function moveTo(tab: HTMLElement, animate: boolean) {
      if (!animate) {
        const prev = pill.style.transition;
        pill.style.transition = "none";
        pill.style.transform = `translateX(${tab.offsetLeft}px)`;
        pill.style.width = `${tab.offsetWidth}px`;
        void pill.offsetWidth;
        pill.style.transition = prev;
      } else {
        pill.style.transform = `translateX(${tab.offsetLeft}px)`;
        pill.style.width = `${tab.offsetWidth}px`;
      }
    }

    const active = () =>
      tabs.find((t) => t.getAttribute("aria-selected") === "true") ||
      tabs[0];

    const onResize = () => moveTo(active(), false);

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) =>
          t.setAttribute("aria-selected", t === tab ? "true" : "false")
        );
        setAppointmentTab(tab.getAttribute("data-tab") as "upcoming" | "past");
        moveTo(tab, true);
      });
    });

    requestAnimationFrame(() => moveTo(active(), false));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const appointment = true;
  const appointmentCancelled = false;

  return (
    <>
      <TopBar
        title="Bookings"
      />
      <main className="content content--with-nav">
        <div className="t-tabs" ref={tabsRef} role="tablist">
          <span className="t-tabs-pill" ref={pillRef} aria-hidden="true"></span>
          <button
            className="t-tab"
            role="tab"
            data-tab="upcoming"
            aria-selected={appointmentTab === "upcoming"}
            onClick={() => setAppointmentTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className="t-tab"
            role="tab"
            data-tab="past"
            aria-selected={appointmentTab === "past"}
            onClick={() => setAppointmentTab("past")}
          >
            Past visits ({pastAppointmentsList.length})
          </button>
        </div>

        <Button
          onClick={() => {
            setReturnScreen("bookingReturnScreen", "/appointments");
            navigate("/booking");
          }}
          icon={<HugeiconsIcon icon={Calendar03Icon} size={18} />}
        >
          Book new appointment
        </Button>

        {appointmentTab === "upcoming" ? (
          appointment && !appointmentCancelled ? (
            <article className="card border-black">
              <Badge tone="success">Confirmed</Badge>
              <h3>General outpatient</h3>
              <p className="text-sm font-bold text-black">
                Central Community Clinic
              </p>
              <small>Tuesday · 10:30 AM · Ref: QL-1842</small>
              <div className="pt-2">
                <Button variant="secondary" onClick={() => navigate("/appointment")}>
                  Manage booking
                </Button>
              </div>
            </article>
          ) : (
            <article className="empty-card">
              <HugeiconsIcon icon={Calendar03Icon} size={28} />
              <div>
                <h3 className="text-sm">No upcoming appointments</h3>
                <p className="text-xs">
                  Schedule a consultation to secure your time slot.
                </p>
              </div>
            </article>
          )
        ) : (
          <div className="stack">
            {pastAppointmentsList.map((past) => (
              <article className="card" key={past.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="eyebrow">{past.date}</span>
                    <h3 className="text-sm mt-0.5">{past.service}</h3>
                    <p className="text-xs">
                      {past.clinic} · {past.doctor}
                    </p>
                  </div>
                  <Badge tone="neutral">{past.status}</Badge>
                </div>
                <p className="text-xs p-3 rounded-xl bg-neutral-100">
                  {past.notes}
                </p>
                <button
                  className="text-xs font-bold underline text-left"
                >
                  View clinic record
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
