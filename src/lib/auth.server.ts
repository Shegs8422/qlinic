import { betterAuth } from "better-auth"
import { emailOTP } from "better-auth/plugins"
import Database from "better-sqlite3"
import path from "node:path"

const db = new Database(path.resolve(process.cwd(), "auth.db"))

export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8443",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(`[Better Auth Password Reset] ${user.email}: ${url}`)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(`[Better Auth Email Verification] ${user.email}: ${url}`)
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[Better Auth Email OTP] ${type} OTP for ${email}: ${otp}`)
      },
    }),
  ],
})

export type Auth = typeof auth
