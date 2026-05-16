import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../../Style/global.css';

const MarkAssessment = () => {
    const { classId, studentId } = useParams();
    const navigate = useNavigate();
    
    const [studentsWithPending, setStudentsWithPending] = useState([]);
    const [pendingAnswers, setPendingAnswers] = useState([]);
    const [marks, setMarks] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchStudentsWithPending = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/lecturer/pending-students/${classId}`);
            setStudentsWithPending(res.data); 
        } catch (err) {
            console.error("Error fetching students with pending marks:", err);
            alert("Unable to load student list. Redirecting to Performance page.");
            navigate(`/lecturer/class/${classId}/performance`);
        } finally {
            setLoading(false);
        }
    };

    const fetchPending = async () => {
        setLoading(true);
        try {
                const res = await axios.get(`/api/lecturer/pending-marks/${classId}/${studentId}`);
            setPendingAnswers(res.data);
        } catch (err) {
            console.error("Error fetching pending marks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (classId) {
            if (studentId) {
                fetchPending();
            } else {
                fetchStudentsWithPending();
            }
        }
    }, [classId, studentId]);

    const submitMark = async (answerId) => {
        const rawScore = marks[answerId];
        if (rawScore === undefined || rawScore === "") return alert("Please enter a score");

        const score = Number(rawScore);
        if (Number.isNaN(score)) return alert("Please enter a valid numeric score");
        if (score < 0) return alert("Score cannot be negative. Please enter zero or higher.");
        
        try {
            await axios.post(`/api/lecturer/submit-mark`, {
                answerId,
                marks: score
            });
            
            setPendingAnswers(prev => prev.filter(ans => ans.id !== answerId));
            const newMarks = { ...marks };
            delete newMarks[answerId];
            setMarks(newMarks);
            alert("Mark saved!");

        } catch (err) {
            alert("Error saving mark");
        }
    };

    const handleBackToPerformance = () => {
        navigate(`/lecturer/class/${classId}/performance?refresh=${Date.now()}`);
    };

    if (loading) return <div className="loading-container">Loading...</div>;

    if (!studentId) {
        return (
            <div className="mark-page-container">
                <button onClick={() => navigate(-1)} className="btn-back-link">
                    ← Back
                </button>
                
                <h2 className="mark-page-title">Select Student to Mark Assessments</h2>
                
                <div className="student-list-wrapper">
                    {studentsWithPending.length === 0 ? (
                        <div className="empty-marking-state">
                            <p>No students with pending assessments.</p>
                        </div>
                    ) : (
                        studentsWithPending.map(student => (
                            <div key={student.studentId} className="student-mark-card">
                                <div className="student-info">
                                    <p className="student-name-text"><strong>{student.studentName}</strong> (ID: {student.studentId})</p>
                                    <p className="pending-count-text">Pending Assessments: {student.pendingCount}</p>
                                </div>
                                <Link 
                                    to={`/lecturer/class/${classId}/mark-assessment/${student.studentId}`}
                                    className="btn-mark-action"
                                >
                                    Mark Assessments
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="mark-page-container">
            <button onClick={handleBackToPerformance} className="btn-back-link">
                ← Back to Performance (Refreshes Data)
            </button>
            
            <h2 className="mark-page-title">Mark Assessments</h2>
            <p className="mark-page-subtitle">Reviewing submissions for Student #{studentId}</p>

            <div className="pending-submissions-list">
                {pendingAnswers.length === 0 ? (
                    <div className="empty-marking-state">
                        <p>All answers for this student have been marked!</p>
                    </div>
                ) : (
                    pendingAnswers.map(ans => (
                        <div key={ans.id} className="submission-card">
                            <p className="question-text-display"><strong>Question:</strong> {ans.question_text}</p>
                            <div className="student-answer-box">
                                <strong>Student Answer:</strong> <br /> 
                                <span className="answer-content">{ans.answer_text}</span>
                            </div>
                            
                            <div className="marking-input-group">
                                <input 
                                    type="number" 
                                    placeholder="Enter Marks" 
                                    min="0"
                                    className="score-input"
                                    value={marks[ans.id] || ""}
                                    onChange={(e) => setMarks({...marks, [ans.id]: e.target.value})}
                                />
                                <button 
                                    onClick={() => submitMark(ans.id)} 
                                    className="btn-confirm-mark"
                                >
                                    Confirm Mark
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MarkAssessment;