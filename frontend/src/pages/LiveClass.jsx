import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LiveClass = () => {
    const { classId } = useParams();
    const [link, setLink] = useState('');
    const [startTime, setStartTime] = useState('');
    const [currentClass, setCurrentClass] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCurrentStatus = async () => {
        try {
            // Note: Use the lecturer-specific endpoint to ensure we get the data 
            // even if the 12-hour student window hasn't started yet
            const res = await axios.get(`http://localhost:5000/api/lecturer/live-status/${classId}`);
            setCurrentClass(res.data);
        } catch (err) {
            console.error("Error fetching status", err);
        }
    };

    useEffect(() => { fetchCurrentStatus(); }, [classId]);

    const handlePublish = async () => {
        if (!link || !startTime) return alert("Please provide both a link and a time.");
        
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/lecturer/update-live-link', { 
                classId, 
                live_link: link, 
                scheduled_time: startTime 
            });
            alert("Class Published!");
            setLink('');
            setStartTime('');
            fetchCurrentStatus(); // Refresh the display box
        } catch (err) {
            alert("Failed to publish class.");
        } finally {
            setLoading(false);
        }
    };

    // Formatter to ensure the date and time show up clearly
    const formatDisplayTime = (dateString) => {
        if (!dateString) return "No Time Set";
        // Handles both MySQL format and ISO format
        const date = new Date(dateString.replace(' ', 'T'));
        if (isNaN(date.getTime())) return dateString; // Fallback to raw string

        return date.toLocaleString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#1a237e' }}>🎥 Live Lesson Manager</h2>

            {/* THE DISPLAY BOX */}
            {currentClass?.live_link && (
                <div style={{ 
                    background: '#f0f4ff', 
                    padding: '25px', 
                    borderRadius: '12px', 
                    marginBottom: '30px', 
                    border: '2px solid #1a237e' 
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#1a237e' }}>Active Class Schedule</h3>
                    
                    {/* THIS IS THE TIME DISPLAY */}
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
                        📅 {formatDisplayTime(currentClass.scheduled_time)}
                    </div>

                    <a href={currentClass.live_link} target="_blank" rel="noreferrer" 
                       style={{ 
                           display: 'inline-block', 
                           padding: '12px 30px', 
                           background: '#4caf50', 
                           color: 'white', 
                           textDecoration: 'none', 
                           borderRadius: '8px', 
                           fontWeight: 'bold',
                           fontSize: '1.1rem'
                       }}>
                       Attend Class
                    </a>
                    
                    <button 
                        onClick={async () => {
                            await axios.post('http://localhost:5000/api/lecturer/update-live-link', { classId, live_link: null, scheduled_time: null });
                            fetchCurrentStatus();
                        }}
                        style={{ marginLeft: '15px', background: 'none', border: 'none', color: 'red', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Remove Link
                    </button>
                </div>
            )}

            {/* THE FORM */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #ddd' }}>
                <h3>Set Meeting Details</h3>
                <div style={{ marginBottom: '15px' }}>
                    <label>Google Meet Link</label>
                    <input type="text" value={link} onChange={e => setLink(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Date & Start Time</label>
                    <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <button onClick={handlePublish} disabled={loading} style={{ width: '100%', background: '#1a237e', color: 'white', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
                    {loading ? "Saving..." : "Publish to Students"}
                </button>
            </div>
        </div>
    );
};

export default LiveClass;