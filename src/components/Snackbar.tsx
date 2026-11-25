import { useSettingsStore } from "../store/settingsStore";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";

export function Snackbar() {
  const { snackbarMessage, setSnackbarMessage } = useSettingsStore();
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (!snackbarMessage) {
      setToastOpen(false);
      return;
    }
    // Reset and re-animate the toast on each new message
    setToastOpen(false);
    requestAnimationFrame(() => setToastOpen(true));
    const timer = setTimeout(() => setSnackbarMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [snackbarMessage, setSnackbarMessage]);

  if (!snackbarMessage) return null;

  return (
    <div
      className={`snackbar t-toast ${toastOpen ? "is-open" : ""}`}
      role="status"
      aria-live="polite"
    >
      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
      <span>{snackbarMessage}</span>
    </div>
  );
}
