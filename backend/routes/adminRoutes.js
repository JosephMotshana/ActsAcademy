const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Define the URLs
router.delete('/lecturer/:id', adminController.removeLecturer);
router.post('/unenroll', adminController.unenrollStudent);
router.get('/lecturers', adminController.getAllLecturers);
router.post('/classroom', adminController.createClassroom);
router.get('/classrooms', adminController.getAllClassrooms);
router.delete('/classroom/:id', adminController.removeClassroom);
router.get('/students', adminController.getAllStudents);
router.post('/enroll', adminController.enrollStudent);

module.exports = router;
