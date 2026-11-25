import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccessibilityPrefs, Reminders, Permissions, VisitPrep, Clinic } from "../types";

interface SettingsState {
  reminders: Reminders;
  permissions: Permissions;
  accessibility: AccessibilityPrefs;
  visitPrep: VisitPrep;
  theme: "dark" | "light" | "high-contrast";
  showLeaveDialog: boolean;
  showCancelDialog: boolean;
  showQrTicket: boolean;
  showDirectionsModal: Clinic | null;
  showPersonalDetailsModal: boolean;
  showLanguageModal: boolean;
  showAccessibilityModal: boolean;
  showHelpModal: boolean;
  showSignOutModal: boolean;
  snackbarMessage: string | null;
  settingsReturnScreen: string;
  profileReturnScreen: string;
  bookingReturnScreen: string;
  clinicReturnScreen: string;
  visitPrepReturnScreen: string;

  setReminders: (v: Partial<Reminders>) => void;
  setPermissions: (v: Partial<Permissions>) => void;
  setAccessibility: (v: Partial<AccessibilityPrefs>) => void;
  setVisitPrep: (v: Partial<VisitPrep>) => void;
  setTheme: (t: "dark" | "light" | "high-contrast") => void;
  setShowLeaveDialog: (v: boolean) => void;
  setShowCancelDialog: (v: boolean) => void;
  setShowQrTicket: (v: boolean) => void;
  setShowDirectionsModal: (v: Clinic | null) => void;
  setShowPersonalDetailsModal: (v: boolean) => void;
  setShowLanguageModal: (v: boolean) => void;
  setShowAccessibilityModal: (v: boolean) => void;
  setShowHelpModal: (v: boolean) => void;
  setShowSignOutModal: (v: boolean) => void;
  setSnackbarMessage: (msg: string | null) => void;
  setReturnScreen: (key: keyof SettingsState, v: string) => void;
  notify: (msg: string, duration?: number) => void;
  resetVisitPrep: () => void;
}

const defaultReminders: Reminders = { queue: true, appointment: true, clinic: false };
const defaultPermissions: Permissions = { notifications: true, location: true };
const defaultAccessibility: AccessibilityPrefs = {
  highContrast: true,
  largeText: false,
  audioAnnouncements: false,
};
const defaultVisitPrep: VisitPrep = {
  identification: true,
  medication: false,
  records: false,
  transport: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      reminders: defaultReminders,
      permissions: defaultPermissions,
      accessibility: defaultAccessibility,
      visitPrep: defaultVisitPrep,
      theme: "dark",
      showLeaveDialog: false,
      showCancelDialog: false,
      showQrTicket: false,
      showDirectionsModal: null,
      showPersonalDetailsModal: false,
      showLanguageModal: false,
      showAccessibilityModal: false,
      showHelpModal: false,
      showSignOutModal: false,
      snackbarMessage: null,
      settingsReturnScreen: "home",
      profileReturnScreen: "home",
      bookingReturnScreen: "appointments",
      clinicReturnScreen: "clinics",
      visitPrepReturnScreen: "home",

      setReminders: (v) => set({ reminders: { ...get().reminders, ...v } }),
      setPermissions: (v) => set({ permissions: { ...get().permissions, ...v } }),
      setAccessibility: (v) =>
        set({ accessibility: { ...get().accessibility, ...v } }),
      setVisitPrep: (v) => set({ visitPrep: { ...get().visitPrep, ...v } }),
      setTheme: (t) => set({ theme: t }),
      setShowLeaveDialog: (v) => set({ showLeaveDialog: v }),
      setShowCancelDialog: (v) => set({ showCancelDialog: v }),
      setShowQrTicket: (v) => set({ showQrTicket: v }),
      setShowDirectionsModal: (v) => set({ showDirectionsModal: v }),
      setShowPersonalDetailsModal: (v) => set({ showPersonalDetailsModal: v }),
      setShowLanguageModal: (v) => set({ showLanguageModal: v }),
      setShowAccessibilityModal: (v) => set({ showAccessibilityModal: v }),
      setShowHelpModal: (v) => set({ showHelpModal: v }),
      setShowSignOutModal: (v) => set({ showSignOutModal: v }),
      setSnackbarMessage: (msg) => set({ snackbarMessage: msg }),
      setReturnScreen: (key, v) => set({ [key]: v }),

      notify: (msg, duration = 2600) => {
        set({ snackbarMessage: msg });
        if (get().accessibility.audioAnnouncements && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
        }
        setTimeout(() => set({ snackbarMessage: null }), duration);
      },

      resetVisitPrep: () => set({ visitPrep: defaultVisitPrep }),
    }),
    {
      name: "qlinic-settings-storage",
      partialize: (state) => ({
        reminders: state.reminders,
        permissions: state.permissions,
        accessibility: state.accessibility,
        visitPrep: state.visitPrep,
        theme: state.theme,
      }),
    }
  )
);
