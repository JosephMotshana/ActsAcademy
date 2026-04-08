const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Define the URLs
router.delete('/lecturer/:id', adminController.removeLecturer);
router.post('/unenroll', adminController.unenrollStudent);

module.exports = router;