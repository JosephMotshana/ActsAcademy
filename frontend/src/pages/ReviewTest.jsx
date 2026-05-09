import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ReviewTest = ({ user }) => {
    // Note: Parameter name should match what you defined in App.jsx
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
            // Refetch every 3 seconds to catch updated scores from lecturer marking
            const interval = setInterval(fetchReview, 3000);
            return () => clearInterval(interval);
        }
    }, [activeId, user.id]);

    if (error) return <div style={{ padding: '50px', textAlign: 'center' }}><h3>{error}</h3><button onClick={() => navigate(-1)}>Go Back</button></div>;
    if (!data) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading review...</p>;

    const { summary, details } = data;

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '30px 20px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                
                {/* Header Navigation */}
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ 
                        marginBottom: '20px', padding: '10px 20px', cursor: 'pointer',
                        background: '#fff', border: '1px solid #ddd', borderRadius: '8px',
                        fontWeight: '600', color: '#1a237e'
                    }}
                >
                    ← Back to History
                </button>

                {/* Result Summary Card */}
                <div style={{ 
                    backgroundColor: '#1a237e', color: 'white', padding: '30px', 
                    borderRadius: '15px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{summary.title}</h1>
                        <p style={{ opacity: 0.8, margin: '5px 0 0 0' }}>
                            Completed on: {new Date(summary.completed_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                            {summary.score_percentage !== null ? `${summary.score_percentage}%` : '---'}
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Final Grade</div>
                    </div>
                </div>

                {/* Questions List */}
                <div style={{ display: 'grid', gap: '20px' }}>
                    {details.map((q, index) => {
                        const isMCQ = q.type === 'MCQ';
                        const isCorrect = isMCQ && q.student_answer === q.correct_option;
                        const isPending = q.type === 'ESSAY' && q.marks_awarded === null;

                        return (
                            <div key={index} style={{ 
                                backgroundColor: 'white', padding: '25px', borderRadius: '12px',
                                borderLeft: `8px solid ${isMCQ ? (isCorrect ? '#2e7d32' : '#d32f2f') : '#1a237e'}`,
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#666' }}>Question {index + 1}</span>
                                    <span style={{ 
                                        fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase',
                                        color: isMCQ ? (isCorrect ? '#2e7d32' : '#d32f2f') : '#1a237e'
                                    }}>
                                        {q.type}
                                    </span>
                                </div>

                                <h3 style={{ margin: '0 0 20px 0', color: '#333', lineHeight: '1.4' }}>{q.question_text}</h3>
                                
                                <div style={{ padding: '15px', backgroundColor: '#fcfcfc', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem' }}>
                                        <strong>Your Answer:</strong> 
                                        <span style={{ marginLeft: '10px', color: isMCQ ? (isCorrect ? '#2e7d32' : '#d32f2f') : '#333' }}>
                                            {q.student_answer || <i>No answer provided</i>}
                                        </span>
                                    </p>

                                    {isMCQ ? (
                                        <>
                                            {!isCorrect && (
                                                <p style={{ margin: '10px 0 0 0', color: '#2e7d32', fontSize: '0.95rem' }}>
                                                    <strong>Correct Answer:</strong> {q.correct_option}
                                                </p>
                                            )}
                                            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', color: isCorrect ? '#2e7d32' : '#d32f2f' }}>
                                                {isCorrect ? ' Correct' : ' Incorrect'}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ 
                                            marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee',
                                            color: '#1a237e', fontWeight: 'bold' 
                                        }}>
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