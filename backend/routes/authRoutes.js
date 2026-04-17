const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// This is the line your app is missing!
router.post('/login', authController.login);
// URL: http://localhost:5000/api/auth/register
router.post('/register', authController.register);

module.exports = router;