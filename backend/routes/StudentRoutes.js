const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// --- DASHBOARD & CLASSROOM ---
// Get all classes a student is enrolled in
router.get('/my-classes/:studentId', studentController.getMyEnrolledClasses);

// Get specific classroom details (for the Live Link)
router.get('/class-details/:classId', studentController.getClassroomDetails);


// --- CONTENT ---
// Get study materials (docs, images, videos, links) for a class
router.get('/materials/:classId', studentController.getMaterials);


// --- ASSESSMENTS (Tests) ---
// List tests the student hasn't taken yet
router.get('/available-tests/:classId/:studentId', studentController.getAvailableTests);

// List past test results
router.get('/test-history/:classId/:studentId', studentController.getTestHistory);

// Get the actual questions for a specific quiz
router.get('/quiz/:quizId', studentController.getQuizDetails);

// Submit the quiz (Auto-marking results saved here)
router.post('/submit-quiz', studentController.submitQuiz);
// Add this to your student routes file
router.get('/live-link/:classId', studentController.getLiveLink);

module.exports = router;