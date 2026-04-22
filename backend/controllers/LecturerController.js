const db = require('../config/db');

// --- CLASSROOMS ---
exports.getMyClasses = async (req, res) => {
    const { lecturerId } = req.params;
    try {
        const [classes] = await db.query('SELECT * FROM classrooms WHERE lecturer_id = ?', [lecturerId]);
        res.json(classes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateLiveLink = async (req, res) => {
    const { classId, live_link } = req.body;
    try {
        await db.query('UPDATE classrooms SET live_link = ? WHERE id = ?', [live_link, classId]);
        res.json({ message: "Live link updated!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addMaterial = async (req, res) => {
    const { title, type, classId, link } = req.body;
    const fileData = req.file ? `/uploads/${req.file.filename}` : link;

    try {
        const query = "INSERT INTO materials (title, type, classroom_id, file_url) VALUES (?, ?, ?, ?)";
        await db.query(query, [title, type, classId, fileData]);
        res.status(201).json({ message: "Material added successfully" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// --- GET MATERIALS (Updated to Async/Await) ---
exports.getMaterials = async (req, res) => {
    const { classId } = req.params;
    try {
        const query = "SELECT * FROM materials WHERE classroom_id = ?";
        const [results] = await db.query(query, [classId]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteMaterial = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM materials WHERE id = ?', [id]);
        res.json({ message: "Material deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- QUIZZES & PERFORMANCE ---
exports.createQuiz = async (req, res) => {
    const { classId, title, questions } = req.body;
    const connection = await db.getConnection(); 
    try {
        await connection.beginTransaction();

        const [quizRes] = await connection.query('INSERT INTO quizzes (classroom_id, title) VALUES (?, ?)', [classId, title]);
        const quizId = quizRes.insertId;

        const questionValues = questions.map(q => [
            quizId, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option
        ]);

        await connection.query(
            'INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES ?',
            [questionValues]
        );

        await connection.commit();
        res.status(201).json({ message: "Quiz and questions created!" });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};

exports.getStudentPerformance = async (req, res) => {
    const { classId } = req.params;
    try {
        const [performance] = await db.query(`
            SELECT u.id, u.username, COUNT(r.id) as tests_taken, AVG(r.score_percentage) as average_grade
            FROM users u
            JOIN student_classes sc ON u.id = sc.student_id
            LEFT JOIN results r ON u.id = r.student_id
            WHERE sc.classroom_id = ?
            GROUP BY u.id
        `, [classId]);
        res.json(performance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudentAttemptDetail = async (req, res) => {
    const { resultId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT 
                q.question_text, 
                q.correct_option, 
                sa.selected_option, 
                sa.is_correct
            FROM student_answers sa
            JOIN questions q ON sa.question_id = q.id
            WHERE sa.result_id = ?`, [resultId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};