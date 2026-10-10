import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function alterDB() {
  try {
    console.log('Adding document columns...');
    await sql`ALTER TABLE riders ADD COLUMN IF NOT EXISTS aadhar_file VARCHAR(500);`;
    await sql`ALTER TABLE riders ADD COLUMN IF NOT EXISTS pan_file VARCHAR(500);`;
    console.log('Successfully updated table schema.');
    process.exit(0);
  } catch (error) {
    console.error('Error altering table:', error);
    process.exit(1);
  }
}

alterDB();
