import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const MarkAssessment = () => {
    const { classId, studentId } = useParams();
    const navigate = useNavigate();
    
    const [studentsWithPending, setStudentsWithPending] = useState([]);
    const [pendingAnswers, setPendingAnswers] = useState([]);
    const [marks, setMarks] = useState({});
    const [loading, setLoading] = useState(true);

    // If no studentId, fetch list of students with pending assessments
    const fetchStudentsWithPending = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/lecturer/pending-students/${classId}`);
            setStudentsWithPending(res.data); // Assume API returns array of {studentId, studentName, pendingCount}
        } catch (err) {
            console.error("Error fetching students with pending marks:", err);
            // Fallback: Redirect to Performance page or show error
            alert("Unable to load student list. Redirecting to Performance page.");
            navigate(`/lecturer/class/${classId}/performance`);
        } finally {
            setLoading(false);
        }
    };

    // If studentId exists, fetch pending answers for that student
    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/lecturer/pending-marks/${classId}/${studentId}`);
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
    const score = marks[answerId];
    if (score === undefined || score === "") return alert("Please enter a score");
    
    try {
        await axios.post(`http://localhost:5000/api/lecturer/submit-mark`, {
            answerId,
            marks: score
        });
        
        // 1. Remove the marked item from the local state array immediately
        // This removes just that one question instead of refreshing everything
        setPendingAnswers(prev => prev.filter(ans => ans.id !== answerId));
        
        // 2. Clear that specific input
        const newMarks = { ...marks };
        delete newMarks[answerId];
        setMarks(newMarks);

        alert("Mark saved!");

    } catch (err) {
        alert("Error saving mark");
    }
};

    // After all marks are submitted, add a button to go back and refresh
    const handleBackToPerformance = () => {
        navigate(`/lecturer/class/${classId}/performance?refresh=${Date.now()}`);
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

    // If no studentId, show student list
    if (!studentId) {
        return (
            <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
                <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer' }}>
                    ← Back
                </button>
                
                <h2 style={{ color: '#1a237e' }}>📋 Select Student to Mark Assessments</h2>
                
                {studentsWithPending.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '10px' }}>
                        <p>No students with pending assessments.</p>
                    </div>
                ) : (
                    studentsWithPending.map(student => (
                        <div key={student.studentId} style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <p><strong>{student.studentName}</strong> (ID: {student.studentId})</p>
                            <p>Pending Assessments: {student.pendingCount}</p>
                            <Link 
                                to={`/lecturer/class/${classId}/mark-assessment/${student.studentId}`}
                                style={{ background: '#1a237e', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', display: 'inline-block' }}
                            >
                                Mark Assessments
                            </Link>
                        </div>
                    ))
                )}
            </div>
        );
    }

    // If studentId exists, show marking interface
    return (
        <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={handleBackToPerformance} style={{ marginBottom: '20px', cursor: 'pointer' }}>
                ← Back to Performance (Refreshes Data)
            </button>
            
            <h2 style={{ color: '#1a237e' }}>✍️ Mark Assessments</h2>
            <p style={{ color: '#666' }}>Reviewing submissions for Student #{studentId}</p>

            {pendingAnswers.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '10px' }}>
                    <p>All answers for this student have been marked!</p>
                </div>
            ) : (
                pendingAnswers.map(ans => (
                    <div key={ans.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <p><strong>Question:</strong> {ans.question_text}</p>
                        <div style={{ background: '#f0f4f8', padding: '15px', borderRadius: '5px', margin: '10px 0', borderLeft: '4px solid #1a237e' }}>
                            <strong>Student Answer:</strong> <br /> 
                            <span style={{ whiteSpace: 'pre-wrap' }}>{ans.answer_text}</span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '15px' }}>
                            <input 
                                type="number" 
                                placeholder="Enter Marks" 
                                value={marks[ans.id] || ""}
                                onChange={(e) => setMarks({...marks, [ans.id]: e.target.value})}
                                style={{ width: '120px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                            <button 
                                onClick={() => submitMark(ans.id)} 
                                style={{ background: '#1a237e', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Confirm Mark
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MarkAssessment;