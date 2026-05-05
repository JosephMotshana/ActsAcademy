import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudentProgress = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [roster, setRoster] = useState([]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                // Ensure this endpoint matches your lecturerController.getStudentPerformance
                const res = await axios.get(`http://localhost:5000/api/lecturer/performance/${classId}`);
                setRoster(res.data);
            } catch (err) {
                console.error("Error fetching progress:", err);
            }
        };
        fetchProgress();
    }, [classId]);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1a237e' }}> Student Performance Tracking</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f2f5', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Student Name</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Tests Completed</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Total Points</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {roster.length === 0 ? (
                        <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No students enrolled.</td></tr>
                    ) : roster.map((s, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                            {/* Use s.student_name to match the controller query */}
                            <td style={{ padding: '12px', fontWeight: '500' }}>{s.student_name}</td>
                            <td style={{ padding: '12px' }}>{s.quizzes_completed || 0}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                {s.total_points_earned || 0} / {s.total_possible_points || 0}
                            </td>
                            <td style={{ padding: '12px' }}>
                                <button 
                                    onClick={() => navigate(`/lecturer/mark/${s.student_id}/${classId}`)}
                                    style={{ 
                                        backgroundColor: '#1a237e', 
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '6px 12px', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer' 
                                    }}
                                >
                                    Mark Test
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentProgress;