import 'dotenv/config';
import { db } from './src/config/database';
import { sql } from 'drizzle-orm';

async function check() {
    console.log('Checking pets table columns...');
    try {
        const columns = await db.execute(sql`
            SELECT column_name, udt_name 
            FROM information_schema.columns 
            WHERE table_name = 'pets' AND column_name = 'gender';
        `);
        console.log('Columns:', columns);

        const enums = await db.execute(sql`
            SELECT DISTINCT t.typname AS enum_name
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid
            WHERE t.typname IN ('gender', 'pet_status');
        `);
        console.log('Enums:', enums);
    } catch (error) {
        console.error('Check failed:', error);
    }
    process.exit(0);
}

check();
