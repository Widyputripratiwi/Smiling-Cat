import 'dotenv/config';
import { db } from './src/config/database';
import { sql } from 'drizzle-orm';

async function run() {
    console.log('Relaxing constraint on users.name...');
    try {
        await db.execute(sql`ALTER TABLE users ALTER COLUMN name DROP NOT NULL`);
        console.log('Successfully dropped NOT NULL constraint on users.name');
    } catch (error) {
        console.error('Failed to alter table:', error);
    }
    process.exit(0);
}
run();
