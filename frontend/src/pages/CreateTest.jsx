import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CreateTest = () => {
    const { classId } = useParams();
    const [testTitle, setTestTitle] = useState('');
    const [questions, setQuestions] = useState([
        { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }]);
    };

    const handleSaveTest = async () => {
        try {
            await axios.post('http://localhost:5000/api/lecturer/create-quiz', {
                classId,
                title: testTitle,
                questions: questions
            });
            alert("Quiz created successfully!");
        } catch (err) {
            alert("Error saving quiz");
        }
    };

    return (
        <div>
            <h2>Create New Assessment</h2>
            <input 
                placeholder="Test Title (e.g., Midterm Exam)" 
                style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                onChange={(e) => setTestTitle(e.target.value)}
            />

            {questions.map((q, index) => (
                <div key={index} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h4>Question {index + 1}</h4>
                    <input placeholder="Enter Question" style={{ width: '100%', marginBottom: '10px' }} 
                           onChange={(e) => { const newQ = [...questions]; newQ[index].question_text = e.target.value; setQuestions(newQ); }} />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input placeholder="Option A" onChange={(e) => { const newQ = [...questions]; newQ[index].option_a = e.target.value; setQuestions(newQ); }} />
                        <input placeholder="Option B" onChange={(e) => { const newQ = [...questions]; newQ[index].option_b = e.target.value; setQuestions(newQ); }} />
                        <input placeholder="Option C" onChange={(e) => { const newQ = [...questions]; newQ[index].option_c = e.target.value; setQuestions(newQ); }} />
                        <input placeholder="Option D" onChange={(e) => { const newQ = [...questions]; newQ[index].option_d = e.target.value; setQuestions(newQ); }} />
                    </div>
                    
                    <select style={{ marginTop: '10px' }} onChange={(e) => { const newQ = [...questions]; newQ[index].correct_option = e.target.value; setQuestions(newQ); }}>
                        <option value="A">Correct: A</option>
                        <option value="B">Correct: B</option>
                        <option value="C">Correct: C</option>
                        <option value="D">Correct: D</option>
                    </select>
                </div>
            ))}

            <button onClick={addQuestion} style={{ marginRight: '10px' }}>+ Add Question</button>
            <button onClick={handleSaveTest} style={{ backgroundColor: '#4CAF50', color: 'white' }}>Finish & Publish Test</button>
        </div>
    );
};

export default CreateTest;