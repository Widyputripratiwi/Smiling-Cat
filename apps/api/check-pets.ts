import 'dotenv/config';
import { db } from './src/config/database';
import { pets } from './src/db/schema/pets';
import { desc } from 'drizzle-orm';

async function query() {
    console.log('Fetching latest pets...');
    try {
        const result = await db.select().from(pets).orderBy(desc(pets.createdAt)).limit(5);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Query failed:', error);
    }
    process.exit(0);
}

query();
