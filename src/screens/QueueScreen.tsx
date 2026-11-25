import { HugeiconsIcon } from "@hugeicons/react";
import {
  Ticket01Icon,
  QrCodeIcon,
  RefreshIcon,
  TaskDone01Icon,
  Directions01Icon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useQueueStore } from "../store/queueStore";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { TopBar } from "../components/TopBar";

export function QueueScreen() {
  const navigate = useNavigate();
  const {
    active,
    queueState,
    queueNumber,
    selectedService,
    selectedClinic,
    showQrTicket,
    setShowQrTicket,
    setShowLeaveDialog,
  } = useQueueStore();
  const { notify } = useSettingsStore();

  if (!active) {
    return (
      <>
        <TopBar
          title="Digital Queue"
        />
        <main className="content content--with-nav items-center justify-center text-center">
          <HugeiconsIcon icon={Ticket01Icon} size={48} />
          <h2 className="mt-3">No active queue ticket</h2>
          <p className="text-xs max-w-xs mx-auto">
            Join a queue from a clinic page and your ticket will appear here.
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate("/clinics")}>
              Browse public clinics
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar
        title="Live Queue"
      />
      <main className="content content--with-nav">
        <article className="ticket-pass flex flex-col items-center gap-3 text-center">
          <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs font-bold text-neutral-300 uppercase">
              STATUS
            </span>
            <Badge tone="light">{queueState}</Badge>
          </div>

          <span className="eyebrow text-neutral-400 mt-2">
            YOUR TICKET NUMBER
          </span>
          <strong className="ticket-number">{queueNumber}</strong>
          <p className="text-xs font-bold text-neutral-300">
            {selectedService} · {selectedClinic?.name}
          </p>

          <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-dashed border-white/20">
            <div className="text-left">
              <span className="text-[11px] font-mono uppercase text-neutral-400 block">
                Est. Wait
              </span>
              <strong className="text-base text-white">
                <span className="t-subtle-number is-animating" style={{ "--subtle-dir": "1" } as React.CSSProperties}>
                  <span className="t-subtle-slot">
                    <span className="t-subtle-old" aria-hidden="true">0</span>
                    <span className="t-subtle-new">
                      {selectedClinic?.wait || "Unavailable"}
                    </span>
                  </span>
                </span>
              </strong>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono uppercase text-neutral-400 block">
                Ahead
              </span>
              <strong className="text-base text-white">
                <span className="t-subtle-number is-animating" style={{ "--subtle-dir": "1" } as React.CSSProperties}>
                  <span className="t-subtle-slot">
                    <span className="t-subtle-old" aria-hidden="true">0</span>
                    <span className="t-subtle-new">
                      {selectedClinic?.patientsAhead}
                    </span>
                  </span>
                </span>
              </strong>
            </div>
          </div>

          <button
            className="mt-2 w-full py-3 rounded-full bg-white text-black font-extrabold text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
            onClick={() => setShowQrTicket(true)}
          >
            <HugeiconsIcon icon={QrCodeIcon} size={15} />
            <span>Show QR pass</span>
          </button>
        </article>

        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-neutral-500 font-mono">
            Updated just now
          </span>
          <button
            className="text-xs font-bold underline flex items-center gap-1"
            onClick={() => notify("Queue updated from clinic server")}
          >
            <HugeiconsIcon icon={RefreshIcon} size={14} />
            <span>Refresh</span>
          </button>
        </div>

        <Button
          onClick={() => navigate("/visit-prep")}
          icon={<HugeiconsIcon icon={TaskDone01Icon} size={18} />}
        >
          Check visit readiness
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            // directions modal
          }}
        >
          Clinic transit & directions
        </Button>

        <Button variant="danger" onClick={() => setShowLeaveDialog(true)}>
          Leave queue
        </Button>
      </main>
    </>
  );
}
