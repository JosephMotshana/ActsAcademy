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
    const { classId, title, questions } = req.body;
    try {
        const [result] = await db.query('INSERT INTO quizzes (class_id, title) VALUES (?, ?)', [classId, title]);
        const quizId = result.insertId;

        const questionValues = questions.map(q => [
            quizId, q.question_text, q.type, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option
        ]);

        await db.query(
            'INSERT INTO questions (quiz_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_option) VALUES ?',
            [questionValues]
        );

        res.status(201).json({ message: "Assessment created!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
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

exports.getStudentPerformance = async (req, res) => {
    const { classId } = req.params;
    try {
        const [performance] = await db.query(`
            SELECT 
                u.id AS student_id, 
                u.username AS student_name, 
                COUNT(DISTINCT r.id) AS quizzes_completed,
                SUM(sa.earned_points) AS total_points_earned,
                (SELECT SUM(max_points) FROM questions q 
                 JOIN quizzes qz ON q.quiz_id = qz.id 
                 WHERE qz.classroom_id = ?) AS total_possible_points
            FROM users u
            JOIN student_classes sc ON u.id = sc.student_id
            LEFT JOIN results r ON u.id = r.student_id
            LEFT JOIN student_answers sa ON r.id = sa.result_id
            WHERE sc.classroom_id = ?
            GROUP BY u.id
        `, [classId, classId]);
        
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
// Fetch essay answers that are not yet marked
exports.getPendingMarks = async (req, res) => {
    const { classId } = req.params;
    try {
        const query = `
            SELECT sea.*, u.username, q.question_text 
            FROM student_essay_answers sea
            JOIN users u ON sea.student_id = u.id
            JOIN questions q ON sea.question_id = q.id
            JOIN quizzes qz ON sea.quiz_id = qz.id
            WHERE qz.class_id = ? AND sea.is_marked = FALSE`;
        const [rows] = await db.query(query, [classId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Submit the mark for a specific answer
exports.submitMark = async (req, res) => {
    const { answerId, marks } = req.body;
    try {
        await db.query(
            'UPDATE student_essay_answers SET marks_awarded = ?, is_marked = TRUE WHERE id = ?',
            [marks, answerId]
        );
        res.json({ message: "Mark submitted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
