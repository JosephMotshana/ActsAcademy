const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// --- DASHBOARD & CLASSROOM ---
// Get all classes a student is enrolled in
router.get('/my-classes/:studentId', studentController.getEnrolledClasses); // Updated to match unified controller name

// Get specific classroom details
router.get('/class-details/:classId', studentController.getClassroomDetails);

// --- CONTENT ---
router.get('/materials/:classId', studentController.getMaterials);

// --- ASSESSMENTS (Tests) ---
router.get('/available-tests/:classId/:studentId', studentController.getAvailableTests);
router.get('/test-history/:classId/:studentId', studentController.getTestHistory);

// Quiz Details (Handles both naming conventions)
router.get('/quiz/:quizId', studentController.getQuizDetails);
router.get('/test-details/:testId', studentController.getQuizDetails); 

// Submission (Handles both naming conventions)
router.post('/submit-quiz', studentController.submitQuiz);
router.post('/submit-test', studentController.submitQuiz); 

// --- REVIEW & LIVE ---
router.get('/live-link/:classId', studentController.getLiveLink);

// FIXED TYPO HERE: Changed .g to .get and removed the trailing'et'
router.get('/review/:quizId/:studentId', studentController.getSubmissionReview);

module.exports = router;