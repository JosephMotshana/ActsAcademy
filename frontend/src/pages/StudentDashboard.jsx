import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = ({ studentId }) => {
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            // 1. Get ID from prop, OR fallback to localStorage if prop is missing
            const user = JSON.parse(localStorage.getItem('user'));
            const idToUse = studentId || user?.id;

            if (!idToUse) {
                console.error("No Student ID found!");
                return;
            }

            try {
                // 2. Corrected URL to match StudentRoutes.js
                const res = await axios.get(`http://localhost:5000/api/student/my-classes/${idToUse}`);
                setEnrolledClasses(res.data);
            } catch (err) {
                console.error("Error fetching student classes:", err);
            }
        };

        fetchClasses();
    }, [studentId]);

    return (
        <div style={{ padding: '40px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
            <h1 style={{ color: '#1a237e', marginBottom: '30px' }}>My Classrooms</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {enrolledClasses.length > 0 ? (
                    enrolledClasses.map(cls => (
                        <div 
                            key={cls.id} 
                            onClick={() => navigate(`/student/class/${cls.id}/live`)}
                            style={{ 
                                backgroundColor: 'white', 
                                padding: '20px', 
                                borderRadius: '12px', 
                                cursor: 'pointer', 
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s' 
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{cls.classroomname}</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                Lecturer: {cls.lecturer_name || 'Assigned Lecturer'}
                            </p>
                            <button style={{ 
                                marginTop: '15px',
                                background: '#1a237e', 
                                color: 'white', 
                                border: 'none', 
                                padding: '10px', 
                                borderRadius: '5px', 
                                width: '100%',
                                cursor: 'pointer'
                            }}>
                                Enter Class
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '12px' }}>
                        <h3>No classes found.</h3>
                        <p>You haven't been enrolled in any classes by the Admin yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;