import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Style/StudentGlobal.css';

const StudentHistory = ({ user }) => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/student/test-history/${classId}/${user.id}`);
            setHistory(res.data);
        } catch (err) {
            console.error("Error fetching history", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (classId && user?.id) {
            fetchHistory();
            const interval = setInterval(fetchHistory, 2000);
            return () => clearInterval(interval);
        }
    }, [classId, user?.id]);

    if (loading) return <p className="history-loading-text">Loading your history...</p>;

    return (
        <div className="history-container">
            <div className="history-header">
                <h2 className="history-title">My Assessment History</h2>
                <span className="assessment-counter">
                    {history.length} {history.length === 1 ? 'Assessment' : 'Assessments'}
                </span>
            </div>
            
            <div className="history-table-wrapper">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Assessment Title</th>
                            <th>Date Completed</th>
                            <th>Score</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length > 0 ? history.map((item, index) => {
                            const isPending = item.score_percentage === null || item.score_percentage === undefined;
                            const isPass = item.score_percentage >= 50;
                            
                            return (
                                <tr key={index} className="history-row">
                                    <td className="col-title">{item.title}</td>
                                    <td className="col-date">
                                        {new Date(item.completed_at).toLocaleDateString(undefined, { 
                                            year: 'numeric', month: 'short', day: 'numeric' 
                                        })}
                                    </td>
                                    <td className="col-score">
                                        {isPending ? (
                                            <span className="badge-pending">Pending</span>
                                        ) : (
                                            <div className={`score-circle ${isPass ? 'pass' : 'fail'}`}>
                                                {item.score_percentage}%
                                            </div>
                                        )}
                                    </td>
                                    <td className="col-action text-center">
                                        {!isPending ? (
                                            <button 
                                                onClick={() => navigate(`/student/review/${item.quiz_id}`)}
                                                className="btn-review-results"
                                            >
                                                Review Results
                                            </button>
                                        ) : (
                                            <span className="status-awaiting">Awaiting marking...</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="4" className="empty-history-cell">
                                    No assessments found for this class.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentHistory;