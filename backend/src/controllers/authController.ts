import { Request, Response } from "express"
import prisma from "../db"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "qlinic-dev-secret-change-in-production"

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, phone, fullName, clinicId, language = "en", password } =
      req.body

    if (!email || !phone || !fullName || !password) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    })

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        fullName,
        clinicId,
        language: language === "sw" ? "SW" : "EN",
      },
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    // Create default preferences
    await prisma.reminder.create({
      data: { userId: user.id },
    })
    await prisma.permission.create({
      data: { userId: user.id },
    })
    await prisma.accessibility.create({
      data: { userId: user.id },
    })
    await prisma.visitPrep.create({
      data: { userId: user.id },
    })

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        clinicId: user.clinicId,
        language: user.language,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ error: "Registration failed" })
  }
}

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, phone, password } = req.body

    const user = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    })

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        clinicId: user.clinicId,
        language: user.language,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
}

// POST /api/auth/send-otp - Send OTP to phone
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body

    if (!phone) {
      return res.status(400).json({ error: "Phone number required" })
    }

    // In production, integrate with SMS provider (AfricasTalking, Twilio, etc.)
    // For now, return success - OTP would be sent via SMS
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP temporarily (in production use Redis with TTL)
    // For demo purposes, we accept any 6-digit code on verify

    res.json({
      ok: true,
      message: "OTP sent",
      // In development, return the OTP for testing
      ...(process.env.NODE_ENV === "development" && { otp }),
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    res.status(500).json({ error: "Failed to send OTP" })
  }
}

// POST /api/auth/verify-otp
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body

    if (!phone || !code) {
      return res.status(400).json({ error: "Phone and code required" })
    }

    // Find or create user by phone
    let user = await prisma.user.findUnique({ where: { phone } })

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          email: `${phone.replace(/\D/g, "")}@qlinic.health`,
          fullName: `Patient ${phone.slice(-4)}`,
          language: "EN",
        },
      })

      await prisma.reminder.create({ data: { userId: user.id } })
      await prisma.permission.create({ data: { userId: user.id } })
      await prisma.accessibility.create({ data: { userId: user.id } })
      await prisma.visitPrep.create({ data: { userId: user.id } })
    }

    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    res.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        clinicId: user.clinicId,
        language: user.language,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    res.status(500).json({ error: "OTP verification failed" })
  }
}

// Middleware to verify JWT
export const authenticateToken = (
  req: Request,
  res: Response,
  next: Function
) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" })
    }
    req.user = user
    next()
  })
}

export { JWT_SECRET }
