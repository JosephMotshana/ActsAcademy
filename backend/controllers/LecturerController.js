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
    const { classId } = req.params;
    const { title, questions } = req.body;

    try {
        // 1. Insert the Quiz Header
        const [quizResult] = await db.query(
            `INSERT INTO quizzes (classroom_id, title) VALUES (?, ?)`,
            [classId, title]
        );
        const quizId = quizResult.insertId;

        // 2. Insert the Questions
        for (let q of questions) {
            await db.query(
                `INSERT INTO questions 
                (quiz_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_option) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    quizId, 
                    q.question_text, 
                    q.question_type, 
                    q.option_a || null, 
                    q.option_b || null, 
                    q.option_c || null, 
                    q.option_d || null, 
                    q.correct_option || null
                ]
            );
        }

        res.status(201).json({ message: "Assessment created successfully!", quizId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error while creating quiz" });
    }
};

// --- MANUAL MARKING ---
exports.markStudentAnswer = async (req, res) => {
    const { answerId, earnedPoints, feedback } = req.body;
    try {
        const query = `
            UPDATE student_answers 
            SET earned_points = ?, feedback = ?, is_correct = ? 
            WHERE id = ?`;
        
        // If earnedPoints > 0, we can logically set is_correct to 1 (true)
        const isCorrect = earnedPoints > 0 ? 1 : 0;

        await db.query(query, [earnedPoints, feedback, isCorrect, answerId]);
        res.json({ message: "Marking updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// lecturerController.js - Updated getPerformance
// In lecturerController.js
exports.getPerformance = async (req, res) => {
    const { classId } = req.params;

    const query = `
        SELECT 
            u.id AS student_id, 
            u.username AS student_name,
            COUNT(DISTINCT sa.quiz_id) AS quizzes_completed,
            /* Calculate sum of marks awarded */
            IFNULL(SUM(sa.marks_awarded), 0) AS total_points_earned,
            /* Calculate total possible marks (assuming 10 points per quiz) */
            (SELECT COUNT(*) * 10 FROM quizzes WHERE classroom_id = ?) AS total_possible_points
        FROM users u
        INNER JOIN enrollments e ON u.id = e.student_id
        LEFT JOIN student_answers sa ON u.id = sa.student_id 
            AND sa.quiz_id IN (SELECT id FROM quizzes WHERE classroom_id = ?)
        WHERE e.classroom_id = ?
        GROUP BY u.id, u.username
    `;

    try {
        const [rows] = await db.query(query, [classId, classId, classId]);
        res.json(rows);
    } catch (err) {
        console.error("Performance SQL Error:", err);
        res.status(500).json({ error: "Could not fetch performance data" });
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
exports.getPendingMarks = async (req, res) => {
    const { classId, studentId } = req.params;

    // Based on your database: Essay answers are in 'student_answers' table
    const query = `
        SELECT 
            sa.id, 
            u.username, 
            q.question_text, 
            sa.answer_text 
        FROM student_answers sa
        JOIN users u ON sa.student_id = u.id
        JOIN questions q ON sa.question_id = q.id
        JOIN quizzes qz ON q.quiz_id = qz.id
        WHERE qz.classroom_id = ? 
        AND sa.student_id = ?
        AND q.question_type = 'ESSAY'
        AND sa.marks_awarded IS NULL
    `;

    try {
        const [rows] = await db.query(query, [classId, studentId]);
        res.json(rows);
    } catch (err) {
        console.error("PENDING MARKS ERROR:", err.message);
        res.status(500).json({ error: "Database error", details: err.message });
    }
};

// lecturerController.js

// lecturerController.js - Updated submitMark
exports.submitMark = async (req, res) => {
    const { answerId, marks } = req.body;
    try {
        const [[answerRow]] = await db.query(
            'SELECT quiz_id, student_id FROM student_answers WHERE id = ?',
            [answerId]
        );

        if (!answerRow) {
            return res.status(404).json({ error: 'Answer record not found' });
        }

        const { quiz_id: quizId, student_id: studentId } = answerRow;

        await db.query(
            'UPDATE student_answers SET marks_awarded = ? WHERE id = ?',
            [marks, answerId]
        );

        // If all essay answers are now marked, recalculate the final quiz score.
        const [pendingRows] = await db.query(
            `SELECT sa.id
             FROM student_answers sa
             JOIN questions q ON sa.question_id = q.id
             WHERE sa.quiz_id = ?
               AND sa.student_id = ?
               AND q.question_type = 'ESSAY'
               AND sa.marks_awarded IS NULL`,
            [quizId, studentId]
        );

        let updatedScore = null;
        if (pendingRows.length === 0) {
            const [[scoreRow]] = await db.query(
                `SELECT 
                    SUM(COALESCE(sa.marks_awarded, 0)) AS earned,
                    COUNT(*) AS total
                 FROM student_answers sa
                 WHERE sa.quiz_id = ? AND sa.student_id = ?`,
                [quizId, studentId]
            );

            const earned = Number(scoreRow.earned ?? 0);
            const total = Number(scoreRow.total ?? 0);
            const newScore = total > 0 ? Math.round((earned / total) * 100) : 0;

            await db.query(
                'UPDATE quiz_results SET score_percentage = ? WHERE quiz_id = ? AND student_id = ?',
                [newScore, quizId, studentId]
            );
            updatedScore = newScore;
        }

        res.json({
            message: 'Mark submitted successfully',
            scoreUpdated: updatedScore !== null,
            scorePercentage: updatedScore
        });
    } catch (err) {
        console.error('Submit Mark Error:', err);
        res.status(500).json({ error: err.message });
    }
};
exports.getPendingStudents = async (req, res) => {
    const { classId } = req.params;
    try {
        // This query finds students who have answers where is_correct is still NULL
        const query = `
            SELECT DISTINCT u.id AS studentId, u.username AS studentName, COUNT(sa.id) AS pendingCount
            FROM student_answers sa
            JOIN users u ON sa.student_id = u.id
            JOIN quizzes q ON sa.quiz_id = q.id
            JOIN questions qq ON sa.question_id = qq.id
            WHERE q.classroom_id = ? AND sa.marks_awarded IS NULL AND qq.question_type = 'ESSAY'
            GROUP BY u.id`;
        
        const [rows] = await db.query(query, [classId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error fetching pending students" });
    }
};

// --- GOOGLE MEET LINK MANAGEMENT ---

exports.updateLiveLink = async (req, res) => {
    const { classId, live_link, scheduled_time } = req.body;

    // Log the data to your terminal so you can see if it's reaching the backend
    console.log("Updating Live Link for Class:", classId, "Time:", scheduled_time);

    try {
        const query = `
            UPDATE classrooms 
            SET live_link = ?, scheduled_time = ?, link_updated_at = NOW() 
            WHERE id = ?`;
        
        const [result] = await db.query(query, [live_link, scheduled_time, classId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Classroom not found" });
        }

        res.status(200).json({ message: "Live link updated successfully!" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getLiveLink = async (req, res) => {
    const { classId } = req.params;
    try {
        // Only selects the link if the current time is within 12 hours of link_updated_at
        const query = `
            SELECT live_link FROM classrooms 
            WHERE id = ? 
            AND link_updated_at >= NOW() - INTERVAL 12 HOUR
        `;
        const [rows] = await db.query(query, [classId]);

        if (rows.length > 0) {
            res.json({ live_link: rows[0].live_link });
        } else {
            // Returns null if the link is older than 12 hours or doesn't exist
            res.json({ live_link: null });
        }
    } catch (err) {
        console.error("Error fetching live link:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getLiveStatus = async (req, res) => {
    const { classId } = req.params;
    try {
        // We get the raw data without the 12-hour restriction for the lecturer
        const [rows] = await db.query(
            'SELECT live_link, scheduled_time FROM classrooms WHERE id = ?', 
            [classId]
        );
        res.json(rows[0] || { live_link: null, scheduled_time: null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all quizzes for a specific classroom
exports.getClassroomQuizzes = async (req, res) => {
    const { classId } = req.params;
    const query = `SELECT * FROM quizzes WHERE classroom_id = ? ORDER BY created_at DESC`;

    try {
        const [rows] = await db.query(query, [classId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    // Note: Due to Foreign Key constraints, this will also delete 
    // questions and results if your DB is set to ON DELETE CASCADE.
    const query = `DELETE FROM quizzes WHERE id = ?`;

    try {
        await db.query(query, [quizId]);
        res.json({ message: "Assessment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getQuizDetails = async (req, res) => {
    const { quizId } = req.params;

    try {
        // Fetch Quiz Header
        const [quiz] = await db.query(`SELECT * FROM quizzes WHERE id = ?`, [quizId]);
        if (quiz.length === 0) return res.status(404).json({ error: "Quiz not found" });

        // Fetch Questions associated with this quiz
        const [questions] = await db.query(`SELECT * FROM questions WHERE quiz_id = ?`, [quizId]);

        res.json({ ...quiz[0], questions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { title, description, questions } = req.body;

    try {
        // 1. Update Quiz Header
        await db.query(`UPDATE quizzes SET title = ?, description = ? WHERE id = ?`, [title, description, quizId]);

        // 2. Simplest way to update questions: Delete old ones and insert new ones
        // (Alternatively, you can loop and update by ID, but this is cleaner for dynamic forms)
        await db.query(`DELETE FROM questions WHERE quiz_id = ?`, [quizId]);

        for (let q of questions) {
            await db.query(
                `INSERT INTO questions (quiz_id, question_text, question_type, correct_answer) VALUES (?, ?, ?, ?)`,
                [quizId, q.question_text, q.question_type, q.correct_answer]
            );
        }

        res.json({ message: "Quiz updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};