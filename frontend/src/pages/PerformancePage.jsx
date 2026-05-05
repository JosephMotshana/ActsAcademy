import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PerformancePage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentHistories, setStudentHistories] = useState({});
    const [historyLoading, setHistoryLoading] = useState({});
    const [expandedStudents, setExpandedStudents] = useState({});

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

    const loadStudentHistory = async (studentId) => {
        setExpandedStudents(prev => ({ ...prev, [studentId]: !prev[studentId] }));

        if (studentHistories[studentId] || historyLoading[studentId]) return;

        setHistoryLoading(prev => ({ ...prev, [studentId]: true }));
        try {
            const res = await axios.get(`http://localhost:5000/api/student/test-history/${classId}/${studentId}`);
            setStudentHistories(prev => ({ ...prev, [studentId]: res.data }));
        } catch (err) {
            console.error(`Error fetching quiz history for student ${studentId}`, err);
        } finally {
            setHistoryLoading(prev => ({ ...prev, [studentId]: false }));
        }
    };

    useEffect(() => {
        fetchPerformance();
    }, [fetchPerformance, classId]); // Refetch when component mounts or classId changes

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
                            <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="2" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                                    No students enrolled in this class yet.
                                </td>
                            </tr>
                        ) : students.map(s => {
                            const hasSubmitted = s.quizzes_completed > 0;
                            return (
                                <React.Fragment key={s.student_id}>
                                    <tr style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: 'bold', color: '#333' }}>{s.student_name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>ID: #{s.student_id}</div>
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
                                            <button
                                                onClick={() => loadStudentHistory(s.student_id)}
                                                style={{
                                                    marginLeft: '10px',
                                                    backgroundColor: '#1976d2',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 16px',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {expandedStudents[s.student_id] ? 'Hide Quizzes' : 'Show Quizzes'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedStudents[s.student_id] && (
                                        <tr key={`details-${s.student_id}`} style={{ backgroundColor: '#f9fafb' }}>
                                            <td colSpan="2" style={{ padding: '15px' }}>
                                                {historyLoading[s.student_id] ? (
                                                    <div>Loading quiz details...</div>
                                                ) : (
                                                    <div>
                                                        <strong>Quiz Details</strong>
                                                        {studentHistories[s.student_id] && studentHistories[s.student_id].length > 0 ? (
                                                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                                                <thead>
                                                                    <tr style={{ backgroundColor: '#eeeeee', color: '#333' }}>
                                                                        <th style={{ padding: '10px', textAlign: 'left' }}>Quiz</th>
                                                                        <th style={{ padding: '10px', textAlign: 'left' }}>Score (%)</th>
                                                                        <th style={{ padding: '10px', textAlign: 'left' }}>Completed</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {studentHistories[s.student_id].map(history => (
                                                                        <tr key={history.quiz_id} style={{ borderBottom: '1px solid #ddd' }}>
                                                                            <td style={{ padding: '10px' }}>{history.title}</td>
                                                                            <td style={{ padding: '10px' }}>{history.score_percentage === null ? 'Pending' : Number(history.score_percentage).toFixed(0)}</td>
                                                                            <td style={{ padding: '10px' }}>{history.completed_at ? new Date(history.completed_at).toLocaleDateString() : '—'}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <div style={{ marginTop: '10px', color: '#666' }}>No quizzes have been completed yet.</div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PerformancePage;