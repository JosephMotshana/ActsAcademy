const db = require('../config/db');

// Function to delete a lecturer
exports.removeLecturer = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ? AND role = "LECTURER"', [id]);
        res.json({ message: "Lecturer removed. Classrooms are now unassigned." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to unenroll a student
exports.unenrollStudent = async (req, res) => {
    const { studentId, classroomId } = req.body;
    try {
        await db.query('DELETE FROM enrollments WHERE student_id = ? AND classroom_id = ?', [studentId, classroomId]);
        res.json({ message: "Student removed from this specific class." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};