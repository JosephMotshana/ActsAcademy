const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const studentRoutes = require('./routes/StudentRoutes');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://acts-academy.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/student', studentRoutes);

app.get('/api/status', (req, res) => {
  res.json({ message: 'LMS Backend is running smoothly!' });
});

module.exports = app;
