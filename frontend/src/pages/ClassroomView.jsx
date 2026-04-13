import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassroomView = ({ classroomId, userRole }) => {
    const [classroom, setClassroom] = useState(null);
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        // Fetch class details and materials
        const fetchData = async () => {
            const classRes = await axios.get(`http://localhost:5000/api/admin/classroom/${classroomId}`);
            const matRes = await axios.get(`http://localhost:5000/api/admin/materials/${classroomId}`);
            setClassroom(classRes.data);
            setMaterials(matRes.data);
        };
        fetchData();
    }, [classroomId]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>{classroom?.classroomname}</h1>
            
            {/* 1. LIVE CLASS SECTION */}
            <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
                <h3>🎥 Live Session</h3>
                {classroom?.live_link ? (
                    <a href={classroom.live_link} target="_blank" rel="noreferrer">
                        <button style={{ background: '#2196f3', color: 'white' }}>Join Live Class Now</button>
                    </a>
                ) : <p>No live session scheduled.</p>}
                
                {userRole === 'LECTURER' && (
                    <button style={{ marginLeft: '10px' }}>Update Live Link</button>
                )}
            </div>

            {/* 2. MATERIALS SECTION */}
            <div style={{ marginTop: '30px' }}>
                <h3>📚 Study Materials</h3>
                <ul>
                    {materials.map(m => (
                        <li key={m.id}><a href={m.file_url}>{m.title}</a></li>
                    ))}
                </ul>
                {userRole === 'LECTURER' && (
                    <button>+ Upload PDF/Link</button>
                )}
            </div>

            {/* 3. TESTS SECTION */}
            <div style={{ marginTop: '30px' }}>
                <h3>📝 Assignments & Tests</h3>
                {userRole === 'LECTURER' ? (
                    <button>Create New Test</button>
                ) : (
                    <button>Take Available Test</button>
                )}
            </div>
        </div>
    );
};

export default ClassroomView;