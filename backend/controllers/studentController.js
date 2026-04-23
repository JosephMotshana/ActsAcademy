const db = require('../config/db');

// 1. Get tests that the student HAS NOT written yet
exports.getAvailableTests = async (req, res) => {
    const { classId, studentId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT q.id, q.title, q.created_at 
            FROM quizzes q
            LEFT JOIN quiz_results qr ON q.id = qr.quiz_id AND qr.student_id = ?
            WHERE q.classroom_id = ? AND qr.id IS NULL`, 
            [studentId, classId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Get tests the student HAS written (History)
exports.getTestHistory = async (req, res) => {
    const { classId, studentId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT q.title, qr.score_percentage, qr.completed_at 
            FROM quiz_results qr
            JOIN quizzes q ON qr.quiz_id = q.id
            WHERE q.classroom_id = ? AND qr.student_id = ?
            ORDER BY qr.completed_at DESC`, 
            [classId, studentId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getQuizDetails = async (req, res) => {
    const { quizId } = req.params;
    try {
        // Fetch the quiz title
        const [quiz] = await db.query('SELECT title FROM quizzes WHERE id = ?', [quizId]);
        
        // Fetch the questions
        const [questions] = await db.query(
            'SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option FROM questions WHERE quiz_id = ?', 
            [quizId]
        );

        if (quiz.length === 0) return res.status(404).json({ message: "Quiz not found" });

        res.json({
            title: quiz[0].title,
            questions: questions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getMaterials = async (req, res) => {
    const { classId } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM materials WHERE classroom_id = ? ORDER BY uploaded_at DESC', 
            [classId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getClassroomDetails = async (req, res) => {
    const { classId } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM classrooms WHERE id = ?', [classId]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.submitQuiz = async (req, res) => {
    const { quizId, studentId, score } = req.body;

    try {
        // 1. Check if the student has already submitted this quiz
        const [existing] = await db.query(
            'SELECT id FROM quiz_results WHERE quiz_id = ? AND student_id = ?',
            [quizId, studentId]
        );

        if (existing.length > 0) {
            return res.status(403).json({ message: "You have already submitted this test." });
        }

        // 2. If not, save the result
        await db.query(
            'INSERT INTO quiz_results (quiz_id, student_id, score_percentage) VALUES (?, ?, ?)',
            [quizId, studentId, score]
        );

        res.status(201).json({ message: "Result saved successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// In studentController.js
exports.getMyEnrolledClasses = async (req, res) => {
    const { studentId } = req.params;
    const query = `
        SELECT c.id, c.classroomname, u.username as lecturer_name 
        FROM classrooms c
        JOIN enrollments e ON c.id = e.classroom_id
        JOIN users u ON c.lecturer_id = u.id
        WHERE e.student_id = ?`;
    // ... execute query
};

exports.getLiveLink = async (req, res) => {
    const { classId } = req.params;
    try {
        // This query is the heart of the 12-hour expiry logic
        const query = `
            SELECT live_link FROM classrooms 
            WHERE id = ? 
            AND link_updated_at >= NOW() - INTERVAL 12 HOUR
        `;
        const [rows] = await db.query(query, [classId]);

        if (rows.length > 0) {
            res.json({ live_link: rows[0].live_link });
        } else {
            // If the link is old or empty, we return null so the button disappears
            res.json({ live_link: null });
        }
    } catch (err) {
        console.error("Error fetching live link for student:", err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getEnrolledClasses = async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT c.* FROM classrooms c 
             JOIN enrollments e ON c.id = e.classroom_id 
             WHERE e.student_id = ?`, 
            [studentId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
