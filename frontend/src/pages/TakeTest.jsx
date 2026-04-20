import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TakeTest = ({ studentId }) => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            const res = await axios.get(`http://localhost:5000/api/student/quiz/${quizId}`);
            setQuiz(res.data);
        };
        fetchQuiz();
    }, [quizId]);

    const handleSubmit = async () => {
        let correctCount = 0;
        quiz.questions.forEach(q => {
            if (answers[q.id] === q.correct_option) {
                correctCount++;
            }
        });

        const percentage = (correctCount / quiz.questions.length) * 100;

        try {
            await axios.post('http://localhost:5000/api/student/submit-quiz', {
                quizId,
                studentId,
                score: percentage
            });
            alert(`Test Submitted! Your score: ${percentage.toFixed(1)}%`);
            navigate(-1); // Go back to tests list
        } catch (err) {
            alert("Error submitting test");
        }
    };

    if (!quiz) return <p>Loading test...</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: 'white', borderRadius: '10px' }}>
            <h2>{quiz.title}</h2>
            <hr />
            {quiz.questions.map((q, idx) => (
                <div key={q.id} style={{ marginBottom: '25px', padding: '15px', borderBottom: '1px solid #eee' }}>
                    <p><strong>Q{idx + 1}: {q.question_text}</strong></p>
                    {['A', 'B', 'C', 'D'].map(opt => (
                        <label key={opt} style={{ display: 'block', margin: '10px 0', cursor: 'pointer' }}>
                            <input 
                                type="radio" 
                                name={`q${q.id}`} 
                                value={opt} 
                                onChange={() => setAnswers({...answers, [q.id]: opt})}
                            />
                            {opt}: {q[`option_${opt.toLowerCase()}`]}
                        </label>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit} style={{ padding: '15px 30px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', width: '100%', fontWeight: 'bold' }}>
                Submit Test
            </button>
        </div>
    );
};
// Inside handleSubmit in TakeTest.jsx
const handleSubmit = async () => {
    let details = quiz.questions.map(q => ({
        question_id: q.id,
        selected_option: answers[q.id] || null,
        is_correct: answers[q.id] === q.correct_option
    }));

    const correctCount = details.filter(d => d.is_correct).length;
    const percentage = (correctCount / quiz.questions.length) * 100;

    try {
        await axios.post('http://localhost:5000/api/student/submit-quiz', {
            quizId,
            studentId,
            score: percentage,
            answerDetails: details // Send the breakdown to the backend
        });
        alert("Test Submitted!");
        navigate(-1);
    } catch (err) { alert("Error submitting"); }
};

export default TakeTest;