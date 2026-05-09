import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../style/global.css';

const CreateOrEditQuiz = () => {
    const { classId, quizId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!quizId;

    const [quizData, setQuizData] = useState({
        title: '',
        classroom_id: classId || '', 
        questions: [{ question_text: '', question_type: 'MCQ', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }]
    });

    useEffect(() => {
        if (isEditMode) {
            axios.get(`http://localhost:5000/api/lecturer/quiz-details/${quizId}`)
                .then(res => {
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
                await axios.put(`http://localhost:5000/api/lecturer/quiz/${quizId}`, quizData);
                alert("Assessment updated successfully!");
            } else {
                await axios.post(`http://localhost:5000/api/lecturer/create-quiz/${classId}`, quizData);
                alert("Assessment published!");
            }
            const finalClassId = classId || quizData.classroom_id;
            navigate(`/lecturer/class/${finalClassId}/manage-quizzes`);
        } catch (err) {
            console.error(err);
            alert("Error saving assessment.");
        }
    };

    return (
        <div className="quiz-editor-page">
            <button className="quiz-back-button" onClick={() => navigate(-1)}>Back</button>
            <h2 className="quiz-editor-title">{isEditMode ? 'Edit Assessment' : 'Create New Assessment'}</h2>
            
            <form onSubmit={handleSubmit} className="quiz-form">
                <div className="form-group-title">
                    <label className="form-label">Assessment Title</label>
                    <input 
                        className="form-input-title"
                        placeholder="e.g. Mid-term Biology Quiz" 
                        value={quizData.title}
                        onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                        required
                    />
                </div>

                <div className="questions-list">
                    {quizData.questions.map((q, index) => (
                        <div key={index} className="question-card">
                            <div className="question-card-header">
                                <h4>Question {index + 1} <span className="type-badge">{q.question_type}</span></h4>
                                <button type="button" className="remove-btn" onClick={() => removeQuestion(index)}>Remove</button>
                            </div>

                            <textarea 
                                className="question-textarea"
                                placeholder="Enter Question Text" 
                                value={q.question_text}
                                onChange={(e) => updateQuestion(index, 'question_text', e.target.value)} 
                                required
                            />
                            
                            {q.question_type === 'MCQ' ? (
                                <div className="mcq-options-grid">
                                    {['a', 'b', 'c', 'd'].map(opt => (
                                        <div key={opt} className="option-field">
                                            <label>Option {opt.toUpperCase()}</label>
                                            <input 
                                                className="option-input"
                                                placeholder={`Option ${opt.toUpperCase()}`} 
                                                value={q[`option_${opt}`]} 
                                                onChange={(e) => updateQuestion(index, `option_${opt}`, e.target.value)} 
                                                required 
                                            />
                                        </div>
                                    ))}
                                    
                                    <div className="correct-answer-select">
                                        <label>Correct Answer</label>
                                        <select 
                                            className="select-input"
                                            value={q.correct_option}
                                            onChange={(e) => updateQuestion(index, 'correct_option', e.target.value)}
                                        >
                                            <option value="A">A</option> <br />
                                            <option value="B">B</option><br />
                                            <option value="C">C</option><br />
                                            <option value="D">D</option><br />
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="essay-notice">
                                     <strong>Written Response:</strong> Students will be provided a free-text area.
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="add-question-controls">
                    <button type="button" className="secondary-btn" onClick={() => addQuestion('MCQ')}>+ Multiple Choice</button>
                    <button type="button" className="secondary-btn" onClick={() => addQuestion('ESSAY')}>+ Written Question</button>
                </div>

                <div className="form-submit-container">
                    <button type="submit" className="primary-submit-btn">
                        {isEditMode ? 'Save Changes' : 'Finish & Publish'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateOrEditQuiz;