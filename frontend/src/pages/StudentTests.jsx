import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../style/StudentGlobal.css';

const StudentTests = ({ user }) => {
    const { classId } = useParams();
    const [availableTests, setAvailableTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailable = async () => {
            try {
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
        navigate(`/student/take-test/${testId}`);
    };

    if (loading) return <p className="tests-loading">Checking for assessments...</p>;

    return (
        <div className="tests-page-container">
            <h2 className="tests-main-title">Pending Assessments</h2>
            <p className="tests-subtitle">Select a test to begin. Please ensure you have a stable connection.</p>
            
            <div className="tests-list-grid">
                {availableTests.length > 0 ? availableTests.map(test => (
                    <div key={test.id} className="test-assignment-card">
                        <div className="test-info-section">
                            <h3 className="test-item-title">{test.title}</h3>
                            <div className="test-meta-tags">
                                <span className="test-date-tag">
                                    Created: {new Date(test.created_at).toLocaleDateString()}
                                </span>
                                <span className="test-status-ready">
                                    Status: Ready
                                </span>
                            </div>
                        </div>

                        <button 
                            disabled={isStarting !== null}
                            onClick={() => handleStartTest(test.id)}
                            className={`btn-start-assessment ${isStarting === test.id ? 'loading' : ''}`}
                        >
                            {isStarting === test.id ? 'Starting...' : 'Start Test'}
                        </button>
                    </div>
                )) : (
                    <div className="tests-empty-state">
                        <h3 className="empty-title">All Caught Up!</h3>
                        <p className="empty-text">There are no pending assessments for you in this class at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentTests;
