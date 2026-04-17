const db = require('../config/db');
const bcrypt = require('bcrypt');

// REGISTER USER
// Add this to your existing authController.js
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        // Check if user already exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Insert new user (Plain text for now since that's what we're using)
        await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, role || 'STUDENT']
        );

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// backend/controllers/authController.js
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user || user.password !== password) { // Use bcrypt here in production!
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Send back the user details (specifically the role)
        res.json({
            id: user.id,
            username: user.username,
            role: user.role 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};