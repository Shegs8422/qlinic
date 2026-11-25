import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, UserIcon, Settings02Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";
import { data } from "../data";
import { Badge } from "../components/Badge";

export function AppointmentsScreen() {
  const navigate = useNavigate();
  const {
    setReturnScreen,
  } = useSettingsStore();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentTab, setAppointmentTab] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const appts = await data.getPastAppointments();
        setAppointments(appts);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".t-tabs");
    const pillEl = document.querySelector<HTMLElement>(".t-tabs-pill");
    if (!bar || !pillEl) return;

    const pill = pillEl!;
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

    moveTo(active(), false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pastAppts = appointments.filter((a: any) => a.status !== "PENDING");
  const upcomingAppts = appointments.filter(
    (a: any) => a.status === "PENDING" || a.status === "CONFIRMED"
  );

  return (
    <>
      <TopBar
        title="Bookings"
      />
      <main className="content content--with-nav">
        <div className="t-tabs" role="tablist">
          <span className="t-tabs-pill" aria-hidden="true"></span>
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
            Past visits ({pastAppts.length})
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
          upcomingAppts.length > 0 ? (
            upcomingAppts.map((appt: any) => (
              <article key={appt.id} className="card border-black">
                <Badge tone="success">Confirmed</Badge>
                <h3>{appt.service}</h3>
                <p className="text-sm font-bold text-black">
                  {appt.clinic}
                </p>
                <small>
                  {new Date(appt.date).toLocaleDateString("en-US", { weekday: "short" })} ·
                  {appt.time} · Ref: {appt.ref}
                </small>
                <div className="pt-2">
                  <Button variant="secondary" onClick={() => navigate("/appointment")}>
                    Manage booking
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <HugeiconsIcon icon={Calendar03Icon} size={48} />
              <h3>No upcoming appointments</h3>
              <p>Schedule a consultation to secure your time slot.</p>
            </div>
          )
        ) : (
          loading ? (
            <div className="empty-state">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
              <p className="text-sm text-neutral-500">Loading appointments</p>
            </div>
          ) : pastAppts.length > 0 ? (
            <div className="stack">
              {pastAppts.map((past: any) => (
                <article key={past.id} className="card">
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
          ) : (
            <div className="empty-state">
              <HugeiconsIcon icon={Calendar03Icon} size={48} />
              <h3>No past visits</h3>
              <p>Your appointment history will appear here.</p>
            </div>
          )
        )}
      </main>
    </>
  );
}
