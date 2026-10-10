import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function run() {
  try {
    const res = await sql`SELECT id, full_name, aadhar_file, pan_file FROM riders ORDER BY created_at DESC LIMIT 5`;
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}
run();
