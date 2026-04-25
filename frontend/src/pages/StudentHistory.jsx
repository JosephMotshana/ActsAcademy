import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudentHistory = ({ user }) => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        if (classId && user?.id) {
            fetchHistory();
            // Refetch every 2 seconds to see updated marks
            const interval = setInterval(fetchHistory, 2000);
            return () => clearInterval(interval);
        }
    }, [classId, user?.id]);

    if (loading) return <p style={{ padding: '40px', textAlign: 'center', color: '#1a237e' }}>Loading your history...</p>;

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ color: '#1a237e', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>📊</span> My Assessment History
                </h2>
                <span style={{ backgroundColor: '#e8eaf6', color: '#1a237e', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {history.length} {history.length === 1 ? 'Assessment' : 'Assessments'}
                </span>
            </div>
            
            <div style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1a237e', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '18px 20px' }}>Assessment Title</th>
                            <th style={{ padding: '18px 20px' }}>Date Completed</th>
                            <th style={{ padding: '18px 20px' }}>Score</th>
                            <th style={{ padding: '18px 20px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length > 0 ? history.map((item, index) => {
                            const isPending = item.score_percentage === null || item.score_percentage === undefined;
                            
                            return (
                                <tr key={index} className="history-row" style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.3s' }}>
                                    <td style={{ padding: '18px 20px', fontWeight: '600', color: '#333' }}>{item.title}</td>
                                    <td style={{ padding: '18px 20px', color: '#666' }}>
                                        {new Date(item.completed_at).toLocaleDateString(undefined, { 
                                            year: 'numeric', month: 'short', day: 'numeric' 
                                        })}
                                    </td>
                                    <td style={{ padding: '18px 20px' }}>
                                        {isPending ? (
                                            <span style={{ 
                                                backgroundColor: '#fff9c4', 
                                                color: '#f57f17', 
                                                padding: '6px 14px', 
                                                borderRadius: '20px', 
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                border: '1px solid #fff176'
                                            }}>
                                                ⏳ Pending
                                            </span>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ 
                                                    width: '40px', height: '40px', borderRadius: '50%', 
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    backgroundColor: item.score_percentage >= 50 ? '#e8f5e9' : '#ffebee',
                                                    color: item.score_percentage >= 50 ? '#2e7d32' : '#d32f2f',
                                                    fontWeight: 'bold', fontSize: '0.8rem', border: `1px solid ${item.score_percentage >= 50 ? '#c8e6c9' : '#ffcdd2'}`
                                                }}>
                                                    {item.score_percentage}%
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                                        {!isPending ? (
                                            <button 
                                                onClick={() => navigate(`/student/review/${item.quiz_id}`)}
                                                style={{ 
                                                    padding: '8px 18px', 
                                                    backgroundColor: '#1a237e', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    borderRadius: '8px', 
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 2px 4px rgba(26, 35, 126, 0.2)'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.backgroundColor = '#283593';
                                                    e.target.style.transform = 'translateY(-1px)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.backgroundColor = '#1a237e';
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                Review Results
                                            </button>
                                        ) : (
                                            <span style={{ color: '#aaa', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                                Awaiting marking...
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📁</div>
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