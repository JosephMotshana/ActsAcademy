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
// GET ALL LECTURERS
exports.getAllLecturers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email FROM users WHERE role = "LECTURER"');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// CREATE A CLASSROOM
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
exports.getAllClassrooms = async (req, res) => {
    try {
        // We use a LEFT JOIN to see classrooms even if they have no lecturer (NULL)
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
// DELETE A CLASSROOM
exports.removeClassroom = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM classrooms WHERE id = ?', [id]);
        res.json({ message: "Classroom deleted successfully. All student enrollments for this class have been removed." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// ENROLL A STUDENT
exports.enrollStudent = async (req, res) => {
    const { student_id, classroom_id } = req.body;
    try {
        await db.query(
            'INSERT INTO enrollments (student_id, classroom_id) VALUES (?, ?)',
            [student_id, classroom_id]
        );
        res.status(201).json({ message: "Student enrolled successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Enrollment failed. Maybe student is already enrolled?" });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        // We select from 'users' table, not a 'students' table
        const [rows] = await db.query(
            'SELECT id, username, email FROM users WHERE role = "STUDENT"'
        );
        res.json(rows);
    } catch (err) {
        console.error("Database Error:", err.message); // This sends the error to your terminal
        res.status(500).json({ error: err.message });
    }
};

// DELETE A STUDENT
exports.removeStudent = async (req, res) => {
    const { id } = req.params;
    try {
        // This will remove the student from 'users' and 
        // automatically clear their enrollments due to CASCADE.
        await db.query('DELETE FROM users WHERE id = ? AND role = "STUDENT"', [id]);
        res.json({ message: "Student removed successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};