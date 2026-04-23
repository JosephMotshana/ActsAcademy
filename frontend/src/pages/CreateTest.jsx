import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CreateTest = () => {
    const { classId } = useParams();
    const [testTitle, setTestTitle] = useState('');
    const [questions, setQuestions] = useState([
        { question_text: '', type: 'MCQ', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }
    ]);

    const addQuestion = (type) => {
        setQuestions([...questions, { 
            question_text: '', 
            type: type, // 'MCQ' or 'ESSAY'
            option_a: '', option_b: '', option_c: '', option_d: '', 
            correct_option: type === 'MCQ' ? 'A' : null 
        }]);
    };

    const updateQuestion = (index, field, value) => {
        const newQ = [...questions];
        newQ[index][field] = value;
        setQuestions(newQ);
    };

    const handleSaveTest = async () => {
        try {
            await axios.post('http://localhost:5000/api/lecturer/create-quiz', {
                classId,
                title: testTitle,
                questions: questions
            });
            alert("Assessment published successfully!");
        } catch (err) {
            alert("Error saving assessment");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#1a237e' }}>Create New Assessment</h2>
            <input 
                placeholder="Assessment Title (e.g., Biology Final Test)" 
                style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc' }}
                onChange={(e) => setTestTitle(e.target.value)}
            />

            {questions.map((q, index) => (
                <div key={index} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4>Question {index + 1} ({q.type})</h4>
                        <button onClick={() => setQuestions(questions.filter((_, i) => i !== index))} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                    </div>

                    <input 
                        placeholder="Enter Question Text" 
                        style={{ width: '100%', padding: '10px', marginBottom: '15px' }} 
                        value={q.question_text}
                        onChange={(e) => updateQuestion(index, 'question_text', e.target.value)} 
                    />
                    
                    {q.type === 'MCQ' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input placeholder="Option A" value={q.option_a} onChange={(e) => updateQuestion(index, 'option_a', e.target.value)} />
                            <input placeholder="Option B" value={q.option_b} onChange={(e) => updateQuestion(index, 'option_b', e.target.value)} />
                            <input placeholder="Option C" value={q.option_c} onChange={(e) => updateQuestion(index, 'option_c', e.target.value)} />
                            <input placeholder="Option D" value={q.option_d} onChange={(e) => updateQuestion(index, 'option_d', e.target.value)} />
                            
                            <select style={{ marginTop: '10px', padding: '8px' }} onChange={(e) => updateQuestion(index, 'correct_option', e.target.value)}>
                                <option value="A">Correct Option: A</option>
                                <option value="B">Correct Option: B</option>
                                <option value="C">Correct Option: C</option>
                                <option value="D">Correct Option: D</option>
                            </select>
                        </div>
                    ) : (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>Written Answer: Students will provide a text response for you to mark manually.</p>
                    )}
                </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                <button onClick={() => addQuestion('MCQ')} style={{ padding: '10px', cursor: 'pointer' }}>+ Add Multiple Choice</button>
                <button onClick={() => addQuestion('ESSAY')} style={{ padding: '10px', cursor: 'pointer' }}>+ Add Written Question</button>
            </div>

            <button 
                onClick={handleSaveTest} 
                style={{ width: '100%', padding: '15px', backgroundColor: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
                Finish & Publish Assessment
            </button>
        </div>
    );
};

export default CreateTest;