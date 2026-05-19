import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../Style/global.css';

const LiveClass = () => {
    const { classId } = useParams();
    const [link, setLink] = useState('');
    const [startTime, setStartTime] = useState('');
    const [currentClass, setCurrentClass] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCurrentStatus = async () => {
        try {
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
            fetchCurrentStatus(); 
        } catch (err) {
            alert("Failed to publish class.");
        } finally {
            setLoading(false);
        }
    };

    const formatDisplayTime = (dateString) => {
        if (!dateString) return "No Time Set";
        const date = new Date(dateString.replace(' ', 'T'));
        if (isNaN(date.getTime())) return dateString;

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
        <div className="live-manager-container">
            <h2 className="live-manager-title">Live Lesson Manager</h2>

            {/* THE DISPLAY BOX */}
            {currentClass?.live_link && (
                <div className="active-class-card">
                    <h3 className="card-subtitle">Active Class Schedule</h3>
                    
                    <div className="time-display">
                         {formatDisplayTime(currentClass.scheduled_time)}
                    </div>

                    <div className="card-actions">
                        <a href={currentClass.live_link} target="_blank" rel="noreferrer" className="btn-attend">
                           Attend Class
                        </a>
                        
                        <button 
                            className="btn-remove"
                            onClick={async () => {

                                await axios.post('/api/lecturer/update-live-link', { classId, live_link: null, scheduled_time: null });
                                fetchCurrentStatus();
                            }}
                        >
                            Remove Link
                        </button>
                    </div>
                </div>
            )}

            {/* THE FORM */}
            <div className="live-details-form">
                <h3 className="card-subtitle">Set Meeting Details</h3>
                <div className="form-input-group">
                    <label>Google Meet Link</label>
                    <input 
                        className="live-input"
                        type="text" 
                        value={link} 
                        onChange={e => setLink(e.target.value)} 
                        placeholder="https://meet.google.com/..."
                    />
                </div>
                <div className="form-input-group">
                    <label>Date & Start Time</label>
                    <input 
                        className="live-input"
                        type="datetime-local" 
                        value={startTime} 
                        onChange={e => setStartTime(e.target.value)} 
                    />
                </div>
                <button 
                    className="btn-publish"
                    onClick={handlePublish} 
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Publish to Students"}
                </button>
            </div>
        </div>
    );
};

export default LiveClass;