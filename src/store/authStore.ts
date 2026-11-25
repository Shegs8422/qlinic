import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "../types";
import { nameSchema } from "../lib/validators";

interface AuthState {
  email: string;
  fullName: string;
  clinicId: string;
  language: Language;
  isAuthenticated: boolean;
  authError: string;

  setEmail: (v: string) => void;
  setFullName: (v: string) => void;
  setClinicId: (v: string) => void;
  setLanguage: (v: Language) => void;
  setAuthError: (v: string) => void;
  setAuthenticated: (v: boolean) => void;
  validateName: () => boolean;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      email: "",
      fullName: "Amina Kamau",
      clinicId: "SHA-9482-108",
      language: "en",
      isAuthenticated: false,
      authError: "",

      setEmail: (v) => set({ email: v }),
      setFullName: (v) => set({ fullName: v }),
      setClinicId: (v) => set({ clinicId: v }),
      setLanguage: (v) => set({ language: v }),
      setAuthError: (v) => set({ authError: v }),
      setAuthenticated: (v) => set({ isAuthenticated: v }),

      validateName: () => {
        try {
          nameSchema.parse(get().fullName);
          return true;
        } catch {
          return false;
        }
      },

      reset: () =>
        set({
          email: "",
          authError: "",
          isAuthenticated: false,
        }),
    }),
    {
      name: "qlinic-auth-storage",
      partialize: (state) => ({
        email: state.email,
        fullName: state.fullName,
        clinicId: state.clinicId,
        language: state.language,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
