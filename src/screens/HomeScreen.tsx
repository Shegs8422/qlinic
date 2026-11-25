import { HugeiconsIcon } from "@hugeicons/react";
import {
  StethoscopeIcon,
  Search01Icon,
  UserIcon,
  Settings02Icon,
  QrCodeIcon,
  Ticket01Icon,
  Calendar03Icon,
  CalendarCheck01Icon,
  UserGroupIcon,
  ArrowRight01Icon,
  TaskDone01Icon,
  Directions01Icon,
  Call02Icon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useQueueStore } from "../store/queueStore";
import { useClinicStore } from "../store/clinicStore";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { TopBar } from "../components/TopBar";
import { ClinicCard } from "../components/ClinicCard";
import { Tooltip } from "../components/Tooltip";
import { data } from "../data";

export function HomeScreen() {
  const navigate = useNavigate();
  const { fullName } = useAuthStore();
  const { queueNumber, selectedService, selectedClinic, active } =
    useQueueStore();
  const { setReturnScreen } = useSettingsStore();

  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const queueState = "Waiting";
  const appointment = true;
  const appointmentCancelled = false;

  const openProfile = () => navigate("/profile");
  const openSettings = () => navigate("/settings");

  useEffect(() => {
    const load = async () => {
      try {
        const clinicList = await data.getClinics();
        setClinics(clinicList);
      } catch {
        setClinics([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const closestClinic = clinics[0];

  if (loading) {
    return (
      <main className="content items-center justify-center py-20">
        <span className="t-shimmer" data-text="Loading clinics">
          Loading clinics
        </span>
      </main>
    );
  }

  return (
    <>
      <TopBar onProfile={openProfile} onSettings={openSettings} />
      <main className="content content--with-nav home-content">
        <section className="home-hero t-stagger">
          <strong className="t-stagger-line t-stagger-line--1 eyebrow">
            PATIENT: {fullName.toUpperCase()}
          </strong>
          <h1 className="t-stagger-line t-stagger-line--2">
            Plan care around your day.
          </h1>
          <p className="t-stagger-line" style={{ transitionDelay: "80ms" }}>
            Compare estimated waits and choose when to make your way in.
          </p>
          <Button
            onClick={() => navigate("/clinics")}
            icon={<HugeiconsIcon icon={Search01Icon} size={18} />}
          >
            Find a clinic
          </Button>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <h2>Active visit</h2>
          </div>

          {active ? (
            <article className="card card--dark">
              <div className="row row--between">
                <Badge tone="light">{queueState}</Badge>
                <button
                  className="p-1 rounded-full bg-neutral-800 text-white"
                  title="View QR"
                >
                  <HugeiconsIcon icon={QrCodeIcon} size={18} />
                </button>
              </div>
              <span className="eyebrow text-neutral-400">
                {selectedService?.toUpperCase()} · NUMBER{" "}
                <span className="t-subtle-number is-animating" style={{ "--subtle-dir": "1" } as React.CSSProperties}>
                  <span className="t-subtle-slot">
                    <span className="t-subtle-old" aria-hidden="true">0</span>
                    <span className="t-subtle-new">{queueNumber}</span>
                  </span>
                </span>
              </span>
              <h2>
                {selectedClinic?.patientsAhead} patients ahead of you
              </h2>
              <p>
                Estimated consultation:{" "}
                <span className="t-subtle-number is-animating" style={{ "--subtle-dir": "1" } as React.CSSProperties}>
                  <span className="t-subtle-slot">
                    <span className="t-subtle-old" aria-hidden="true">0</span>
                    <span className="t-subtle-new">
                      {selectedClinic?.wait || "Unavailable"}
                    </span>
                  </span>
                </span>
              </p>
              <div className="visit-card-actions">
                <Button variant="secondary" onClick={() => navigate("/queue")}>
                  Manage queue
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/visit-prep")}
                >
                  Prepare to leave
                </Button>
              </div>
            </article>
          ) : appointment && !appointmentCancelled ? (
            <article className="card border-black">
              <div className="row row--between">
                <Badge tone="success">Confirmed Appointment</Badge>
                <HugeiconsIcon icon={CalendarCheck01Icon} size={20} />
              </div>
              <span className="eyebrow text-neutral-500">
                TUE, 3 NOV · 10:30 AM
              </span>
              <h2>General outpatient consultation</h2>
              <p>{selectedClinic?.name || closestClinic?.name} · Ref: QL-1842</p>
              <div className="visit-card-actions">
                <Button variant="secondary" onClick={() => navigate("/appointment")}>
                  View booking details
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/visit-prep")}
                >
                  Prepare for visit
                </Button>
              </div>
            </article>
          ) : (
            <article className="empty-card">
              <HugeiconsIcon icon={Calendar03Icon} size={28} />
              <div>
                <h3 className="text-sm">No active queue or appointment</h3>
                <p className="text-xs">
                  Join a digital queue and your position will appear here.
                </p>
              </div>
            </article>
          )}
        </section>

        <section className="home-section">
          <div className="section-heading">
            <h2>Quick services</h2>
          </div>
          <div className="quick-grid">
            <Tooltip label="Join a digital queue from this clinic">
              <button onClick={() => navigate("/clinics")} className="quick-action">
                <div className="flex items-center justify-between w-full">
                  <span className="quick-action__icon">
                    <HugeiconsIcon icon={UserGroupIcon} size={18} />
                  </span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </div>
                <div>
                  <strong>Join queue</strong>
                  <small>Remote pass</small>
                </div>
              </button>
            </Tooltip>

            <Tooltip label="Book a scheduled appointment">
              <button
                onClick={() => navigate("/booking")}
                className="quick-action"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="quick-action__icon">
                    <HugeiconsIcon icon={Calendar03Icon} size={18} />
                  </span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </div>
                <div>
                  <strong>Book visit</strong>
                  <small>Choose slot</small>
                </div>
              </button>
            </Tooltip>
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <h2>Closest public clinic</h2>
            <Button variant="quiet" onClick={() => navigate("/clinics")}>
              View all
            </Button>
          </div>
          {closestClinic && (
            <ClinicCard clinic={closestClinic} onJoinQueue={() => navigate("/service")} />
          )}
        </section>
      </main>
    </>
  );
}
