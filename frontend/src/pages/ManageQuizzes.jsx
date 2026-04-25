import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ManageQuizzes = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchQuizzes = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/lecturer/classroom/${classId}/quizzes`);
            setQuizzes(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching quizzes", err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchQuizzes(); }, [classId]);

    const handleDelete = async (quizId) => {
        if (window.confirm("Are you sure? This will delete all questions and student results for this quiz.")) {
            try {
                await axios.delete(`http://localhost:5000/api/lecturer/quiz/${quizId}`);
                setQuizzes(quizzes.filter(q => q.id !== quizId));
                alert("Assessment deleted.");
            } catch (err) {
                alert("Error deleting assessment.");
            }
        }
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading assessments...</p>;

    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ color: '#1a237e', margin: 0 }}>📝 Manage Assessments</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>View, edit, or remove assessments for this class.</p>
                </div>
                <button 
                    onClick={() => navigate(`/lecturer/class/${classId}/create-quiz`)} 
                    style={btnStyle}
                >
                    + Create New
                </button>
            </div>

            <div style={{ marginTop: '20px' }}>
                {quizzes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '10px', border: '1px dashed #ccc' }}>
                        <p>No assessments found for this classroom.</p>
                        <button 
                            onClick={() => navigate(`/lecturer/class/${classId}/create-quiz`)} 
                            style={btnStyle}
                        >
                            + Create Your First Quiz
                        </button>
                    </div>
                ) : (
                    quizzes.map(q => (
                        <div key={q.id} style={cardStyle}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{q.title}</h3>
                                <small style={{ color: '#888' }}>
                                    ID: {q.id} | Created: {new Date(q.created_at).toLocaleDateString()}
                                </small>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                    onClick={() => navigate(`/lecturer/class/${classId}/edit-quiz/${q.id}`)} 
                                    style={{ ...btnStyle, backgroundColor: '#4caf50' }}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(q.id)} 
                                    style={{ ...btnStyle, backgroundColor: '#d32f2f' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- STYLES ---

const cardStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeft: '5px solid #1a237e'
};

const btnStyle = {
    padding: '10px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#1a237e',
    fontWeight: 'bold',
    transition: 'opacity 0.2s'
};

export default ManageQuizzes;