import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PerformancePage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPerformance = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/lecturer/performance/${classId}`);
            setStudents(res.data);
        } catch (err) {
            console.error("Error fetching performance data", err);
        } finally {
            setLoading(false);
        }
    }, [classId]);

    useEffect(() => {
        fetchPerformance();
    }, [fetchPerformance]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}><h3>⌛ Loading class data...</h3></div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#1a237e', margin: 0 }}>📈 Class Performance</h2>
                <button 
                    onClick={fetchPerformance}
                    style={{ padding: '8px 15px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                    🔄 Refresh Data
                </button>
            </div>
            
            <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1a237e', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Student Name</th>
                            <th style={{ padding: '15px' }}>Progress</th>
                            <th style={{ padding: '15px' }}>Total Marks</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                                    No students enrolled in this class yet.
                                </td>
                            </tr>
                        ) : students.map(s => {
                            const hasSubmitted = s.quizzes_completed > 0;
                            return (
                                <tr key={s.student_id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 'bold', color: '#333' }}>{s.student_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>ID: #{s.student_id}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ 
                                            color: hasSubmitted ? '#2e7d32' : '#d32f2f', 
                                            backgroundColor: hasSubmitted ? '#e8f5e9' : '#ffebee', 
                                            padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' 
                                        }}>
                                            {hasSubmitted ? `${s.quizzes_completed} Submission(s)` : 'No Submissions'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: '500' }}>
                                        {s.total_points_earned} / {s.total_possible_points}
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button 
                                            disabled={!hasSubmitted}
                                            onClick={() => navigate(`/lecturer/class/${classId}/mark-assessment/${s.student_id}`)}
                                            style={{ 
                                                backgroundColor: hasSubmitted ? '#1a237e' : '#ccc', 
                                                color: 'white', border: 'none', padding: '8px 16px', 
                                                borderRadius: '5px', cursor: hasSubmitted ? 'pointer' : 'not-allowed',
                                                transition: '0.3s'
                                            }}
                                        >
                                            {hasSubmitted ? 'Review & Mark' : 'Pending'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PerformancePage;