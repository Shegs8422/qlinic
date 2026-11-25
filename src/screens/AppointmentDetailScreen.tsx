import { HugeiconsIcon } from "@hugeicons/react";
import { TaskDone01Icon, Directions01Icon, Calendar03Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useQueueStore } from "../store/queueStore";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";
import { Badge } from "../components/Badge";

export function AppointmentDetailScreen() {
  const navigate = useNavigate();
  const {
    selectedService,
    selectedClinic,
  } = useQueueStore();
  const {
    setShowCancelDialog,
  } = useSettingsStore();

  const appointmentCancelled = false;
  const date = "TUE, 3 NOVEMBER 2026";
  const time = "10:30 AM";

  return (
    <>
      <TopBar
        title="Appointment"
        backTo="/appointments"
      />
      <main className="content">
        <section>
          <Badge tone={appointmentCancelled ? "danger" : "success"}>
            {appointmentCancelled ? "Cancelled" : "Confirmed"}
          </Badge>
          <h1>{appointmentCancelled ? "Booking cancelled" : date}</h1>
          <p>
            {appointmentCancelled
              ? "Slot released back to clinic schedule."
              : `${time} · Ref: QL-1842`}
          </p>
        </section>

        <div className="list-card">
          <div className="list-row">
            <span className="text-xs text-neutral-500">Department</span>
            <strong>{selectedService}</strong>
          </div>
          <div className="list-row">
            <span className="text-xs text-neutral-500">Facility</span>
            <strong>{selectedClinic?.name}</strong>
          </div>
        </div>

        {!appointmentCancelled && (
          <div className="stack pt-4">
            <Button
              onClick={() => navigate("/visit-prep")}
              icon={<HugeiconsIcon icon={TaskDone01Icon} size={18} />}
            >
              Prepare for this visit
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                // directions modal
              }}
            >
              Get directions
            </Button>
            <Button variant="danger" onClick={() => setShowCancelDialog(true)}>
              Cancel appointment
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
