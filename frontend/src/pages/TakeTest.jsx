import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TakeTest = ({ user }) => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [testInfo, setTestInfo] = useState(null);
    const [answers, setAnswers] = useState({}); // Stores { questionId: answerValue }

    useEffect(() => {
        const fetchTest = async () => {
            const res = await axios.get(`http://localhost:5000/api/student/test-details/${testId}`);
            setTestInfo(res.data);
        };
        fetchTest();
    }, [testId]);

    const handleInputChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`http://localhost:5000/api/student/submit-test`, {
                userId: user.id,
                testId: testId,
                answers: answers // Example: { 1: 'A', 2: 'My essay answer...' }
            });
            alert("Test submitted successfully!");
            navigate(-1); // Go back to available tests
        } catch (err) {
            alert("Error submitting test");
        }
    };

    if (!testInfo) return <p>Loading test...</p>;

    return (
        <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#1a237e' }}>{testInfo.title}</h2>
            <hr />
            
            {testInfo.questions.map((q, index) => (
                <div key={q.id} style={{ marginBottom: '40px', padding: '20px', borderBottom: '1px solid #eee' }}>
                    <p style={{ fontSize: '1.2rem' }}><strong>Q{index + 1}:</strong> {q.question_text}</p>
                    
                    {q.type === 'MCQ' ? (
                        <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                            {['a', 'b', 'c', 'd'].map(opt => (
                                <label key={opt} style={{ padding: '10px', background: '#f5f5f5', borderRadius: '5px', cursor: 'pointer' }}>
                                    <input 
                                        type="radio" 
                                        name={`q${q.id}`} 
                                        value={opt.toUpperCase()} 
                                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                                    />
                                    <span style={{ marginLeft: '10px' }}>{q[`option_${opt}`]}</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <textarea 
                            style={{ width: '100%', height: '150px', padding: '10px', marginTop: '10px', borderRadius: '5px' }}
                            placeholder="Type your answer here..."
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                        />
                    )}
                </div>
            ))}

            <button 
                onClick={handleSubmit}
                style={{ width: '100%', padding: '15px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
                Submit All Answers
            </button>
        </div>
    );
};

export default TakeTest;