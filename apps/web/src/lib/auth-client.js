import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000" // Harus sama dengan port API
});

export const { signIn, signUp, useSession } = authClient;