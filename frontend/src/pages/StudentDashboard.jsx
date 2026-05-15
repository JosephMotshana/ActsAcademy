import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../Style/StudentGlobal.css';

const StudentDashboard = ({ studentId }) => {
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const idToUse = studentId || user?.id;

            if (!idToUse) {
                console.error("No Student ID found!");
                return;
            }

            try {
                const res = await axios.get(`http://localhost:5000/api/student/my-classes/${idToUse}`);
                setEnrolledClasses(res.data);
            } catch (err) {
                console.error("Error fetching student classes:", err);
            }
        };

        fetchClasses();
    }, [studentId]);

    return (
        <div className="dashboard-wrapper">
            <h1 className="dashboard-title">My Classrooms</h1>
            
            <div className="classroom-grid">
                {enrolledClasses.length > 0 ? (
                    enrolledClasses.map(cls => (
                        <div 
                            key={cls.id} 
                            onClick={() => navigate(`/student/class/${cls.id}/live`)}
                            className="classroom-card"
                        >
                            <h3 className="classroom-name">{cls.classroomname}</h3>
                            <p className="lecturer-info">
                                Lecturer: {cls.lecturer_name || 'Assigned Lecturer'}
                            </p>
                            <button className="btn-enter-class">
                                Enter Class
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="empty-dashboard-state">
                        <h3>No classes found.</h3>
                        <p>You haven't been enrolled in any classes by the Admin yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;