import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = ({ studentId }) => {
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            const res = await axios.get(`http://localhost:5000/api/student/my-classes/${studentId}`);
            setEnrolledClasses(res.data);
        };
        fetchClasses();
    }, [studentId]);

    return (
        <div style={{ padding: '40px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
            <h1>My Classrooms</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {enrolledClasses.map(cls => (
                    <div 
                        key={cls.id} 
                        onClick={() => navigate(`/student/class/${cls.id}/live`)}
                        style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    >
                        <h3>{cls.classroomname}</h3>
                        <p style={{ color: '#666' }}>Lecturer: {cls.lecturer_name}</p>
                        <button style={{ background: '#1a237e', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', width: '100%' }}>Enter Class</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;