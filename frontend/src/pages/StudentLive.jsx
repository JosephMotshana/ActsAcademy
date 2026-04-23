import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StudentLive = () => {
    const { classId } = useParams();
    const [session, setSession] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            const res = await axios.get(`http://localhost:5000/api/student/live-link/${classId}`);
            setSession(res.data);
        };
        fetchSession();
    }, [classId]);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>🎥 Live Lesson Hall</h2>
            
            {session?.live_link ? (
                <div style={{ backgroundColor: '#f0f4ff', padding: '30px', borderRadius: '15px', border: '2px dashed #1a237e' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                        <strong>Next Class:</strong> {session.scheduled_time ? new Date(session.scheduled_time).toLocaleString() : 'Now'}
                    </p>
                    <a 
                        href={session.live_link} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ display: 'inline-block', padding: '15px 40px', backgroundColor: '#4caf50', color: 'white', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                        Join Meeting
                    </a>
                </div>
            ) : (
                <p style={{ color: '#888' }}>No classes scheduled at the moment.</p>
            )}
        </div>
    );
};

export default StudentLive;