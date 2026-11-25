import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";

export function ProfileScreen() {
  const navigate = useNavigate();
  const {
    fullName,
    email,
    clinicId,
    language,
  } = useAuthStore();
  const {
    setShowPersonalDetailsModal,
    setShowLanguageModal,
    setShowAccessibilityModal,
    setShowHelpModal,
    setShowSignOutModal,
  } = useSettingsStore();

  return (
    <>
      <TopBar
        title="Patient Profile"
        backTo="/home"
        showActions={false}
      />
      <main className="content">
        <article className="card card--dark flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-lg">
            {fullName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base text-white">{fullName}</h2>
            <p className="text-xs text-neutral-400">{email}</p>
            <span className="text-[11px] font-sans text-neutral-400 block mt-0.5">
              ID: {clinicId}
            </span>
          </div>
        </article>

        <section>
          <h2>Preferences</h2>
          <div className="list-card">
            <button
              className="list-row justify-between"
              onClick={() => setShowPersonalDetailsModal(true)}
            >
              <span>Personal details & ID</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </button>
            <button
              className="list-row justify-between"
              onClick={() => setShowLanguageModal(true)}
            >
              <span>
                Language ({language === "en" ? "English" : "Kiswahili"})
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </button>
            <button
              className="list-row justify-between"
              onClick={() => setShowAccessibilityModal(true)}
            >
              <span>Accessibility settings</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </button>
            <button
              className="list-row justify-between"
              onClick={() => setShowHelpModal(true)}
            >
              <span>Clinic hotlines & FAQ</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </button>
          </div>
        </section>

        <div className="mt-auto pt-6 stack">
          <Button variant="danger" onClick={() => setShowSignOutModal(true)}>
            Sign out
          </Button>
        </div>
      </main>
    </>
  );
}
