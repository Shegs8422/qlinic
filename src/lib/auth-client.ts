import { createAuthClient } from "better-auth/react"
import { emailOTPClient } from "better-auth/client/plugins"
import { dashClient } from "@better-auth/infra/client"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL || undefined,
  plugins: [
    emailOTPClient(),
    dashClient({
      apiKey: import.meta.env.VITE_BETTER_AUTH_API_KEY,
    }),
  ],
})

export type AuthClient = typeof authClient
