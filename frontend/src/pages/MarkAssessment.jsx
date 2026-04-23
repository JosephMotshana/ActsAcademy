import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MarkAssessment = () => {
    const { classId } = useParams();
    const [pendingAnswers, setPendingAnswers] = useState([]);
    const [marks, setMarks] = useState({}); // Stores { answerId: score }

    const fetchPending = async () => {
        const res = await axios.get(`http://localhost:5000/api/lecturer/pending-marks/${classId}`);
        setPendingAnswers(res.data);
    };

    useEffect(() => { fetchPending(); }, [classId]);

    const submitMark = async (answerId) => {
        const score = marks[answerId];
        if (score === undefined) return alert("Please enter a score");
        
        try {
            await axios.post(`http://localhost:5000/api/lecturer/submit-mark`, {
                answerId,
                marks: score
            });
            alert("Mark saved!");
            fetchPending(); // Refresh list
        } catch (err) {
            alert("Error saving mark");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>✍️ Mark Written Assessments</h2>
            {pendingAnswers.length === 0 ? <p>No pending answers to mark.</p> : (
                pendingAnswers.map(ans => (
                    <div key={ans.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd' }}>
                        <p><strong>Student:</strong> {ans.username}</p>
                        <p><strong>Question:</strong> {ans.question_text}</p>
                        <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', margin: '10px 0' }}>
                            <strong>Student Answer:</strong> <br /> {ans.answer_text}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input 
                                type="number" 
                                placeholder="Score (e.g. 10)" 
                                onChange={(e) => setMarks({...marks, [ans.id]: e.target.value})}
                                style={{ width: '100px', padding: '8px' }}
                            />
                            <button onClick={() => submitMark(ans.id)} style={{ background: '#1a237e', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '5px' }}>
                                Confirm Mark
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MarkAssessment;