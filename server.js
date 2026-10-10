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

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
// Serve the uploads folder statically so admin can view them
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Submit Rider Form with Documents
app.post('/api/riders', upload.fields([{ name: 'aadharFile', maxCount: 1 }, { name: 'panFile', maxCount: 1 }]), async (req, res) => {
  try {
    const {
      fullName, mobile, email, dob, age, gender, 
      workCategory, company, employmentType, riderId, 
      weeklyEarnings, workingHours, vehicleOwnership, vehicleType
    } = req.body;

    const aadharFilePath = req.files['aadharFile'] ? `/uploads/${req.files['aadharFile'][0].filename}` : null;
    const panFilePath = req.files['panFile'] ? `/uploads/${req.files['panFile'][0].filename}` : null;

    const result = await sql`
      INSERT INTO riders (
        full_name, mobile, email, dob, age, gender, 
        work_category, company, employment_type, rider_id, 
        weekly_earnings, working_hours, vehicle_ownership, vehicle_type,
        aadhar_file, pan_file
      ) VALUES (
        ${fullName}, ${mobile}, ${email || null}, ${dob || null}, ${age ? parseInt(age) : null}, ${gender},
        ${workCategory}, ${company}, ${employmentType || null}, ${riderId},
        ${weeklyEarnings ? parseInt(weeklyEarnings) : null}, ${workingHours ? parseInt(workingHours) : null}, ${vehicleOwnership}, ${vehicleType},
        ${aadharFilePath}, ${panFilePath}
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

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
