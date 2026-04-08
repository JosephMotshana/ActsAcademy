const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // Use the centralized DB config we created

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Only need this once to parse JSON bodies

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Simple health check route
app.get('/api/status', (req, res) => {
  res.json({ message: 'LMS Backend is running smoothly!' });
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

// Since db.js now exports a promise pool, we test connection like this:
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