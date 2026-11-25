import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useQueueStore } from "../store/queueStore";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";
import { Badge } from "../components/Badge";

export function QueueConfirmScreen() {
  const navigate = useNavigate();
  const {
    queueNumber,
    selectedService,
    selectedClinic,
    setActive,
    setQueueNumber,
    setSelectedClinic: setQueueClinic,
    setSelectedService: setQueueService,
  } = useQueueStore();

  const handleViewQueue = () => {
    setActive(true);
    setQueueNumber(queueNumber);
    setQueueClinic(selectedClinic);
    setQueueService(selectedService);
    navigate("/queue");
  };

  return (
    <>
      <TopBar backTo="/service" showActions={false} />
      <main className="content items-center text-center">
        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center my-2">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} />
        </div>

        <Badge tone="success">Ticket Issued</Badge>
        <h1>You're in the queue</h1>
        <p className="text-xs text-neutral-500">
          Your number is logged in {selectedClinic?.name}'s digital triage.
        </p>

        <article className="ticket-pass w-full my-2">
          <span className="eyebrow text-neutral-400">DIGITAL QUEUE TICKET</span>
          <strong className="ticket-number block my-2">{queueNumber}</strong>
          <p className="text-neutral-300 font-bold text-xs">
            {selectedService}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-dashed border-white/20 text-left">
            <div>
              <span className="text-[11px] font-mono text-neutral-400 block">
                Patients ahead
              </span>
              <strong className="text-white text-base">
                {selectedClinic?.patientsAhead}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-neutral-400 block">
                Estimated wait
              </span>
              <strong className="text-white text-base">
                {selectedClinic?.wait || "Unavailable"}
              </strong>
            </div>
          </div>
        </article>

        <div className="w-full flex gap-2">
          <Button variant="secondary" onClick={() => {
            // show QR
          }}>
            Show QR pass
          </Button>
        </div>

        <div className="mt-auto pt-6 stack">
          <Button onClick={handleViewQueue}>
            View live queue
          </Button>
          <Button variant="quiet" onClick={() => navigate("/home")}>
            Back to home
          </Button>
        </div>
      </main>
    </>
  );
}
