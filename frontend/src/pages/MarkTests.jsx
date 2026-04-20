import React, { useState } from 'react';
import axios from 'axios';

const MarkTests = () => {
    const [reviewData, setReviewData] = useState(null);

    const handleViewDetails = async (resultId) => {
        const res = await axios.get(`http://localhost:5000/api/lecturer/review/${resultId}`);
        setReviewData(res.data);
    };

    return (
        <div>
            <h2>📝 Test Review Console</h2>
            {!reviewData ? (
                <p>Select a student result from the "Progress" page to see details.</p>
            ) : (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                    <button onClick={() => setReviewData(null)}>← Back to List</button>
                    <h3>Detailed Breakdown</h3>
                    {reviewData.map((item, idx) => (
                        <div key={idx} style={{ 
                            padding: '15px', 
                            borderLeft: `5px solid ${item.is_correct ? '#4caf50' : '#f44336'}`,
                            backgroundColor: '#f9f9f9',
                            marginBottom: '10px'
                        }}>
                            <p><strong>Q: {item.question_text}</strong></p>
                            <p>Student Answer: <span style={{ color: item.is_correct ? 'green' : 'red' }}>{item.selected_option}</span></p>
                            {!item.is_correct && <p style={{ color: 'green' }}>Correct Answer: {item.correct_option}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MarkTests;