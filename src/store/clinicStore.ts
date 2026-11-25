import { create } from "zustand";
import type { Clinic } from "../types";

type ServiceFilter = "All" | string;

interface ClinicState {
  clinics: Clinic[];
  query: string;
  serviceFilter: ServiceFilter;
  openOnly: boolean;
  shortest: boolean;
  remoteOnly: boolean;
  isLoading: boolean;
  error: string | null;
  selectedClinic: Clinic | null;

  setClinics: (clinics: Clinic[]) => void;
  setQuery: (q: string) => void;
  setServiceFilter: (f: ServiceFilter) => void;
  setOpenOnly: (v: boolean) => void;
  setShortest: (v: boolean) => void;
  setRemoteOnly: (v: boolean) => void;
  setSelectedClinic: (c: Clinic | null) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  clearFilters: () => void;
  getFiltered: () => Clinic[];
}

export const useClinicStore = create<ClinicState>((set, get) => ({
  clinics: [],
  query: "",
  serviceFilter: "All",
  openOnly: false,
  shortest: false,
  remoteOnly: false,
  isLoading: false,
  error: null,
  selectedClinic: null,

  setClinics: (clinics) => set({ clinics, error: null }),
  setQuery: (q) => set({ query: q }),
  setServiceFilter: (f) => set({ serviceFilter: f }),
  setOpenOnly: (v) => set({ openOnly: v }),
  setShortest: (v) => set({ shortest: v }),
  setRemoteOnly: (v) => set({ remoteOnly: v }),
  setSelectedClinic: (c) => set({ selectedClinic: c }),
  setLoading: (v) => set({ isLoading: v }),
  setError: (e) => set({ error: e }),

  clearFilters: () =>
    set({
      query: "",
      openOnly: false,
      shortest: false,
      remoteOnly: false,
      serviceFilter: "All",
    }),

  getFiltered: () => {
    const { clinics, query, serviceFilter, openOnly, shortest, remoteOnly } =
      get();

    let list = clinics.filter((clinic) => {
      const matchesQuery =
        query.trim() === "" ||
        `${clinic.name} ${clinic.area} ${clinic.services.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesOpen = !openOnly || clinic.open;
      const matchesRemote = !remoteOnly || clinic.rule === "remote";
      const matchesService =
        serviceFilter === "All" || clinic.services.includes(serviceFilter);
      return matchesQuery && matchesOpen && matchesRemote && matchesService;
    });

    if (shortest) {
      list = [...list].sort((a, b) => {
        if (!a.wait) return 1;
        if (!b.wait) return -1;
        return parseInt(a.wait) - parseInt(b.wait);
      });
    } else {
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return list;
  },
}));
