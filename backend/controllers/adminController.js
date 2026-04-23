const db = require('../config/db');

// --- LECTURER MANAGEMENT ---

exports.getAllLecturers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email FROM users WHERE role = "LECTURER"');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeLecturer = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ? AND role = "LECTURER"', [id]);
        res.json({ message: "Lecturer removed. Classrooms are now unassigned." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.reassignLecturer = async (req, res) => {
    const { classroomId, lecturerId } = req.body;
    try {
        await db.query('UPDATE classrooms SET lecturer_id = ? WHERE id = ?', [lecturerId, classroomId]);
        res.json({ message: "Lecturer reassigned successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- STUDENT MANAGEMENT ---

exports.getAllStudents = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email FROM users WHERE role = "STUDENT"');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeStudent = async (req, res) => {
    const { id } = req.params;
    try {
        // Automatically clears enrollments due to SQL CASCADE
        await db.query('DELETE FROM users WHERE id = ? AND role = "STUDENT"', [id]);
        res.json({ message: "Student removed successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- CLASSROOM MANAGEMENT ---

exports.getAllClassrooms = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT c.id, c.classroomname, u.username AS lecturer_name 
            FROM classrooms c 
            LEFT JOIN users u ON c.lecturer_id = u.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getClassroomDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM classrooms WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createClassroom = async (req, res) => {
    const { classroomname, lecturer_id } = req.body;
    try {
        await db.query(
            'INSERT INTO classrooms (classroomname, lecturer_id) VALUES (?, ?)',
            [classroomname, lecturer_id]
        );
        res.status(201).json({ message: "Classroom created successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeClassroom = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM classrooms WHERE id = ?', [id]);
        res.json({ message: "Classroom deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateLiveLink = async (req, res) => {
    const { classroomId, liveLink } = req.body;
    try {
        await db.query('UPDATE classrooms SET live_link = ? WHERE id = ?', [liveLink, classroomId]);
        res.json({ message: "Live link updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- ENROLLMENT MANAGEMENT ---

exports.enrollStudent = async (req, res) => {
    const { studentId, classroomId } = req.body;
    try {
        // 1. Check if enrollment already exists
        const [existing] = await db.query(
            'SELECT * FROM enrollments WHERE student_id = ? AND classroom_id = ?',
            [studentId, classroomId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Student is already enrolled." });
        }

        // 2. Proceed with enrollment
        await db.query(
            'INSERT INTO enrollments (student_id, classroom_id) VALUES (?, ?)',
            [studentId, classroomId]
        );
        res.status(201).json({ message: "Student enrolled successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.unenrollStudent = async (req, res) => {
    // Handling both body and params logic for flexibility
    const studentId = req.params.studentId || req.body.studentId;
    const classroomId = req.params.classroomId || req.body.classroomId;
    
    try {
        await db.query(
            'DELETE FROM enrollments WHERE student_id = ? AND classroom_id = ?',
            [studentId, classroomId]
        );
        res.json({ message: "Student removed from class" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudentClasses = async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT c.id, c.classroomname 
            FROM classrooms c
            JOIN enrollments e ON c.id = e.classroom_id
            WHERE e.student_id = ?`, 
            [studentId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// GET ALL ENROLLMENTS (Who is in what class)
exports.getEnrollmentList = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                e.student_id, 
                e.classroom_id, 
                u.username AS student_name, 
                c.classroomname AS class_name
            FROM enrollments e
            JOIN users u ON e.student_id = u.id
            JOIN classrooms c ON e.classroom_id = c.id
            ORDER BY c.classroomname ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};