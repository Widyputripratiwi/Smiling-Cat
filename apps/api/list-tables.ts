import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

async function listTables() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log('Tables in database:');
        if (res.rows.length === 0) {
            console.log('No tables found.');
        } else {
            res.rows.forEach(row => console.log('- ' + row.table_name));
        }
        await client.end();
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error:', errorMessage);
        process.exit(1);
    }
}

listTables();
