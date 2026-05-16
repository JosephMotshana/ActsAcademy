import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../Style/StudentGlobal.css';

const StudentLive = () => {
    const { classId } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSession = async () => {
        try {
            const res = await axios.get(`/api/admin/classroom/${classId}`);
            setSession(res.data);
        } catch (err) {
            console.error("Error fetching live link", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSession();
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

    if (loading) return <p className="live-loading-text">Loading classroom...</p>;

    return (
        <div className="live-hall-container">
            <h2 className="live-hall-title"> 
                {session?.classroomname || 'Classroom'} Live Hall
            </h2>
            
            {session?.live_link ? (
                <div className="live-session-card">
                    <p className="live-start-time">
                        <strong className="start-label">Starts:</strong> <br/>
                        {formatDisplayTime(session.scheduled_time)}
                    </p>

                    <a 
                        href={session.live_link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn-join-meet"
                    >
                        Join Google Meet
                    </a>
                </div>
            ) : (
                <div className="no-live-class-box">
                    <p className="no-live-text">
                        No classes are currently scheduled for this classroom.
                    </p>
                    <button 
                        onClick={fetchSession}
                        className="btn-refresh-status"
                    >
                        Refresh Status
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentLive;