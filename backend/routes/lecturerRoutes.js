const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const multer = require('multer');

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// --- CLASSROOM MANAGEMENT ---
// Get all classes assigned to a specific lecturer
router.get('/my-classes/:lecturerId', lecturerController.getMyClasses);

// Update the live meeting link
router.post('/update-live-link', lecturerController.updateLiveLink);


// --- MATERIAL MANAGEMENT ---
// Fetch materials for a class
router.get('/materials/:classId', lecturerController.getMaterials);

// Upload new material (handles physical files or text links)
// 'file' is the name of the field coming from the frontend FormData
router.post('/add-material', upload.single('file'), lecturerController.addMaterial);


// --- QUIZ & TESTING ---
// Create a new quiz with multiple questions
router.post('/create-quiz', lecturerController.createQuiz);

// Get the list of all students and their average grades
router.get('/performance/:classId', lecturerController.getStudentPerformance);
router.delete('/material/:id', lecturerController.deleteMaterial);

module.exports = router;