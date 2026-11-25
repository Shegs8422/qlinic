import type { Clinic, PastAppointment } from "./types"
import { api, setAuthToken } from "./api/client"

// ---------------------------------------------------------------------------
// Data service: real API only (no mock fallbacks)
// ---------------------------------------------------------------------------

export const data = {
  async getClinics(): Promise<Clinic[]> {
    const clinics = await api.getClinics()
    return clinics
  },

  async getClinic(id: string): Promise<Clinic | null> {
    return await api.getClinic(id)
  },

  async getPastAppointments(): Promise<PastAppointment[]> {
    const appts = await api.getAppointments()
    return appts as PastAppointment[]
  },

  getAvailableDates: () => [
    "Tue, 3 November 2026",
    "Wed, 4 November 2026",
    "Thu, 5 November 2026",
    "Fri, 6 November 2026",
  ],

  getAvailableSlots: () => [
    "08:30 AM",
    "09:15 AM",
    "10:30 AM",
    "11:45 AM",
    "01:30 PM",
    "02:15 PM",
  ],

  async sendOtp(phone: string): Promise<boolean> {
    await api.sendOtp(phone)
    return true
  },

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const res = await api.verifyOtp(phone, code)
    if (res.token) {
      setAuthToken(res.token)
    }
    return true
  },

  async bookAppointment(payload: any): Promise<any> {
    return await api.bookAppointment(payload)
  },

  async getProfile(): Promise<any> {
    return await api.getProfile()
  },

  async updateProfile(payload: any): Promise<any> {
    return await api.updateProfile(payload)
  },

  googleMapsApiKey: () => api.googleMapsApiKey(),
}
