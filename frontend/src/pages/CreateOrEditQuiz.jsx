import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CreateOrEditQuiz = () => {
    const { classId, quizId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!quizId;

    const [quizData, setQuizData] = useState({
        title: '',
        classroom_id: classId || '', // Store classroom_id in state
        questions: [{ question_text: '', question_type: 'MCQ', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }]
    });

    useEffect(() => {
        if (isEditMode) {
            axios.get(`http://localhost:5000/api/lecturer/quiz-details/${quizId}`)
                .then(res => {
                    // Ensure the state receives the full quiz object including the classroom_id
                    setQuizData(res.data);
                })
                .catch(err => console.error("Error loading quiz", err));
        }
    }, [quizId, isEditMode]);

    const addQuestion = (type) => {
        setQuizData({
            ...quizData,
            questions: [...quizData.questions, { 
                question_text: '', 
                question_type: type, 
                option_a: '', option_b: '', option_c: '', option_d: '', 
                correct_option: type === 'MCQ' ? 'A' : null 
            }]
        });
    };

    const updateQuestion = (index, field, value) => {
        const newQs = [...quizData.questions];
        newQs[index][field] = value;
        setQuizData({ ...quizData, questions: newQs });
    };

    const removeQuestion = (index) => {
        setQuizData({
            ...quizData,
            questions: quizData.questions.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                // UPDATE EXISTING
                await axios.put(`http://localhost:5000/api/lecturer/quiz/${quizId}`, quizData);
                alert("Assessment updated successfully!");
            } else {
                // CREATE NEW
                await axios.post(`http://localhost:5000/api/lecturer/create-quiz/${classId}`, quizData);
                alert("Assessment published!");
            }
            
            // Redirect back using the classId from params or the data itself
            const finalClassId = classId || quizData.classroom_id;
            navigate(`/lecturer/class/${finalClassId}/manage-quizzes`);
        } catch (err) {
            console.error(err);
            alert("Error saving assessment. Check console for details.");
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#1a237e' }}>{isEditMode ? '✍️ Edit Assessment' : '📝 Create New Assessment'}</h2>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Assessment Title</label>
                    <input 
                        placeholder="e.g. Mid-term Biology Quiz" 
                        value={quizData.title}
                        onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                        required
                    />
                </div>

                {quizData.questions.map((q, index) => (
                    <div key={index} style={questionContainerStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h4 style={{ margin: 0 }}>Question {index + 1} ({q.question_type})</h4>
                            <button type="button" onClick={() => removeQuestion(index)} style={{ color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                        </div>

                        <input 
                            placeholder="Enter Question Text" 
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd' }} 
                            value={q.question_text}
                            onChange={(e) => updateQuestion(index, 'question_text', e.target.value)} 
                            required
                        />
                        
                        {q.question_type === 'MCQ' ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {['a', 'b', 'c', 'd'].map(opt => (
                                    <div key={opt}>
                                        <label style={{ fontSize: '12px', color: '#666' }}>Option {opt.toUpperCase()}</label>
                                        <input 
                                            placeholder={`Option ${opt.toUpperCase()}`} 
                                            value={q[`option_${opt}`]} 
                                            onChange={(e) => updateQuestion(index, `option_${opt}`, e.target.value)} 
                                            style={optionInputStyle}
                                            required 
                                        />
                                    </div>
                                ))}
                                
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Correct Answer</label>
                                    <select 
                                        style={{ width: '100%', padding: '10px', borderRadius: '5px' }} 
                                        value={q.correct_option}
                                        onChange={(e) => updateQuestion(index, 'correct_option', e.target.value)}
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '8px', color: '#0d47a1' }}>
                                ℹ️ <strong>Written Response:</strong> Students will see a text box to type their answer.
                            </div>
                        )}
                    </div>
                ))}

                <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                    <button type="button" onClick={() => addQuestion('MCQ')} style={addBtnStyle}>+ Add Multiple Choice</button>
                    <button type="button" onClick={() => addQuestion('ESSAY')} style={addBtnStyle}>+ Add Written Question</button>
                </div>

                <button type="submit" style={publishBtnStyle}>
                    {isEditMode ? '💾 Save Changes' : '🚀 Finish & Publish'}
                </button>
            </form>
        </div>
    );
};

// --- STYLES ---

const questionContainerStyle = { 
    marginBottom: '30px', 
    padding: '25px', 
    backgroundColor: '#fff', 
    border: '1px solid #e0e0e0', 
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
};

const optionInputStyle = { 
    width: '100%', 
    padding: '10px', 
    borderRadius: '5px', 
    border: '1px solid #ccc' 
};

const addBtnStyle = { 
    flex: 1,
    padding: '12px', 
    cursor: 'pointer', 
    borderRadius: '8px', 
    border: '2px dashed #1a237e', 
    background: 'transparent', 
    color: '#1a237e',
    fontWeight: 'bold'
};

const publishBtnStyle = { 
    width: '100%', 
    padding: '18px', 
    backgroundColor: '#1a237e', 
    color: 'white', 
    border: 'none', 
    borderRadius: '10px', 
    fontWeight: 'bold', 
    fontSize: '1.1rem',
    cursor: 'pointer' 
};

export default CreateOrEditQuiz;