import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';

const connectionString = process.env.DATABASE_URL!;

// For query purposes
import * as fs from 'fs';

class FileLogger {
    logQuery(query: string, params: unknown[]): void {
        try {
            const logEntry = `[Query] ${query} -- Params: ${JSON.stringify(params)}\n`;
            fs.appendFileSync('sql.log', logEntry);
        } catch (e) {
            // ignore logging errors
        }
    }
}

const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema, logger: new FileLogger() });

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });
