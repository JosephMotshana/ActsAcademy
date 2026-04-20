import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StudentHistory = ({ user }) => {
    const { classId } = useParams();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/student/test-history/${classId}/${user.id}`);
                setHistory(res.data);
            } catch (err) {
                console.error("Error fetching history");
            }
        };
        fetchHistory();
    }, [classId, user.id]);

    return (
        <div>
            <h2>📊 My Test Results</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Test Title</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Date Completed</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, index) => (
                        <tr key={index}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{item.title}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                {new Date(item.completed_at).toLocaleDateString()}
                            </td>
                            <td style={{ 
                                padding: '12px', 
                                borderBottom: '1px solid #eee', 
                                fontWeight: 'bold',
                                color: item.score_percentage >= 50 ? '#2e7d32' : '#d32f2f'
                            }}>
                                {item.score_percentage}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {history.length === 0 && <p style={{ marginTop: '20px', color: '#666' }}>No tests completed yet.</p>}
        </div>
    );
};

export default StudentHistory;
