import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudentTests = ({ user }) => {
    const { classId } = useParams();
    const [availableTests, setAvailableTests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailable = async () => {
            try {
                // Using the route we created in the backend step
                const res = await axios.get(`http://localhost:5000/api/student/available-tests/${classId}/${user.id}`);
                setAvailableTests(res.data);
            } catch (err) {
                console.error("Error fetching available tests", err);
            }
        };
        fetchAvailable();
    }, [classId, user.id]);

    return (
        <div>
            <h2>📝 Pending Assessments</h2>
            <p style={{ color: '#666' }}>The following tests are available for you to take.</p>
            
            <div style={{ marginTop: '20px', display: 'grid', gap: '15px' }}>
                {availableTests.length > 0 ? availableTests.map(test => (
                    <div key={test.id} style={{ 
                        padding: '20px', 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0', 
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', color: '#1a237e' }}>{test.title}</h3>
                            <span style={{ fontSize: '13px', color: '#888' }}>
                                Posted on: {new Date(test.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <button 
                            onClick={() => navigate(`/student/take-test/${test.id}`)}
                            style={{ 
                                padding: '10px 25px', 
                                backgroundColor: '#2e7d32', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Start Test
                        </button>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                        <span style={{ fontSize: '40px' }}>✅</span>
                        <p>You are all caught up! No pending tests for this class.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default StudentTests;
