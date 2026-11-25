import { Request, Response } from "express"
import prisma from "../db"
import { z } from "zod"
import { authenticateToken, JWT_SECRET } from "./authController"
import jwt from "jsonwebtoken"

// GET /api/appointments - List user appointments
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" })
    }

    const appointments = await prisma.appointment.findMany({
      where: { userId },
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const formatted = appointments.map((a) => ({
      id: a.id,
      clinic: a.clinic.name,
      service: a.service,
      doctor: a.doctor || "General Practitioner",
      status: a.status,
      date: a.appointmentDate.toISOString(),
      time: a.appointmentTime,
      ref: a.bookingRef,
      notes: a.notes,
    }))

    res.json(formatted)
  } catch (error) {
    console.error("Get appointments error:", error)
    res.status(500).json({ error: "Failed to fetch appointments" })
  }
}

// POST /api/appointments - Book appointment
export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId
    const {
      clinicId,
      service,
      date,
      time,
      notes,
    } = req.body

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" })
    }

    if (!clinicId || !service || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    })

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" })
    }

    const bookingRef = `QL-${Math.floor(1000 + Math.random() * 9000)}`

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        clinicId,
        service,
        appointmentDate: new Date(date),
        appointmentTime: time,
        bookingRef,
        notes,
        status: "CONFIRMED",
      },
      include: {
        clinic: {
          select: { name: true, address: true, phone: true },
        },
      },
    })

    // Create past appointment record
    await prisma.pastAppointment.create({
      data: {
        userId,
        clinicId,
        service,
        doctor: "General Practitioner",
        status: "Completed",
        date: new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        notes,
      },
    })

    res.status(201).json({
      id: appointment.id,
      ref: appointment.bookingRef,
      status: appointment.status,
      clinic: appointment.clinic.name,
      service: appointment.service,
      date: appointment.appointmentDate,
      time: appointment.appointmentTime,
    })
  } catch (error) {
    console.error("Book appointment error:", error)
    res.status(500).json({ error: "Failed to book appointment" })
  }
}

// DELETE /api/appointments/:id - Cancel appointment
export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId
    const { id } = req.params

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" })
    }

    const appointment = await prisma.appointment.findFirst({
      where: { id, userId },
    })

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" })
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
    })

    res.json({ message: "Appointment cancelled" })
  } catch (error) {
    console.error("Cancel appointment error:", error)
    res.status(500).json({ error: "Failed to cancel appointment" })
  }
}

// GET /api/profile - Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reminders: true,
        permissions: true,
        accessibility: true,
        visitPrep: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      clinicId: user.clinicId,
      email: user.email,
      language: user.language.toLowerCase(),
      role: user.role,
      reminders: user.reminders[0] || null,
      permissions: user.permissions[0] || null,
      accessibility: user.accessibility[0] || null,
      visitPrep: user.visitPrep[0] || null,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ error: "Failed to fetch profile" })
  }
}

// PATCH /api/profile - Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId
    const { fullName, phone, clinicId, language } = req.body

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(clinicId && { clinicId }),
        ...(language && { language: language === "sw" ? "SW" : "EN" }),
      },
    })

    res.json({
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      clinicId: user.clinicId,
      email: user.email,
      language: user.language.toLowerCase(),
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ error: "Failed to update profile" })
  }
}

// GET /api/health - Health check
export const healthCheck = async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: "healthy", timestamp: new Date().toISOString() })
  } catch (error) {
    res.status(503).json({ status: "unhealthy", error: "Database connection failed" })
  }
}
