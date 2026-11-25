import { Request, Response } from "express"
import prisma from "../db"
import { z } from "zod"

// GET /api/clinics - List all clinics with filters
export const getClinics = async (req: Request, res: Response) => {
  try {
    const {
      query,
      service,
      openOnly,
      remoteOnly,
      shortest,
      sortBy = "distance",
    } = req.query

    const where: any = {}

    if (query) {
      where.OR = [
        { name: { contains: String(query), mode: "insensitive" } },
        { area: { contains: String(query), mode: "insensitive" } },
        { address: { contains: String(query), mode: "insensitive" } },
      ]
    }

    if (openOnly === "true") {
      where.open = true
    }

    if (remoteOnly === "true") {
      where.rule = "REMOTE"
    }

    const clinics = await prisma.clinic.findMany({
      where,
      include: {
        services: { select: { name: true } },
        directions: true,
      },
      orderBy:
        shortest === "true"
          ? { wait: "asc" }
          : sortBy === "distance"
            ? { distanceKm: "asc" }
            : { name: "asc" },
    })

    // Format response to match frontend expectations
    const formatted = clinics.map((clinic) => ({
      id: clinic.id,
      name: clinic.name,
      area: clinic.area,
      distanceKm: clinic.distanceKm,
      address: clinic.address,
      open: clinic.open,
      wait: clinic.wait,
      updated: clinic.updated,
      rule: clinic.rule,
      phone: clinic.phone,
      transit: clinic.directions?.transit || clinic.transit,
      latitude: clinic.latitude,
      longitude: clinic.longitude,
      patientsAhead: clinic.patientsAhead,
      services: clinic.services.map((s) => s.name),
    }))

    res.json(formatted)
  } catch (error) {
    console.error("Get clinics error:", error)
    res.status(500).json({ error: "Failed to fetch clinics" })
  }
}

// GET /api/clinics/:id - Get single clinic
export const getClinic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        services: { select: { name: true } },
        directions: true,
      },
    })

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" })
    }

    res.json({
      id: clinic.id,
      name: clinic.name,
      area: clinic.area,
      distanceKm: clinic.distanceKm,
      address: clinic.address,
      open: clinic.open,
      wait: clinic.wait,
      updated: clinic.updated,
      rule: clinic.rule,
      phone: clinic.phone,
      transit: clinic.directions?.transit || clinic.transit,
      latitude: clinic.latitude,
      longitude: clinic.longitude,
      patientsAhead: clinic.patientsAhead,
      services: clinic.services.map((s) => s.name),
    })
  } catch (error) {
    console.error("Get clinic error:", error)
    res.status(500).json({ error: "Failed to fetch clinic" })
  }
}
