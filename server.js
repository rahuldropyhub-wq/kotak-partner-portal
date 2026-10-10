import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const sql = neon(process.env.DATABASE_URL);

const upload = multer();

app.use(cors());
app.use(express.json());

// Submit Rider Form
app.post('/api/riders', upload.none(), async (req, res) => {
  try {
    const {
      fullName, mobile, email, dob, age, gender, 
      workCategory, company, employmentType, riderId, 
      weeklyEarnings, workingHours, vehicleOwnership, vehicleType,
      hasAadhar, hasPan
    } = req.body;

    const aadharStatus = hasAadhar === 'true' ? 'Yes' : 'No';
    const panStatus = hasPan === 'true' ? 'Yes' : 'No';

    const result = await sql`
      INSERT INTO riders (
        full_name, mobile, email, dob, age, gender, 
        work_category, company, employment_type, rider_id, 
        weekly_earnings, working_hours, vehicle_ownership, vehicle_type,
        aadhar_file, pan_file
      ) VALUES (
        ${fullName}, ${mobile}, ${email || null}, ${dob || null}, ${age ? parseInt(age) : null}, ${gender},
        ${workCategory}, ${company}, ${employmentType || null}, ${riderId || null},
        ${weeklyEarnings ? parseInt(weeklyEarnings) : null}, ${workingHours ? parseInt(workingHours) : null}, ${vehicleOwnership}, ${vehicleType},
        ${aadharStatus}, ${panStatus}
      ) RETURNING id;
    `;
    
    res.status(201).json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Error saving rider:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all riders (for Admin Panel)
app.get('/api/riders', async (req, res) => {
  try {
    const riders = await sql`SELECT * FROM riders ORDER BY created_at DESC;`;
    res.json(riders);
  } catch (error) {
    console.error('Error fetching riders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
