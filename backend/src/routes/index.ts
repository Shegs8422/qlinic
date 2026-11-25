import { Router } from "express"
import {
  getClinics,
  getClinic,
} from "../controllers/clinicController"
import {
  register,
  login,
  sendOtp,
  verifyOtp,
  authenticateToken,
} from "../controllers/authController"
import {
  getAppointments,
  bookAppointment,
  cancelAppointment,
  getProfile,
  updateProfile,
  healthCheck,
} from "../controllers/appointmentController"

const router = Router()

// Health check
router.get("/health", healthCheck)

// Clinic routes
router.get("/clinics", getClinics)
router.get("/clinics/:id", getClinic)

// Auth routes
router.post("/auth/register", register)
router.post("/auth/login", login)
router.post("/auth/send-otp", sendOtp)
router.post("/auth/verify-otp", verifyOtp)

// Appointment routes (authenticated)
router.get("/appointments", authenticateToken, getAppointments)
router.post("/appointments", authenticateToken, bookAppointment)
router.delete("/appointments/:id", authenticateToken, cancelAppointment)

// Profile routes (authenticated)
router.get("/profile", authenticateToken, getProfile)
router.patch("/profile", authenticateToken, updateProfile)

export default router
