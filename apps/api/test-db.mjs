import postgres from 'postgres';

// Test without channel_binding parameter
const connectionString = 'postgresql://neondb_owner:npg_yGN5xnMFprO7@ep-frosty-surf-ahf5lqlj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

console.log('Connecting to Neon database...');
console.log('Connection string (partial):', connectionString.replace(/:[^:@]+@/, ':***@'));

const sql = postgres(connectionString, {
    connect_timeout: 30,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
});

try {
    console.log('Testing connection...');
    const result = await sql`SELECT 1 as test, NOW() as timestamp`;
    console.log('✅ Database connection OK:', result);
    await sql.end();
    process.exit(0);
} catch (error) {
    console.log('❌ Database connection FAILED');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    try { await sql.end(); } catch (e) { }
    process.exit(1);
}
