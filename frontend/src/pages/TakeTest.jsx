import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TakeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({}); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch test details
        axios.get(`http://localhost:5000/api/student/test-details/${testId}`)
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
        // 1. Retrieve the userId from storage
        // We check 'userId' because that's what we set in our fixed Login.jsx
        const userId = localStorage.getItem('userId'); 
        
        // 2. Validate session
        if (!userId || userId === 'undefined') {
            alert("User session not found. Please log in again.");
            navigate('/login'); 
            return;
        }

        try {
            const payload = {
                testId: parseInt(testId),
                userId: parseInt(userId),
                answers: answers // Object format: { question_id: "selected_option_or_text" }
            };

            console.log("Submitting Assessment:", payload);

            const response = await axios.post(`http://localhost:5000/api/student/submit-quiz`, payload);
            
            if (response.status === 201 || response.status === 200) {
                alert("Assessment submitted successfully!");
                // Navigate to student history so they can see their 'Pending' status
                navigate('/student/history'); 
            }
        } catch (err) {
            console.error("Submission Error:", err.response?.data || err.message);
            alert(`Failed to submit: ${err.response?.data?.error || "Server error. Check console."}`);
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Assessment...</div>;
    if (!test) return <div style={{ padding: '50px', textAlign: 'center' }}>Test not found.</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: '#1a237e', marginBottom: '30px' }}>{test.title}</h1>

            {test.questions.map((q, index) => (
                <div key={q.id} style={questionCardStyle}>
                    <h3 style={{ marginBottom: '20px' }}>{index + 1}. {q.question_text}</h3>

                    {q.question_type === 'MCQ' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                            {['A', 'B', 'C', 'D'].map((letter) => {
                                const optionText = q[`option_${letter.toLowerCase()}`];
                                const isSelected = answers[q.id] === letter;

                                return (
                                    <div 
                                        key={letter}
                                        onClick={() => handleAnswerChange(q.id, letter)}
                                        style={{
                                            ...optionBoxStyle,
                                            backgroundColor: isSelected ? '#e8eaf6' : 'white',
                                            borderColor: isSelected ? '#1a237e' : '#ddd',
                                            borderWidth: isSelected ? '2px' : '1px'
                                        }}
                                    >
                                        <div style={{
                                            ...radioCircleStyle,
                                            backgroundColor: isSelected ? '#1a237e' : 'transparent',
                                            borderColor: isSelected ? '#1a237e' : '#ccc'
                                        }} />
                                        <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{letter}.</span>
                                        {optionText}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <textarea 
                            placeholder="Type your answer here..."
                            style={essayInputStyle}
                            value={answers[q.id] || ""}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        />
                    )}
                </div>
            ))}

            <button onClick={handleSubmit} style={submitBtnStyle}>Submit Assessment</button>
        </div>
    );
};

// Styles
const questionCardStyle = { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '25px', borderLeft: '6px solid #1a237e' };
const optionBoxStyle = { padding: '15px 20px', borderRadius: '10px', border: '1px solid #ddd', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s ease-in-out' };
const radioCircleStyle = { width: '18px', height: '18px', borderRadius: '50%', border: '2px solid', marginRight: '15px' };
const essayInputStyle = { width: '100%', minHeight: '120px', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' };
const submitBtnStyle = { width: '100%', padding: '18px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' };

export default TakeTest;