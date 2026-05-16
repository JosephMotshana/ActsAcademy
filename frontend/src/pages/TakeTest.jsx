import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Style/StudentGlobal.css';

const TakeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({}); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/student/test-details/${testId}`)
            .then(res => {
                setTest(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading test", err);
                setLoading(false);
            });
    }, [testId]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        const userId = localStorage.getItem('userId'); 
        
        if (!userId || userId === 'undefined') {
            alert("User session not found. Please log in again.");
            navigate('/login'); 
            return;
        }

        try {
            const payload = {
                testId: parseInt(testId),
                userId: parseInt(userId),
                answers: answers 
            };

            const response = await axios.post(`/api/student/submit-quiz`, payload);
            
            if (response.status === 201 || response.status === 200) {
                alert("Assessment submitted successfully!");
                navigate('/student/history'); 
            }
        } catch (err) {
            console.error("Submission Error:", err.response?.data || err.message);
            alert(`Failed to submit: ${err.response?.data?.error || "Server error."}`);
        }
    };

    if (loading) return <div className="test-status-msg">Loading Assessment...</div>;
    if (!test) return <div className="test-status-msg">Test not found.</div>;

    return (
        <div className="take-test-container">
            <h1 className="take-test-title">{test.title}</h1>

            {test.questions.map((q, index) => (
                <div key={q.id} className="question-card">
                    <h3 className="question-text">{index + 1}. {q.question_text}</h3>

                    {q.question_type === 'MCQ' ? (
                        <div className="options-grid">
                            {['A', 'B', 'C', 'D'].map((letter) => {
                                const optionText = q[`option_${letter.toLowerCase()}`];
                                const isSelected = answers[q.id] === letter;

                                return (
                                    <div 
                                        key={letter}
                                        onClick={() => handleAnswerChange(q.id, letter)}
                                        className={`option-box ${isSelected ? 'selected' : ''}`}
                                    >
                                        <div className={`radio-circle ${isSelected ? 'selected' : ''}`} />
                                        <span className="option-letter">{letter}.</span>
                                        {optionText}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <textarea 
                            className="essay-input"
                            placeholder="Type your answer here..."
                            value={answers[q.id] || ""}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        />
                    )}
                </div>
            ))}

            <button onClick={handleSubmit} className="btn-submit-assessment">
                Submit Assessment
            </button>
        </div>
    );
};

export default TakeTest;