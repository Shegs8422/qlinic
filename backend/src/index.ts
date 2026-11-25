import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import router from "./routes"
import { errorHandler } from "./middleware/errorHandler"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}))

// Body parsing
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// API routes
app.use("/api", router)

// Error handling
app.use(errorHandler)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`🚀 Qlinic Backend running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`)
})

export default app
