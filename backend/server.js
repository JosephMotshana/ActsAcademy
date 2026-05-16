const express = require('express');
const cors = require('cors');
const path = require('path'); // Declared ONCE at the top
require('dotenv').config();
const db = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const studentRoutes = require('./routes/StudentRoutes');

const app = express();

// --- Middleware ---
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://acts-academy.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// --- Static Files (For Downloads/Materials) ---
// This allows the browser to access files in the 'uploads' folder
// We only need this line once.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// This tells Express to make the "uploads" folder public
app.use('/uploads', express.static('uploads'));
// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/student', studentRoutes);

// Simple health check route
app.get('/api/status', (req, res) => {
  res.json({ message: 'LMS Backend is running smoothly!' });
});

// --- Server Startup & DB Connection ---
const PORT = process.env.PORT || 5000;

db.query('SELECT 1')
  .then(() => {
    console.log('Successfully connected to MySQL database!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MySQL database:', err.message);
  });