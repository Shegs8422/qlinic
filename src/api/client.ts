import { Clinic } from "../types"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ""
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""

let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

export function getAuthToken(): string | null {
  return authToken
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`API ${res.status}: ${body || res.statusText}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  // Clinics
  getClinics: () => request<Clinic[]>("/api/clinics"),
  getClinic: (id: string) => request<Clinic>(`/api/clinics/${id}`),

  // Appointments
  getAppointments: () => request<any[]>("/api/appointments"),
  bookAppointment: (payload: any) =>
    request<any>("/api/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  cancelAppointment: (id: string) =>
    request<void>(`/api/appointments/${id}`, { method: "DELETE" }),

  // Profile
  getProfile: () => request<any>("/api/profile"),
  updateProfile: (payload: any) =>
    request<any>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  // Auth
  sendOtp: (phone: string) =>
    request<any>("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  verifyOtp: (phone: string, code: string) =>
    request<any>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    }),

  // Config
  googleMapsApiKey: () => GOOGLE_MAPS_API_KEY,
}
