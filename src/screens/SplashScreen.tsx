import { HugeiconsIcon } from "@hugeicons/react";
import { StethoscopeIcon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";

export function SplashScreen({ onStart }: { onStart: () => void }) {
  const navigate = useNavigate();

  const handleStart = () => {
    onStart();
    navigate("/onboarding-intro");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-3 bg-white">
      <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white shadow-xl mb-2">
        <HugeiconsIcon icon={StethoscopeIcon} size={30} />
      </div>
      <button
        className="text-4xl font-extrabold tracking-tighter"
        onClick={handleStart}
      >
        Qlinic
      </button>
      <p className="text-xs font-bold tracking-widest uppercase text-neutral-400">
        Know the wait. Keep your day.
      </p>
    </main>
  );
}
