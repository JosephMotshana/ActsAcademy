const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Gatekeeper: Only allows requests if the 'role' header is 'ADMIN'
const isAdmin = (req, res, next) => {
    const { role } = req.headers; 
    if (role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: "Access Denied: Admins Only" });
    }
};

// --- LECTURER MANAGEMENT ---
router.get('/lecturers', adminController.getAllLecturers);
router.delete('/lecturer/:id', adminController.removeLecturer);
router.post('/reassign-lecturer', adminController.reassignLecturer);

// --- STUDENT MANAGEMENT ---
router.get('/students', adminController.getAllStudents);
router.delete('/student/:id', adminController.removeStudent);

// --- ENROLLMENT MANAGEMENT ---
router.post('/enroll', adminController.enrollStudent);
// Path uses params for easy clicking/deleting from the UI
router.delete('/unenroll/:studentId/:classroomId', adminController.unenrollStudent);
router.get('/student-classes/:studentId', adminController.getStudentClasses);
router.get('/enrollments', adminController.getEnrollmentList);

// --- CLASSROOM MANAGEMENT ---
router.get('/classrooms', adminController.getAllClassrooms);
router.get('/classroom/:id', adminController.getClassroomDetails);
router.post('/classroom', adminController.createClassroom);
router.delete('/classroom/:id', adminController.removeClassroom);
router.post('/update-live-link', adminController.updateLiveLink);

module.exports = router;