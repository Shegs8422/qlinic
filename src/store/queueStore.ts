import { create } from "zustand";
import type { Clinic, PastAppointment, QueueState } from "../types";

interface QueueStateStore {
  active: boolean;
  queueNumber: string;
  queueState: QueueState;
  selectedClinic: Clinic | null;
  selectedService: string | null;
  selectedPastAppt: PastAppointment | null;
  patientsAhead: number;
  estimatedWait: string | null;
  showQrTicket: boolean;
  showLeaveDialog: boolean;
  lastRefreshed: number;

  setActive: (v: boolean) => void;
  setQueueNumber: (v: string) => void;
  setQueueState: (v: QueueState) => void;
  setSelectedClinic: (c: Clinic | null) => void;
  setSelectedService: (s: string | null) => void;
  setSelectedPastAppt: (a: PastAppointment | null) => void;
  setPatientsAhead: (n: number) => void;
  setEstimatedWait: (w: string | null) => void;
  setShowQrTicket: (v: boolean) => void;
  setShowLeaveDialog: (v: boolean) => void;
  setLastRefreshed: () => void;
  reset: () => void;
}

export const useQueueStore = create<QueueStateStore>((set) => ({
  active: false,
  queueNumber: "OPD-024",
  queueState: "Waiting",
  selectedClinic: null,
  selectedService: null,
  selectedPastAppt: null,
  patientsAhead: 0,
  estimatedWait: null,
  showQrTicket: false,
  showLeaveDialog: false,
  lastRefreshed: 0,

  setActive: (v) => set({ active: v }),
  setQueueNumber: (v) => set({ queueNumber: v }),
  setQueueState: (v) => set({ queueState: v }),
  setSelectedClinic: (c) => set({ selectedClinic: c }),
  setSelectedService: (s) => set({ selectedService: s }),
  setSelectedPastAppt: (a) => set({ selectedPastAppt: a }),
  setPatientsAhead: (n) => set({ patientsAhead: n }),
  setEstimatedWait: (w) => set({ estimatedWait: w }),
  setShowQrTicket: (v) => set({ showQrTicket: v }),
  setShowLeaveDialog: (v) => set({ showLeaveDialog: v }),
  setLastRefreshed: () => set({ lastRefreshed: Date.now() }),
  reset: () =>
    set({
      active: false,
      queueNumber: "OPD-024",
      queueState: "Waiting",
      selectedClinic: null,
      selectedService: null,
      selectedPastAppt: null,
      patientsAhead: 0,
      estimatedWait: null,
      showQrTicket: false,
      showLeaveDialog: false,
      lastRefreshed: 0,
    }),
}));
