import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification01Icon,
  Location01Icon,
  Tick02Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";

export function PermissionsScreen({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const {
    permissions,
    setPermissions,
    reminders,
    setReminders,
  } = useSettingsStore();

  return (
    <main className="content">
      <header className="topbar">
        <div className="flex items-center gap-1 min-w-[44px]">
          <button
            className="icon-button"
            aria-label="Go back"
            onClick={onBack}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </button>
        </div>
        <div className="flex-1 text-center">
          <span className="topbar__title">Preferences</span>
        </div>
        <div className="flex items-center justify-end gap-1.5 min-w-[44px]" />
      </header>

      <section>
        <span className="eyebrow">NOTIFICATIONS</span>
        <h1>Stay one step ahead of your turn.</h1>
        <p>
          Choose the updates that help you arrive at the right time.
        </p>
      </section>

      <div className="stack">
        <button
          className={`p-4 rounded-2xl border text-left flex items-center justify-between ${
            permissions.notifications
              ? "border-black bg-neutral-50"
              : "border-neutral-200"
          }`}
          onClick={() =>
            setPermissions({ ...permissions, notifications: !permissions.notifications })
          }
          role="switch"
          aria-checked={permissions.notifications}
        >
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={Notification01Icon} size={20} />
            <div>
              <strong className="text-sm block">Queue turn alerts</strong>
              <small className="block">
                SMS when your number is within next 3
              </small>
            </div>
          </div>
          {permissions.notifications && (
            <HugeiconsIcon icon={Tick02Icon} size={18} />
          )}
        </button>

        <button
          className={`p-4 rounded-2xl border text-left flex items-center justify-between ${
            permissions.location
              ? "border-black bg-neutral-50"
              : "border-neutral-200"
          }`}
          onClick={() =>
            setPermissions({ ...permissions, location: !permissions.location })
          }
          role="switch"
          aria-checked={permissions.location}
        >
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={Location01Icon} size={20} />
            <div>
              <strong className="text-sm block">Nearby clinic sorting</strong>
              <small className="block">Show closest public centres first</small>
            </div>
          </div>
          {permissions.location && (
            <HugeiconsIcon icon={Tick02Icon} size={18} />
          )}
        </button>
      </div>

      <div className="mt-auto pt-6 stack">
        <Button onClick={() => navigate("/home")}>Finish setup</Button>
        <Button variant="quiet" onClick={() => navigate("/home")}>
          Not now
        </Button>
      </div>
    </main>
  );
}
