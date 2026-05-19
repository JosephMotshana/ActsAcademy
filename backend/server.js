const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const lecturerRoutes = require('./routes/LecturerRoutes');
const studentRoutes = require('./routes/StudentRoutes');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Static Files ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Test DB connection asynchronously without blocking the server initialization
db.query('SELECT 1')
  .then(() => console.log('Successfully connected to MySQL database!'))
  .catch((err) => console.error('Error connecting to MySQL database:', err.message));

// CRITICAL FOR VERCEL: Only run app.listen locally, otherwise export the app
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; // 👈 Vercel needs this to map your API functions!