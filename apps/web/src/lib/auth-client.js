import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: (import.meta.env.VITE_BETTER_AUTH_URL || "http://localhost:3000/api") + "/auth" // VITE_BETTER_AUTH_URL already has /api
});

export const { signIn, signUp, useSession } = authClient;