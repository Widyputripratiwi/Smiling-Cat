import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './database';
import * as schema from '../db/schema';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
        },
    }),
    basePath: '/api/auth', // Must match the mount path in index.ts
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    trustedOrigins: [
        'http://localhost:5173',
        'http://203.175.11.165',
        process.env.FRONTEND_URL || '',
    ].filter(Boolean),
});