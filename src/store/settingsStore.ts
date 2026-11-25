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
  notifications: Array<{ id: string; message: string }>;
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
      theme: "light",
      showLeaveDialog: false,
      showCancelDialog: false,
      showQrTicket: false,
      showDirectionsModal: null,
      showPersonalDetailsModal: false,
      showLanguageModal: false,
      showAccessibilityModal: false,
      showHelpModal: false,
      showSignOutModal: false,
      notifications: [],
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
      setSnackbarMessage: (msg) => {
        if (msg === null) return;
        set((prev) => ({
          notifications: [{ id: Math.random().toString(36).slice(2), message: msg }, ...prev.notifications].slice(0, 4),
        }));
      },
      setReturnScreen: (key, v) => set({ [key]: v }),

      notify: (msg, duration = 2600) => {
        const id = Math.random().toString(36).slice(2);
        set((prev) => ({
          notifications: [{ id, message: msg }, ...prev.notifications].slice(0, 4),
        }));
        if (get().accessibility.audioAnnouncements && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
        }
        setTimeout(() => {
          set((prev) => ({
            notifications: prev.notifications.filter((n) => n.id !== id),
          }));
        }, duration);
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
