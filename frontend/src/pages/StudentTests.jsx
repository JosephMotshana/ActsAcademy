import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudentTests = ({ user }) => {
    const { classId } = useParams();
    const [availableTests, setAvailableTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(null); // Track which test is loading
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailable = async () => {
            try {
                // Ensure classId and user.id exist before fetching
                if (classId && user?.id) {
                    const res = await axios.get(`http://localhost:5000/api/student/available-tests/${classId}/${user.id}`);
                    setAvailableTests(res.data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching available tests", err);
                setLoading(false);
            }
        };
        fetchAvailable();
    }, [classId, user.id]);

    const handleStartTest = (testId) => {
        setIsStarting(testId);
        // Navigate to the standalone route defined in App.jsx
        navigate(`/student/take-test/${testId}`);
    };

    if (loading) return <p style={{ padding: '20px', textAlign: 'center' }}>Checking for assessments...</p>;

    return (
        <div style={{ padding: '10px' }}>
            <h2 style={{ color: '#1a237e', marginBottom: '5px' }}> Pending Assessments</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Select a test to begin. Please ensure you have a stable connection.</p>
            
            <div style={{ display: 'grid', gap: '15px' }}>
                {availableTests.length > 0 ? availableTests.map(test => (
                    <div key={test.id} style={{ 
                        padding: '20px', 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0', 
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: window.innerWidth < 600 ? 'column' : 'row', // Responsive flip
                        justifyContent: 'space-between',
                        alignItems: window.innerWidth < 600 ? 'flex-start' : 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        gap: '15px'
                    }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', color: '#1a237e', fontSize: '1.2rem' }}>{test.title}</h3>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', color: '#888', backgroundColor: '#f0f2f5', padding: '2px 8px', borderRadius: '4px' }}>
                                    Created: {new Date(test.created_at).toLocaleDateString()}
                                </span>
                                <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 'bold' }}>
                                    Status: Ready
                                </span>
                            </div>
                        </div>

                        <button 
                            disabled={isStarting !== null}
                            onClick={() => handleStartTest(test.id)}
                            style={{ 
                                padding: '12px 30px', 
                                backgroundColor: isStarting === test.id ? '#888' : '#2e7d32', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: isStarting !== null ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                width: window.innerWidth < 600 ? '100%' : 'auto',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isStarting === test.id ? 'Starting...' : 'Start Test'}
                        </button>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9f9f9', borderRadius: '15px', border: '2px dashed #ddd' }}>
                        <span style={{ fontSize: '50px', display: 'block', marginBottom: '10px' }}>🎉</span>
                        <h3 style={{ color: '#1a237e', margin: '0' }}>All Caught Up!</h3>
                        <p style={{ color: '#666' }}>There are no pending assessments for you in this class at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentTests;
