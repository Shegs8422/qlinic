import type { Clinic, PastAppointment } from "./types"
import { api } from "./api/client"

// ---------------------------------------------------------------------------
// Mock data (fallback when API is unavailable) — ported from original App.tsx
// ---------------------------------------------------------------------------

const MOCK_CLINICS: Clinic[] = [
  {
    id: "clinic-1",
    name: "Central Community Clinic",
    area: "Market Street · 1.2 km",
    distanceKm: 1.2,
    address: "Plot 42, Market Street, Central Ward",
    open: true,
    wait: "35–50 min",
    updated: "Updated 2 min ago",
    services: ["General outpatient", "Immunisation", "Follow-up visit", "Pharmacy"],
    rule: "remote",
    phone: "+254 20 555 0101",
    transit: "Stage 4, Market Junction (Bus 23, Matatu 11A)",
    latitude: -1.2833,
    longitude: 36.8219,
    patientsAhead: 14,
  },
  {
    id: "clinic-2",
    name: "Riverside Public Health Centre",
    area: "River Road · 2.8 km",
    distanceKm: 2.8,
    address: "18 River Road, Near Riverside Sub-County Office",
    open: true,
    wait: "15–25 min",
    updated: "Updated 8 min ago",
    services: ["Maternal and child health", "Immunisation", "General outpatient"],
    rule: "arrival",
    phone: "+254 20 555 0102",
    transit: "River Stage (Matatu 34B, Walk 3 mins)",
    latitude: -1.2815,
    longitude: 36.8292,
    patientsAhead: 6,
  },
  {
    id: "clinic-3",
    name: "Highlands Family Health Clinic",
    area: "Highlands Hill · 3.4 km",
    distanceKm: 3.4,
    address: "74 Hillside Drive, Highlands Block B",
    open: true,
    wait: "20–30 min",
    updated: "Updated 5 min ago",
    services: ["General outpatient", "Dental", "Pharmacy", "Follow-up visit"],
    rule: "remote",
    phone: "+254 20 555 0103",
    transit: "Highlands Roundabout (Bus 44)",
    latitude: -1.2725,
    longitude: 36.8075,
    patientsAhead: 8,
  },
  {
    id: "clinic-4",
    name: "St. Jude Community Dispensary",
    area: "Old Town · 1.9 km",
    distanceKm: 1.9,
    address: "St. Jude Lane, Old Town Public Square",
    open: true,
    wait: "10–20 min",
    updated: "Updated 12 min ago",
    services: ["General outpatient", "Maternal and child health", "Immunisation"],
    rule: "remote",
    phone: "+254 20 555 0104",
    transit: "Old Town Gate (Matatu 14, 18)",
    latitude: -1.2864,
    longitude: 36.8172,
    patientsAhead: 4,
  },
  {
    id: "clinic-5",
    name: "Northgate Public Clinic",
    area: "Northgate Avenue · 4.1 km",
    distanceKm: 4.1,
    address: "Building 9, Northgate Avenue, Health Zone",
    open: false,
    wait: null,
    updated: "Closed · Opens next weekday at 8:00 AM",
    services: ["General outpatient", "Follow-up visit", "Dental"],
    rule: "reception",
    phone: "+254 20 555 0105",
    transit: "Northgate Terminal (Bus 102)",
    latitude: -1.2197,
    longitude: 36.887,
    patientsAhead: 0,
  },
]

const MOCK_PAST_APPOINTMENTS: PastAppointment[] = [
  {
    id: "past-1",
    date: "Thu, 14 May 2026 · 09:30 AM",
    clinic: "Central Community Clinic",
    service: "General outpatient",
    doctor: "Dr. A. Omondi",
    status: "Completed",
    notes: "Routine checkup completed. Prescribed preventive vitamins.",
  },
  {
    id: "past-2",
    date: "Fri, 6 Feb 2026 · 11:15 AM",
    clinic: "Riverside Public Health Centre",
    service: "Immunisation",
    doctor: "Nurse M. Wanjiku",
    status: "Completed",
    notes: "Tetanus booster administered. No adverse reactions observed.",
  },
]

const AVAILABLE_APPOINTMENT_DATES = [
  "Tue, 3 November 2026",
  "Wed, 4 November 2026",
  "Thu, 5 November 2026",
  "Fri, 6 November 2026",
]

const AVAILABLE_APPOINTMENT_SLOTS = [
  "08:30 AM",
  "09:15 AM",
  "10:30 AM",
  "11:45 AM",
  "01:30 PM",
  "02:15 PM",
]

// ---------------------------------------------------------------------------
// Data service: real API with mock fallback
// ---------------------------------------------------------------------------

let clinicsCache: Clinic[] | null = null
let pastAppointmentsCache: PastAppointment[] | null = null

export const data = {
  async getClinics(): Promise<Clinic[]> {
    if (clinicsCache) return clinicsCache
    try {
      const clinics = await api.getClinics()
      clinicsCache = clinics
      return clinics
    } catch {
      clinicsCache = MOCK_CLINICS
      return MOCK_CLINICS
    }
  },

  async getClinic(id: string): Promise<Clinic | null> {
    try {
      return await api.getClinic(id)
    } catch {
      const clinics = await this.getClinics()
      return clinics.find((c) => c.id === id) || null
    }
  },

  async getPastAppointments(): Promise<PastAppointment[]> {
    if (pastAppointmentsCache) return pastAppointmentsCache
    try {
      const appts = await api.getAppointments()
      pastAppointmentsCache = appts as PastAppointment[]
      return pastAppointmentsCache
    } catch {
      pastAppointmentsCache = MOCK_PAST_APPOINTMENTS
      return MOCK_PAST_APPOINTMENTS
    }
  },

  getAvailableDates: () => AVAILABLE_APPOINTMENT_DATES,
  getAvailableSlots: () => AVAILABLE_APPOINTMENT_SLOTS,

  async bookAppointment(payload: any): Promise<any> {
    try {
      return await api.bookAppointment(payload)
    } catch {
      return { ref: "QL-1842", status: "confirmed" }
    }
  },

  async getProfile(): Promise<any> {
    try {
      return await api.getProfile()
    } catch {
      return null
    }
  },

  googleMapsApiKey: () => api.googleMapsApiKey(),
}
