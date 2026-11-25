import { Request, Response, NextFunction } from "express"

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error:", err.message)

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message })
  }

  if (err.name === "UnauthorizedError" || err.status === 401) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (err.status === 404) {
    return res.status(404).json({ error: "Not found" })
  }

  res.status(500).json({
    error: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  })
}
