import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Style/StudentGlobal.css';

const ReviewTest = ({ user }) => {
    const { quizId, testId } = useParams();
    const activeId = quizId || testId; 
    
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/student/review/${activeId}/${user.id}`);
                setData(res.data);
            } catch (err) {
                console.error("Error fetching review:", err);
                setError("Could not load the assessment review.");
            }
        };
        if (activeId && user?.id) {
            fetchReview();
            const interval = setInterval(fetchReview, 3000);
            return () => clearInterval(interval);
        }
    }, [activeId, user.id]);

    if (error) return (
        <div className="review-error-container">
            <h3>{error}</h3>
            <button className="btn-back-nav" onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );

    if (!data) return <p className="review-loading-text">Loading review...</p>;

    const { summary, details } = data;

    return (
        <div className="review-page-wrapper">
            <div className="review-content-container">
                
                {/* Header Navigation */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="btn-back-nav"
                >
                    ← Back to History
                </button>

                {/* Result Summary Card */}
                <div className="review-summary-card">
                    <div className="summary-info">
                        <h1 className="summary-title">{summary.title}</h1>
                        <p className="summary-date">
                            Completed on: {new Date(summary.completed_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="summary-score-section">
                        <div className="summary-score-value">
                            {summary.score_percentage !== null ? `${summary.score_percentage}%` : '---'}
                        </div>
                        <div className="summary-score-label">Final Grade</div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="review-questions-list">
                    {details.map((q, index) => {
                        const isMCQ = q.type === 'MCQ';
                        const isCorrect = isMCQ && q.student_answer === q.correct_option;
                        const isPending = q.type === 'ESSAY' && q.marks_awarded === null;

                        // Dynamic status class based on result
                        const statusClass = isMCQ ? (isCorrect ? 'correct' : 'incorrect') : 'essay';

                        return (
                            <div key={index} className={`review-question-card ${statusClass}`}>
                                <div className="question-header">
                                    <span className="question-number">Question {index + 1}</span>
                                    <span className={`question-type-tag ${statusClass}`}>
                                        {q.type}
                                    </span>
                                </div>

                                <h3 className="question-text-heading">{q.question_text}</h3>
                                
                                <div className="answer-review-box">
                                    <p className="user-answer-row">
                                        <strong>Your Answer:</strong> 
                                        <span className={`user-answer-text ${statusClass}`}>
                                            {q.student_answer || <i>No answer provided</i>}
                                        </span>
                                    </p>

                                    {isMCQ ? (
                                        <>
                                            {!isCorrect && (
                                                <p className="correct-answer-row">
                                                    <strong>Correct Answer:</strong> {q.correct_option}
                                                </p>
                                            )}
                                            <div className={`mcq-status-badge ${statusClass}`}>
                                                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="essay-marks-row">
                                            {isPending ? ' Waiting for Lecturer to mark...' : ` Marks Awarded: ${q.marks_awarded}`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReviewTest;