import 'dotenv/config';
import { db } from './src/config/database';
import { sql } from 'drizzle-orm';

async function run() {
    console.log('Migrating IDs to TEXT...');
    try {
        // Drop constraints depending on IDs
        await db.execute(sql`ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_users_id_fk`);
        await db.execute(sql`ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_user_id_users_id_fk`);
        await db.execute(sql`ALTER TABLE pets DROP CONSTRAINT IF EXISTS pets_user_id_users_id_fk`);
        await db.execute(sql`ALTER TABLE consultations DROP CONSTRAINT IF EXISTS consultations_user_id_users_id_fk`);
        await db.execute(sql`ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_users_id_fk`);

        // Alter users table
        await db.execute(sql`ALTER TABLE users ALTER COLUMN id TYPE text`);

        // Alter sessions table
        await db.execute(sql`ALTER TABLE sessions ALTER COLUMN id TYPE text`);
        await db.execute(sql`ALTER TABLE sessions ALTER COLUMN user_id TYPE text`);

        // Alter accounts table
        await db.execute(sql`ALTER TABLE accounts ALTER COLUMN id TYPE text`);
        await db.execute(sql`ALTER TABLE accounts ALTER COLUMN user_id TYPE text`);

        // Alter pets table
        await db.execute(sql`ALTER TABLE pets ALTER COLUMN user_id TYPE text`);

        // Alter consultations table
        await db.execute(sql`ALTER TABLE consultations ALTER COLUMN user_id TYPE text`);

        // Alter notifications table
        await db.execute(sql`ALTER TABLE notifications ALTER COLUMN user_id TYPE text`);

        // Alter verifications table
        await db.execute(sql`ALTER TABLE verifications ALTER COLUMN id TYPE text`);

        // Re-add constraints (optional, but good for integrity if types match)
        // Note: We leave them without strict FK for now to solve the immediate issue, 
        // or re-add them if we are sure data is consistent. 
        // Better Auth doesn't strictly require DB-level FKs if configured properly, but it's checking standard fields.

        console.log('Successfully migrated IDs to TEXT.');
    } catch (error) {
        console.error('Migration failed:', error);
    }
    process.exit(0);
}
run();
