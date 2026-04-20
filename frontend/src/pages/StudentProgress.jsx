import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StudentProgress = () => {
    const { classId } = useParams();
    const [roster, setRoster] = useState([]);

    useEffect(() => {
        const fetchProgress = async () => {
            const res = await axios.get(`http://localhost:5000/api/lecturer/performance/${classId}`);
            setRoster(res.data);
        };
        fetchProgress();
    }, [classId]);

    return (
        <div>
            <h2>📊 Student Performance Tracking</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f2f5', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Student Name</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Tests Completed</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Recent Marks</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Average Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {roster.map((s, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>{s.username}</td>
                            <td style={{ padding: '12px' }}>{s.tests_taken || 0}</td>
                            <td style={{ padding: '12px', color: '#666' }}>
                                {s.recent_scores ? s.recent_scores.split(',').map(score => `${score}%`).join(' | ') : 'N/A'}
                            </td>
                            <td style={{ padding: '12px', fontWeight: 'bold', color: s.average_grade >= 50 ? '#2e7d32' : '#c62828' }}>
                                {s.average_grade ? `${parseFloat(s.average_grade).toFixed(1)}%` : '0%'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentProgress;