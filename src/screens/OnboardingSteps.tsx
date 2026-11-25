import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Search01Icon,
  Ticket01Icon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

const steps = [
  {
    num: "01",
    title: "Find the right clinic",
    desc: "Compare estimated waits and available services nearby.",
    icon: Search01Icon,
  },
  {
    num: "02",
    title: "Choose your visit",
    desc: "Join a digital queue or reserve an appointment time.",
    icon: Ticket01Icon,
  },
  {
    num: "03",
    title: "Arrive with confidence",
    desc: "Follow updates and head in when your turn is close.",
    icon: Notification01Icon,
  },
];

export function OnboardingSteps({ onBack, onGetStarted }: { onBack?: () => void; onGetStarted?: () => void }) {
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
        <span className="eyebrow">STEP 3 OF 3</span>
        <button
          className="text-xs font-bold text-neutral-500"
          onClick={onGetStarted}
        >
          Skip
        </button>
      </div>

      <section>
        <h1>From search to care in three steps.</h1>
        <p>A clearer clinic visit, from the moment you start planning.</p>
      </section>

      <div className="stack">
        {steps.map((st) => (
          <div
            key={st.num}
            className="p-4 rounded-2xl border border-neutral-200 flex items-center gap-4 bg-white"
          >
            <span className="font-mono text-lg font-extrabold text-black">
              {st.num}
            </span>
            <div className="flex-1">
              <h3 className="text-sm">{st.title}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{st.desc}</p>
            </div>
            <HugeiconsIcon icon={st.icon} size={20} />
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Button onClick={() => navigate("/auth")}>Get started</Button>
      </div>
    </main>
  );
}
