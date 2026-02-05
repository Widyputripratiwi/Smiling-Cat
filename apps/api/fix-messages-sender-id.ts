import 'dotenv/config';
import { db } from './src/config/database';
import { sql } from 'drizzle-orm';

async function run() {
    console.log('Migrating messages.sender_id to TEXT...');
    try {
        await db.execute(sql`ALTER TABLE messages ALTER COLUMN sender_id TYPE text`);
        console.log('Successfully migrated messages.sender_id to TEXT.');
    } catch (error) {
        console.error('Migration failed:', error);
    }
    process.exit(0);
}
run();
