const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const multer = require('multer');
const path = require('path');

// --- MULTER CONFIGURATION ---
// We only need to define this ONCE.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use path.join to ensure the folder is found correctly
        cb(null, path.join(__dirname, '../uploads')); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit to handle videos and high-res images
});

// --- CLASSROOM MANAGEMENT ---
router.get('/my-classes/:lecturerId', lecturerController.getMyClasses);
router.post('/update-live-link', lecturerController.updateLiveLink);

// --- MATERIAL MANAGEMENT ---
router.get('/materials/:classId', lecturerController.getMaterials);

// This handles images, docs, and videos via 'file'
router.post('/add-material', upload.single('file'), lecturerController.addMaterial);

router.delete('/material/:id', lecturerController.deleteMaterial);

// --- QUIZ & PERFORMANCE ---
router.post('/create-quiz', lecturerController.createQuiz);
router.get('/performance/:classId', lecturerController.getStudentPerformance);

module.exports = router;
