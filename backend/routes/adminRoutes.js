const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// This is a "Gatekeeper" function
const isAdmin = (req, res, next) => {
    const { role } = req.headers; // For now, we'll pass role in headers
    if (role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: "Access Denied: Admins Only" });
    }
};

// Define the URLs
router.delete('/lecturer/:id', adminController.removeLecturer);
router.post('/unenroll', adminController.unenrollStudent);
router.get('/lecturers', adminController.getAllLecturers);
router.post('/classroom', adminController.createClassroom);
router.get('/classrooms', adminController.getAllClassrooms);
router.delete('/classroom/:id', adminController.removeClassroom);
router.get('/students', adminController.getAllStudents);
router.post('/enroll', adminController.enrollStudent);
router.delete('/student/:id', adminController.removeStudent);
// Apply the gatekeeper to specific routes
router.post('/classroom', isAdmin, adminController.createClassroom);
router.delete('/lecturer/:id', isAdmin, adminController.removeStudent);
router.post('/update-live-link', adminController.updateLiveLink);
router.post('/verify-member', adminController.verifyClassroomMember);
router.get('/classroom/:id', adminController.getClassroomDetails);
router.get('/student-classes/:studentId', adminController.getStudentClasses);
// Check line 27 specifically. It probably looks like one of these:
router.post('/update-live-link', adminController.updateLiveLink);
router.post('/verify-member', adminController.verifyClassroomMember);
// This connects the frontend POST request to the Controller function
router.post('/create-classroom', adminController.createClassroom);
router.post('/reassign-lecturer', adminController.reassignLecturer);

module.exports = router;
