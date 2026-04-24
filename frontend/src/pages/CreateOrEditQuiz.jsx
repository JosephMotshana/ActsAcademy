import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CreateOrEditQuiz = () => {
    const { classId, quizId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!quizId;

    const [quizData, setQuizData] = useState({
        title: '',
        questions: [{ question_text: '', question_type: 'MCQ', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }]
    });

    useEffect(() => {
        if (isEditMode) {
            axios.get(`http://localhost:5000/api/lecturer/quiz-details/${quizId}`)
                .then(res => setQuizData(res.data))
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
                await axios.put(`http://localhost:5000/api/lecturer/quiz/${quizId}`, quizData);
                alert("Assessment updated!");
            } else {
                await axios.post(`http://localhost:5000/api/lecturer/create-quiz/${classId}`, quizData);
                alert("Assessment published!");
            }
            // Navigate back to management
            navigate(`/lecturer/class/${classId || quizData.classroom_id}/manage-quizzes`);
        } catch (err) {
            alert("Error saving assessment");
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#1a237e' }}>{isEditMode ? '✍️ Edit Assessment' : '📝 Create New Assessment'}</h2>
            
            <form onSubmit={handleSubmit}>
                <input 
                    placeholder="Assessment Title" 
                    value={quizData.title}
                    onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                    style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc' }}
                    required
                />

                {quizData.questions.map((q, index) => (
                    <div key={index} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4>Question {index + 1} ({q.question_type})</h4>
                            <button type="button" onClick={() => removeQuestion(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                        </div>

                        <input 
                            placeholder="Enter Question Text" 
                            style={{ width: '100%', padding: '10px', marginBottom: '15px' }} 
                            value={q.question_text}
                            onChange={(e) => updateQuestion(index, 'question_text', e.target.value)} 
                            required
                        />
                        
                        {q.question_type === 'MCQ' ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input placeholder="Option A" value={q.option_a} onChange={(e) => updateQuestion(index, 'option_a', e.target.value)} required />
                                <input placeholder="Option B" value={q.option_b} onChange={(e) => updateQuestion(index, 'option_b', e.target.value)} required />
                                <input placeholder="Option C" value={q.option_c} onChange={(e) => updateQuestion(index, 'option_c', e.target.value)} required />
                                <input placeholder="Option D" value={q.option_d} onChange={(e) => updateQuestion(index, 'option_d', e.target.value)} required />
                                
                                <select 
                                    style={{ marginTop: '10px', padding: '8px' }} 
                                    value={q.correct_option}
                                    onChange={(e) => updateQuestion(index, 'correct_option', e.target.value)}
                                >
                                    <option value="A">Correct: A</option>
                                    <option value="B">Correct: B</option>
                                    <option value="C">Correct: C</option>
                                    <option value="D">Correct: D</option>
                                </select>
                            </div>
                        ) : (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>Written Response: Students will type their answer for you to mark later.</p>
                        )}
                    </div>
                ))}

                <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                    <button type="button" onClick={() => addQuestion('MCQ')} style={addBtnStyle}>+ Multiple Choice</button>
                    <button type="button" onClick={() => addQuestion('ESSAY')} style={addBtnStyle}>+ Written Question</button>
                </div>

                <button type="submit" style={publishBtnStyle}>
                    {isEditMode ? 'Update Assessment' : 'Finish & Publish'}
                </button>
            </form>
        </div>
    );
};

const addBtnStyle = { padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #1a237e', background: 'white', color: '#1a237e' };
const publishBtnStyle = { width: '100%', padding: '15px', backgroundColor: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

export default CreateOrEditQuiz;