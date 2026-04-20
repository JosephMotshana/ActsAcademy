import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LecturerDashboard = ({ lecturerId }) => {
    const [myClasses, setMyClasses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/lecturer/my-classes/${lecturerId}`);
                setMyClasses(res.data);
            } catch (err) {
                console.error("Error loading classes", err);
            }
        };
        fetchClasses();
    }, [lecturerId]);

    return (
        <div style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: '10px' }}>Dashboard</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Select a class to manage content and students.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                {myClasses.map(cls => (
                    <div 
                        key={cls.id} 
                        onClick={() => navigate(`/lecturer/class/${cls.id}/materials`)}
                        style={{ 
                            backgroundColor: 'white', padding: '25px', borderRadius: '15px', 
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', cursor: 'pointer',
                            transition: 'transform 0.2s', border: '1px solid #eee'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>📘</div>
                        <h3 style={{ margin: '0', color: '#2c3e50' }}>{cls.classroomname}</h3>
                        <p style={{ color: '#999', fontSize: '14px' }}>Class ID: #{cls.id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LecturerDashboard;