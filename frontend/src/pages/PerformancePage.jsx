import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Style/global.css';

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
            const res = await axios.get(`/api/lecturer/performance/${classId}`);
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
            const res = await axios.get(`/api/student/test-history/${classId}/${studentId}`);
            setStudentHistories(prev => ({ ...prev, [studentId]: res.data }));
        } catch (err) {
            console.error(`Error fetching quiz history for student ${studentId}`, err);
        } finally {
            setHistoryLoading(prev => ({ ...prev, [studentId]: false }));
        }
    };

    useEffect(() => {
        fetchPerformance();
    }, [fetchPerformance, classId]);

    if (loading) return (
        <div className="performance-loading-screen">
            <h3> Loading class data...</h3>
        </div>
    );

    return (
        <div className="performance-container">
            <div className="performance-header">
                <h2 className="performance-title">Class Performance</h2>
                <button 
                    onClick={fetchPerformance}
                    className="btn-refresh-data"
                >
                    🔄 Refresh Data
                </button>
            </div>
            
            <div className="performance-table-card">
                <table className="performance-main-table">
                    <thead>
                        <tr className="table-header-row">
                            <th>Student Name</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="table-empty-message">
                                    No students enrolled in this class yet.
                                </td>
                            </tr>
                        ) : students.map(s => {
                            const hasSubmitted = s.quizzes_completed > 0;
                            return (
                                <React.Fragment key={s.student_id}>
                                    <tr className="student-row">
                                        <td className="student-identity-cell">
                                            <div className="student-name-bold">{s.student_name}</div>
                                            <div className="student-id-subtext">ID: #{s.student_id}</div>
                                        </td>
                                        <td className="student-actions-cell">
                                            <button 
                                                disabled={!hasSubmitted}
                                                onClick={() => navigate(`/lecturer/class/${classId}/mark-assessment/${s.student_id}`)}
                                                className={`btn-review-mark ${hasSubmitted ? 'active' : 'disabled'}`}
                                            >
                                                {hasSubmitted ? 'Review & Mark' : 'Pending'}
                                            </button>
                                            <button
                                                onClick={() => loadStudentHistory(s.student_id)}
                                                className="btn-toggle-history"
                                            >
                                                {expandedStudents[s.student_id] ? 'Hide Quizzes' : 'Show Quizzes'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedStudents[s.student_id] && (
                                        <tr key={`details-${s.student_id}`} className="history-details-row">
                                            <td colSpan="2" className="history-details-cell">
                                                {historyLoading[s.student_id] ? (
                                                    <div className="history-loading-text">Loading quiz details...</div>
                                                ) : (
                                                    <div className="history-content-wrapper">
                                                        <strong className="history-label">Quiz Details</strong>
                                                        {studentHistories[s.student_id] && studentHistories[s.student_id].length > 0 ? (
                                                            <table className="inner-history-table">
                                                                <thead>
                                                                    <tr className="inner-header-row">
                                                                        <th>Quiz</th>
                                                                        <th>Score (%)</th>
                                                                        <th>Completed</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {studentHistories[s.student_id].map(history => (
                                                                        <tr key={history.quiz_id} className="inner-body-row">
                                                                            <td>{history.title}</td>
                                                                            <td>{history.score_percentage === null ? 'Pending' : Number(history.score_percentage).toFixed(0)}</td>
                                                                            <td>{history.completed_at ? new Date(history.completed_at).toLocaleDateString() : '—'}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <div className="no-history-text">No quizzes have been completed yet.</div>
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