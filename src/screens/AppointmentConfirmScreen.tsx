import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useQueueStore } from "../store/queueStore";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";
import { Badge } from "../components/Badge";

export function AppointmentConfirmScreen() {
  const navigate = useNavigate();
  const { selectedClinic, selectedService } = useQueueStore();

  return (
    <>
      <TopBar showActions={false} />
      <main className="content items-center text-center">
        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center my-2">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} />
        </div>

        <Badge tone="success">Reserved</Badge>
        <h1>Your appointment is confirmed.</h1>
        <p className="text-xs text-neutral-500">
          We’ll remind you before your visit at {selectedClinic?.name}.
        </p>

        <article className="card border-black w-full text-left my-2">
          <span className="eyebrow">BOOKING REF</span>
          <strong className="text-2xl font-mono block">QL-1842</strong>
          <p className="text-xs font-bold mt-1">
            TUE, 3 NOVEMBER 2026 · 10:30 AM
          </p>
          <p className="text-xs text-neutral-500">{selectedService}</p>
        </article>

        <div className="mt-auto pt-6 w-full stack">
          <Button onClick={() => navigate("/appointment")}>
            View details
          </Button>
          <Button variant="quiet" onClick={() => navigate("/home")}>
            Back to home
          </Button>
        </div>
      </main>
    </>
  );
}
