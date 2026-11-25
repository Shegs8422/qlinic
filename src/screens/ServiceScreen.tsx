import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useQueueStore } from "../store/queueStore";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";

export function ServiceScreen() {
  const navigate = useNavigate();
  const {
    selectedClinic,
    setSelectedService: setQueueService,
  } = useQueueStore();

  const services = selectedClinic?.services || ["General outpatient"];
  const selectedService = services[0];

  return (
    <>
      <TopBar
        title="Select Department"
        backTo="/clinics"
      />
      <main className="content">
        <section>
          <span className="eyebrow">{selectedClinic?.name}</span>
          <h1>What care do you need?</h1>
          <p>Choose the clinical service for your visit ticket.</p>
        </section>

        <div className="stack">
          {services.map((svc) => (
            <button
              key={svc}
              className={`p-4 rounded-2xl border text-left font-bold text-sm flex items-center justify-between ${
                selectedService === svc
                  ? "border-black bg-neutral-50"
                  : "border-neutral-200 bg-white"
              }`}
              onClick={() => setQueueService(svc)}
              aria-pressed={selectedService === svc}
            >
              <span>{svc}</span>
              {selectedService === svc && (
                <HugeiconsIcon icon={Tick02Icon} size={18} />
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <Button
            disabled={!selectedService}
            onClick={() => {
              const queueNumber = "OPD-" + Math.floor(100 + Math.random() * 900);
              localStorage.setItem("queueNumber", queueNumber);
              navigate("/queue-confirm");
            }}
          >
            Confirm and issue ticket
          </Button>
        </div>
      </main>
    </>
  );
}
