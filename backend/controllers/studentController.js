const db = require('../config/db');

// --- CLASSROOM LOGIC ---

exports.getEnrolledClasses = async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT c.id, c.classroomname, u.username as lecturer_name 
             FROM classrooms c 
             JOIN enrollments e ON c.id = e.classroom_id 
             JOIN users u ON c.lecturer_id = u.id
             WHERE e.student_id = ?`, 
            [studentId]
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

exports.getLiveLink = async (req, res) => {
    const { classId } = req.params;
    try {
        const query = `
            SELECT live_link FROM classrooms 
            WHERE id = ? 
            AND link_updated_at >= NOW() - INTERVAL 12 HOUR
        `;
        const [rows] = await db.query(query, [classId]);
        res.json({ live_link: rows.length > 0 ? rows[0].live_link : null });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// --- MATERIALS ---

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

// --- ASSESSMENT LOGIC ---

exports.getAvailableTests = async (req, res) => {
    const { classId, studentId } = req.params;
    try {
        // Aligned with the 'quizzes' table and classroom_id logic
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

exports.getQuizDetails = async (req, res) => {
    const id = req.params.quizId || req.params.testId; 
    try {
        // 1. Fetch Quiz Header
        const [quiz] = await db.query('SELECT title, id FROM quizzes WHERE id = ?', [id]);
        if (quiz.length === 0) return res.status(404).json({ message: "Quiz not found" });

        // 2. Fetch Questions (Updated column 'type' to 'question_type' to match your DB)
        const [questions] = await db.query(
            'SELECT id, question_text, question_type, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ?', 
            [id]
        );
        res.json({ title: quiz[0].title, questions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.submitQuiz = async (req, res) => {
    const { testId, userId, answers } = req.body;
    try {
        const [existing] = await db.query(
            'SELECT id FROM quiz_results WHERE quiz_id = ? AND student_id = ?',
            [testId, userId]
        );
        if (existing.length > 0) return res.status(403).json({ message: "Already submitted." });

        const [correctAnswers] = await db.query(
            'SELECT id, correct_option, question_type FROM questions WHERE quiz_id = ?', [testId]
        );

        let correctMcqCount = 0;
        let hasEssay = false;
        let mcqTotal = 0;

        correctAnswers.forEach(q => {
            if (q.question_type === 'MCQ') {
                mcqTotal++;
                if (answers[q.id] === q.correct_option) correctMcqCount++;
            } else {
                hasEssay = true;
            }
        });

        // Score is NULL if it contains Essays (waiting for lecturer to mark)
        const finalScore = hasEssay ? null : (mcqTotal > 0 ? (correctMcqCount / mcqTotal) * 100 : 0);

        await db.query(
            'INSERT INTO quiz_results (quiz_id, student_id, score_percentage, completed_at) VALUES (?, ?, ?, NOW())',
            [testId, userId, finalScore]
        );

        // Store each answer (Updated to use text for both MCQ and Essay)
        for (const [qId, text] of Object.entries(answers)) {
            await db.query(
                'INSERT INTO student_answers (quiz_id, student_id, question_id, answer_text) VALUES (?, ?, ?, ?)',
                [testId, userId, qId, text]
            );
        }
        res.status(201).json({ message: "Submitted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- REVIEW & HISTORY ---

exports.getTestHistory = async (req, res) => {
    const { classId, studentId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT q.id as quiz_id, q.title, qr.score_percentage, qr.completed_at 
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

exports.getSubmissionReview = async (req, res) => {
    const { studentId, quizId } = req.params;
    try {
        const [submission] = await db.query(`
            SELECT q.title, qr.score_percentage, qr.completed_at 
            FROM quiz_results qr
            JOIN quizzes q ON qr.quiz_id = q.id
            WHERE qr.quiz_id = ? AND qr.student_id = ?`, 
            [quizId, studentId]
        );

        if (submission.length === 0) return res.status(404).json({ message: "Not found" });

        const [reviewData] = await db.query(`
            SELECT 
                q.id as question_id, q.question_text, q.question_type, 
                q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option,
                sa.answer_text as student_answer, sa.marks_awarded
            FROM questions q
            LEFT JOIN student_answers sa ON q.id = sa.question_id AND sa.student_id = ?
            WHERE q.quiz_id = ?`, 
            [studentId, quizId]
        );

        res.json({ summary: submission[0], details: reviewData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};