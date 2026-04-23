import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PerformancePage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                // This calls the controller function we discussed earlier
                const res = await axios.get(`http://localhost:5000/api/lecturer/performance/${classId}`);
                setStudents(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching performance data", err);
                setLoading(false);
            }
        };
        fetchPerformance();
    }, [classId]);

    if (loading) return <p>Loading student data...</p>;

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ color: '#1a237e', marginBottom: '20px' }}>📈 Class Performance & Marking</h2>
            
            <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Student Name</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Current Score</th>
                            <th style={{ padding: '15px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No students found in this classroom.</td></tr>
                        ) : students.map(s => (
                            <tr key={s.student_id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{s.student_name}</span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {s.quizzes_completed > 0 ? 
                                        <span style={{ color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>Submitted</span> : 
                                        <span style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>No Submission</span>
                                    }
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {s.total_points_earned || 0} / {s.total_possible_points || 0}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button 
                                        onClick={() => navigate(`/lecturer/mark/${s.student_id}/${classId}`)}
                                        style={{ backgroundColor: '#1a237e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}
                                    >
                                        Review & Mark
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PerformancePage;