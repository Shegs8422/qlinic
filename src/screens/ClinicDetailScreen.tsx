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
import { useEffect, useState } from "react";
import { useClinicStore } from "../store/clinicStore";
import { useQueueStore } from "../store/queueStore";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Notice } from "../components/Notice";
import { TopBar } from "../components/TopBar";
import { GoogleMapPreview } from "../components/GoogleMapPreview";
import { data } from "../data";

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

  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const c = await data.getClinic(id);
        setClinic(c);
      } catch {
        setClinic(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleJoinQueue = () => {
    if (!clinic) return;
    setSelectedClinic(clinic);
    setReturnScreen("clinicReturnScreen", "/clinics");
    setQueueClinic(clinic);
    setSelectedService(clinic.services?.[0] || "General outpatient");
    navigate("/queue-confirm");
  };

  const handleBook = () => {
    navigate("/booking");
  };

  if (loading || !clinic) {
    return (
      <main className="content items-center justify-center py-20">
        <span className="t-shimmer" data-text="Loading clinic details">
          Loading clinic details
        </span>
      </main>
    );
  }

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
            {clinic.services?.map((svc: string) => (
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
