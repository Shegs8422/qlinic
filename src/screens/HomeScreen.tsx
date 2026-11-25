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
import { useAuthStore } from "../store/authStore";
import { useQueueStore } from "../store/queueStore";
import { useClinicStore } from "../store/clinicStore";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { TopBar } from "../components/TopBar";
import { ClinicCard } from "../components/ClinicCard";
import { clinics } from "../data/mockData";

export function HomeScreen() {
  const navigate = useNavigate();
  const { fullName } = useAuthStore();
  const { queueNumber, selectedService, selectedClinic, active } =
    useQueueStore();
  const { setReturnScreen } = useSettingsStore();

  const queueState = "Waiting";
  const appointment = true;
  const appointmentCancelled = false;

  const openProfile = () => navigate("/profile");
  const openSettings = () => navigate("/settings");
  const openVisitPrep = () => navigate("/visit-prep");
  const startBooking = () => navigate("/booking");

  return (
    <>
      <TopBar
        onProfile={openProfile}
        onSettings={openSettings}
      />
      <main className="content content--with-nav home-content">
        <section className="home-hero">
          <span className="eyebrow">PATIENT: {fullName.toUpperCase()}</span>
          <h1>Plan care around your day.</h1>
          <p>
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
                {selectedService?.toUpperCase()} · NUMBER {queueNumber}
              </span>
              <h2>{selectedClinic?.patientsAhead} patients ahead of you</h2>
              <p>
                Estimated consultation: {selectedClinic?.wait || "Unavailable"}
              </p>
              <div className="visit-card-actions">
                <Button variant="secondary" onClick={() => navigate("/queue")}>
                  Manage queue
                </Button>
                <Button
                  variant="secondary"
                  onClick={openVisitPrep}
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
                TUE, 3 NOVEMBER 2026 · 10:30 AM
              </span>
              <h2>General outpatient consultation</h2>
              <p>{selectedClinic?.name || "Central Community Clinic"} · Ref: QL-1842</p>
              <div className="visit-card-actions">
                <Button variant="secondary" onClick={() => navigate("/appointment")}>
                  View booking details
                </Button>
                <Button
                  variant="secondary"
                  onClick={openVisitPrep}
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
            <button
              onClick={() => navigate("/clinics")}
              className="quick-action"
            >
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

            <button
              onClick={startBooking}
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
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <h2>Closest public clinic</h2>
            <Button variant="quiet" onClick={() => navigate("/clinics")}>
              View all
            </Button>
          </div>
          <ClinicCard clinic={clinics[0]} />
        </section>
      </main>
    </>
  );
}
