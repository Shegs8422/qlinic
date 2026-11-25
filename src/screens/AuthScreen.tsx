import { HugeiconsIcon } from "@hugeicons/react";
import { StethoscopeIcon, ShieldCheckIcon, Notification01Icon, MailIcon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function AuthScreen({ onBrowse }: { onBrowse?: () => void }) {
  const navigate = useNavigate();

  return (
    <main className="content pt-8">
      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white mb-2">
        <HugeiconsIcon icon={StethoscopeIcon} size={22} />
      </div>

      <section>
        <span className="eyebrow">WELCOME</span>
        <h1>Your clinic visit, easier to manage.</h1>
        <p>
          Sign in to join digital queues, book appointments, and receive timely
          updates.
        </p>
      </section>

      <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 stack text-xs font-semibold text-neutral-700">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={ShieldCheckIcon} size={18} />
          <span>Patient records are private and encrypted</span>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Notification01Icon} size={18} />
          <span>Email alerts dispatched before your number is called</span>
        </div>
      </div>

      <div className="mt-auto pt-8 stack">
        <Button
          onClick={() => navigate("/sign-in")}
          icon={<HugeiconsIcon icon={MailIcon} size={18} />}
        >
          Sign in with email
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate("/sign-up")}
          icon={<HugeiconsIcon icon={MailIcon} size={18} />}
        >
          Create account with email
        </Button>
        <Button variant="secondary" onClick={() => {
          onBrowse?.();
          navigate("/clinics");
        }}>
          Browse clinics without signing in
        </Button>
      </div>
    </main>
  );
}
