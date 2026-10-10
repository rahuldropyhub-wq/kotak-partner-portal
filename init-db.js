import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function initDB() {
  try {
    console.log('Creating riders table...');
    await sql`
      CREATE TABLE IF NOT EXISTS riders (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        dob DATE,
        age INTEGER,
        gender VARCHAR(20),
        work_category VARCHAR(100),
        company VARCHAR(100),
        employment_type VARCHAR(50),
        rider_id VARCHAR(100),
        weekly_earnings INTEGER,
        working_hours INTEGER,
        vehicle_ownership VARCHAR(50),
        vehicle_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Table "riders" created or already exists.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating table:', error);
    process.exit(1);
  }
}

initDB();
