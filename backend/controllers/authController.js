const db = require('../config/db');
const bcrypt = require('bcrypt');

// REGISTER USER
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert into the users table using your custom 'username' column
        await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        // Handle duplicate email error
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Email already exists." });
        }
        res.status(500).json({ error: err.message });
    }
};