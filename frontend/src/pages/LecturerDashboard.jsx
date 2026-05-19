import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../Style/global.css';


const LecturerDashboard = ({ lecturerId }) => {
    const [myClasses, setMyClasses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get(`/api/lecturer/my-classes/${lecturerId}`);
                setMyClasses(res.data);
            } catch (err) {
                console.error("Error loading classes", err);
            }
        };
        fetchClasses();
    }, [lecturerId]);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Dashboard</h1>
            <p className="dashboard-subtext">Select a class to manage content and students.</p>
                
            <div className="class-grid">
                {myClasses.map(cls => (
                    <div 
                        key={cls.id} 
                        className="class-card"
                        onClick={() => navigate(`/lecturer/class/${cls.id}/materials`)}
                    >
                        <div className="card-accent-bar"></div>
                        <h3 className="class-name">{cls.classroomname}</h3>
                        <p className="class-id">Class ID: <span>#{cls.id}</span></p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LecturerDashboard;