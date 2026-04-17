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
exports.reassignLecturer = async (req, res) => {
    const { classroomId, lecturerId } = req.body;
    try {
        await db.query('UPDATE classrooms SET lecturer_id = ? WHERE id = ?', [lecturerId, classroomId]);
        res.json({ message: "Lecturer reassigned successfully!" });
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
}; // <--- THIS BRACE WAS MISSING

// Update the Live Meeting Link
exports.updateLiveLink = async (req, res) => {
    const { classroomId, liveLink } = req.body;
    try {
        await db.query('UPDATE classrooms SET live_link = ? WHERE id = ?', [liveLink, classroomId]);
        res.json({ message: "Live link updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// The Security Bouncer: Checks if Student/Lecturer belongs to this class
exports.verifyClassroomMember = async (req, res) => {
    const { classroomId, userId, role } = req.body;
    try {
        if (role === 'LECTURER') {
            const [rows] = await db.query(
                'SELECT id FROM classrooms WHERE id = ? AND lecturer_id = ?', 
                [classroomId, userId]
            );
            return res.json({ authorized: rows.length > 0 });
        } 
        if (role === 'STUDENT') {
            const [rows] = await db.query(
                'SELECT id FROM enrollments WHERE classroom_id = ? AND student_id = ?', 
                [classroomId, userId]
            );
            return res.json({ authorized: rows.length > 0 });
        }
        res.status(403).json({ authorized: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get specific classroom details
exports.getClassroomDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM classrooms WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET CLASSES A STUDENT IS ENROLLED IN
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