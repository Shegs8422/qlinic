import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function OnboardingProof({ onBack, onSkip }: { onBack?: () => void; onSkip?: () => void }) {
  const navigate = useNavigate();

  return (
    <main className="content">
      <div className="flex justify-between items-center pt-2">
        <button
          className="icon-button"
          aria-label="Back"
          onClick={onBack}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
        </button>
        <span className="eyebrow">STEP 2 OF 3</span>
        <button
          className="text-xs font-bold text-neutral-500"
          onClick={onSkip}
        >
          Skip
        </button>
      </div>

      <section>
        <span className="eyebrow">PLAN WITH CONFIDENCE</span>
        <h1>Know the wait before you set out.</h1>
      </section>

      <div className="stack">
        <article className="card bg-neutral-100/70 border-neutral-200">
          <div className="flex justify-between items-center">
            <strong className="text-sm font-bold">Without Qlinic</strong>
            <span className="text-xs font-bold text-neutral-500">
              More uncertainty
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Call for updates", "Wait at the clinic", "No clear ETA"].map(
              (item) => (
                <span
                  key={item}
                  className="text-xs font-semibold px-3 py-1 bg-white rounded-full border border-neutral-200"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </article>

        <article className="card border-black shadow-sm">
          <div className="flex justify-between items-center">
            <strong className="text-sm font-bold text-black">
              With Qlinic
            </strong>
            <span className="text-xs font-bold text-black">A clearer plan</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Live wait times",
              "Remote queue pass",
              "SMS turn alerts",
              "Book visits",
            ].map((item) => (
              <span
                key={item}
                className="text-xs font-bold px-3 py-1 bg-black text-white rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-auto pt-6">
        <Button onClick={() => navigate("/onboarding-steps")}>
          Show me how it works
        </Button>
      </div>
    </main>
  );
}
