import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

async function addAiEnum() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // Add 'ai' to sender_type enum
        await client.query(`
            ALTER TYPE sender_type ADD VALUE IF NOT EXISTS 'ai';
        `);

        console.log('Successfully added "ai" to sender_type enum!');
        await client.end();
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error:', errorMessage);
        process.exit(1);
    }
}

addAiEnum();
