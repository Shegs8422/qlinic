export type Screen =
  | "splash"
  | "onboarding-intro"
  | "onboarding-proof"
  | "onboarding-steps"
  | "auth"
  | "phone"
  | "otp"
  | "profile-setup"
  | "permissions"
  | "home"
  | "clinics"
  | "clinic"
  | "service"
  | "queue-confirm"
  | "queue"
  | "appointments"
  | "booking"
  | "appointment-confirm"
  | "appointment"
  | "visit-prep"
  | "profile"
  | "settings";

export type Clinic = {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  address: string;
  open: boolean;
  wait: string | null;
  updated: string;
  services: string[];
  rule: "remote" | "arrival" | "reception";
  phone: string;
  transit: string;
  latitude: number;
  longitude: number;
  patientsAhead: number;
};

export type PastAppointment = {
  id: string;
  date: string;
  clinic: string;
  service: string;
  doctor: string;
  status: "Completed" | "Missed";
  notes: string;
};

export type AppointmentTab = "upcoming" | "past";

export type AccessibilityPrefs = {
  highContrast: boolean;
  largeText: boolean;
  audioAnnouncements: boolean;
};

export type Reminders = {
  queue: boolean;
  appointment: boolean;
  clinic: boolean;
};

export type Permissions = {
  notifications: boolean;
  location: boolean;
};

export type VisitPrep = {
  identification: boolean;
  medication: boolean;
  records: boolean;
  transport: boolean;
};

export type Language = "en" | "sw";

export type QueueState = "Waiting" | "Called" | "Completed" | "Left";
