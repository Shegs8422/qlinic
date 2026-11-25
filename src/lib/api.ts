import type { Clinic } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE || "https://api.qlinic.local";

let cachedClinics: Clinic[] | null = null;
let clinicsFetchedAt: number | null = null;
const CLINICS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const api = {
  async getClinics(): Promise<Clinic[]> {
    const now = Date.now();
    if (
      cachedClinics &&
      clinicsFetchedAt &&
      now - clinicsFetchedAt < CLINICS_CACHE_TTL
    ) {
      return cachedClinics;
    }

    try {
      const res = await fetch(`${API_BASE}/clinics`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`Clinics fetch failed: ${res.status}`);
      const data = (await res.json()) as Clinic[];
      cachedClinics = data;
      clinicsFetchedAt = now;
      return data;
    } catch (err) {
      // Fallback to cached data even if expired
      if (cachedClinics) return cachedClinics;
      throw err;
    }
  },

  async getClinic(id: string): Promise<Clinic> {
    const clinics = await this.getClinics();
    const clinic = clinics.find((c) => c.id === id);
    if (!clinic) throw new Error(`Clinic ${id} not found`);
    return clinic;
  },

  async joinQueue(clinicId: string, service: string): Promise<{
    ticketNumber: string;
    patientsAhead: number;
    estimatedWait: string | null;
  }> {
    const res = await fetch(`${API_BASE}/queue/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinicId, service }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Join queue failed: ${res.status}`);
    return res.json();
  },

  async leaveQueue(): Promise<void> {
    const res = await fetch(`${API_BASE}/queue/leave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Leave queue failed: ${res.status}`);
  },

  async bookAppointment(payload: {
    clinicId: string;
    service: string;
    date: string;
    time: string;
  }): Promise<{ reference: string }> {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Booking failed: ${res.status}`);
    return res.json();
  },
};
