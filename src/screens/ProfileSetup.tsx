import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/Button";

export function ProfileSetup({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const {
    fullName,
    setFullName,
    clinicId,
    setClinicId,
    validateName,
  } = useAuthStore();

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
          <span className="topbar__title">Profile Setup</span>
        </div>
        <div className="flex items-center justify-end gap-1.5 min-w-[44px]" />
      </header>

      <section>
        <span className="eyebrow">PATIENT RECORD</span>
        <h1>How should clinic staff identify you?</h1>
        <p>
          Use the name shown on your clinic booklet or national ID.
        </p>
      </section>

      <label className="auth-field">
        <span>Full Patient Name</span>
        <input
          autoComplete="name"
          placeholder="e.g. Amina Kamau"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </label>

      <label className="auth-field">
        <span>Clinic Booklet or National ID (Optional)</span>
        <input
          placeholder="e.g. SHA-9482-108"
          value={clinicId}
          onChange={(e) => setClinicId(e.target.value)}
        />
      </label>

      <div className="mt-auto pt-6">
        <Button
          disabled={!validateName()}
          onClick={() => navigate("/permissions")}
        >
          Continue
        </Button>
      </div>
    </main>
  );
}

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
