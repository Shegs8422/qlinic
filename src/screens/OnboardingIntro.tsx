import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function OnboardingIntro({ onSkip }: { onSkip?: () => void }) {
  const navigate = useNavigate();

  return (
    <main className="content">
      <div className="flex justify-between items-center pt-2">
        <span className="eyebrow">STEP 1 OF 3</span>
        <button
          className="text-xs font-bold text-neutral-500"
          onClick={onSkip}
        >
          Skip
        </button>
      </div>

      <div className="onboarding-hero-media">
        <img
          src="/qlinic-onboarding.jpeg"
          alt="A patient receiving care in a bright clinic treatment room"
          loading="eager"
        />
      </div>

      <section>
        <span className="eyebrow">CARE, ON YOUR TIME</span>
        <h1>Spend less time waiting for care.</h1>
        <p>
          See estimated clinic waits, join a queue from wherever you are, and
          arrive closer to your turn.
        </p>
      </section>

      <div className="mt-auto pt-6 stack">
        <Button onClick={() => navigate("/onboarding-proof")}>
          See how Qlinic helps
        </Button>
      </div>
    </main>
  );
}
