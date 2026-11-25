import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Clock01Icon,
  Ticket01Icon,
  Calendar03Icon,
  ArrowRight01Icon,
  Directions01Icon,
  Call02Icon,
} from "@hugeicons/core-free-icons";
import { useParams, useNavigate } from "react-router-dom";
import { useClinicStore } from "../store/clinicStore";
import { useQueueStore } from "../store/queueStore";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Notice } from "../components/Notice";
import { TopBar } from "../components/TopBar";
import { GoogleMapPreview } from "../components/GoogleMapPreview";
import { clinics } from "../data/mockData";

export function ClinicDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    setSelectedClinic,
  } = useClinicStore();
  const {
    setSelectedService,
    setSelectedClinic: setQueueClinic,
  } = useQueueStore();
  const {
    setReturnScreen,
  } = useSettingsStore();

  const clinic = clinics.find((c) => c.id === id) || clinics[0];

  const handleJoinQueue = () => {
    setSelectedClinic(clinic);
    setReturnScreen("clinicReturnScreen", "/clinics");
    setQueueClinic(clinic);
    setSelectedService(clinic.services[0]);
    navigate("/queue-confirm");
  };

  const handleBook = () => {
    navigate("/booking");
  };

  return (
    <>
      <TopBar
        title="Clinic Details"
        backTo="/clinics"
      />
      <main className="content">
        <section>
          <Badge tone={clinic.open ? "success" : "neutral"}>
            {clinic.open ? "Open today · 8am–5pm" : "Closed"}
          </Badge>
          <h1>{clinic.name}</h1>
          <p className="text-neutral-500 text-xs row row--compact">
            <HugeiconsIcon icon={Location01Icon} size={14} />
            <span>{clinic.address}</span>
          </p>
        </section>

        <article className="card card--dark">
          <span className="eyebrow text-neutral-400">ESTIMATED WAIT</span>
          <strong className="text-3xl font-extrabold text-white">
            {clinic.wait || "Closed for admissions"}
          </strong>
          <small className="text-neutral-400">{clinic.updated}</small>
        </article>

        {clinic.open && clinic.rule === "remote" ? (
          <Button
            onClick={handleJoinQueue}
            icon={<HugeiconsIcon icon={Ticket01Icon} size={18} />}
          >
            Join queue remotely
          </Button>
        ) : (
          <Notice>
            Check in at physical reception triage desk upon arrival.
          </Notice>
        )}

        <Button
          variant="secondary"
          onClick={handleBook}
          icon={<HugeiconsIcon icon={Calendar03Icon} size={18} />}
        >
          Book scheduled appointment
        </Button>

        <section>
          <h2>Departments</h2>
          <div className="list-card">
            {clinic.services.map((svc) => (
              <button
                className="list-row w-full flex items-center justify-between"
                key={svc}
                onClick={() => {
                  setSelectedService(svc);
                  if (clinic.open && clinic.rule === "remote") {
                    navigate("/service");
                  }
                }}
              >
                <span>{svc}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </button>
            ))}
          </div>
        </section>

        <section className="clinic-map-section">
          <div className="section-heading">
            <h2>Location</h2>
            <span className="map-preview__live">Google Maps</span>
          </div>
          <GoogleMapPreview clinic={clinic} />
          <button
            className="map-directions-button"
            onClick={() => {
              // directions modal
            }}
          >
            <span>
              <strong>Transit & directions</strong>
              <small>{clinic.transit}</small>
            </span>
            <HugeiconsIcon icon={Directions01Icon} size={19} />
          </button>
        </section>
      </main>
    </>
  );
}
