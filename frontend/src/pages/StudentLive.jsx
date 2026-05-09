import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StudentLive = () => {
    const { classId } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSession = async () => {
        try {
            // Ensure this endpoint exists in your backend or use the admin/lecturer one if public
            const res = await axios.get(`http://localhost:5000/api/admin/classroom/${classId}`);
            setSession(res.data);
        } catch (err) {
            console.error("Error fetching live link", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSession();
        // Optional: Refresh every 30 seconds to catch new links automatically
        const interval = setInterval(fetchSession, 30000);
        return () => clearInterval(interval);
    }, [classId]);

    const formatDisplayTime = (dateString) => {
        if (!dateString) return "Class is Live Now!";
        const date = new Date(dateString.replace(' ', 'T'));
        return date.toLocaleString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading classroom...</p>;

    return (
        <div style={{ textAlign: 'center', padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: '#1a237e' }}> {session?.classroomname || 'Classroom'} Live Hall</h2>
            
            {session?.live_link ? (
                <div style={{ 
                    backgroundColor: '#f0f4ff', 
                    padding: '40px', 
                    borderRadius: '20px', 
                    border: '2px solid #1a237e',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)' 
                }}>
                    <div style={{ marginBottom: '20px' }}>
                    </div>

                    <p style={{ fontSize: '1.4rem', color: '#333', marginBottom: '25px' }}>
                        <strong>Starts:</strong> <br/>
                        {formatDisplayTime(session.scheduled_time)}
                    </p>

                    <a 
                        href={session.live_link} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ 
                            display: 'inline-block', 
                            padding: '18px 50px', 
                            backgroundColor: '#4caf50', 
                            color: 'white', 
                            borderRadius: '12px', 
                            textDecoration: 'none', 
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)'
                        }}
                    >
                        Join Google Meet
                    </a>
                </div>
            ) : (
                <div style={{ padding: '40px', background: '#f9f9f9', borderRadius: '20px', border: '1px solid #ddd' }}>
                    <p style={{ fontSize: '1.2rem', color: '#888' }}>
                        No classes are currently scheduled for this classroom.
                    </p>
                    <button 
                        onClick={fetchSession}
                        style={{ marginTop: '15px', background: 'none', border: '1px solid #1a237e', color: '#1a237e', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Refresh Status
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentLive;