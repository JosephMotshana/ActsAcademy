import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Style/global.css';

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

    if (loading) return <p className="loading-text">Loading assessments...</p>;

    return (
        <div className="manage-quizzes-container">
            <div className="manage-header">
                <div className="header-text">
                    <h2 className="manage-title">Manage Assessments</h2>
                    <p className="manage-subtitle">View, edit, or remove assessments for this class.</p>
                </div>
                <button 
                    className="btn-create-new"
                    onClick={() => navigate(`/lecturer/class/${classId}/create-quiz`)}
                >
                    + Create New
                </button>
            </div>

            <div className="quizzes-list-wrapper">
                {quizzes.length === 0 ? (
                    <div className="empty-state">
                        <p>No assessments found for this classroom.</p>
                        <button 
                            className="btn-empty-create"
                            onClick={() => navigate(`/lecturer/class/${classId}/create-quiz`)}
                        >
                            + Create Your First Quiz
                        </button>
                    </div>
                ) : (
                    quizzes.map(q => (
                        <div key={q.id} className="quiz-list-item">
                            <div className="quiz-info">
                                <h3 className="quiz-item-title">{q.title}</h3>
                                <small className="quiz-meta">
                                    ID: {q.id} | Created: {new Date(q.created_at).toLocaleDateString()}
                                </small>
                            </div>
                            <div className="quiz-actions">
                                <button 
                                    className="btn-edit"
                                    onClick={() => navigate(`/lecturer/class/${classId}/edit-quiz/${q.id}`)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="btn-delete"
                                    onClick={() => handleDelete(q.id)}
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

export default ManageQuizzes;