import React, { useState } from 'react';
import axios from 'axios';

const CreateClassroom = ({ lecturers, onClassCreated }) => {
    const [classroomName, setClassroomName] = useState('');
    const [lecturerId, setLecturerId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Note: The URL must match your backend route exactly
            await axios.post('http://localhost:5000/api/admin/create-classroom', {
                classroomname: classroomName,
                lecturer_id: lecturerId
            });
            alert("Success: Classroom created!");
            setClassroomName(''); 
            onClassCreated(); // This refreshes the list in the dashboard
        } catch (err) {
            console.error(err);
            alert("Error: Could not create classroom.");
        }
    };

    return (
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', background: '#f9f9f9' }}>
            <h4>Add New Classroom</h4>
            <form onSubmit={handleSubmit}>
                <input 
                    placeholder="Class Name (e.g., Mathematics)" 
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <select 
                    value={lecturerId} 
                    onChange={(e) => setLecturerId(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                >
                    <option value="">Assign a Lecturer</option>
                    {lecturers.map(lec => (
                        <option key={lec.id} value={lec.id}>{lec.username}</option>
                    ))}
                </select>
                <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none' }}>
                    Create Class
                </button>
            </form>
        </div>
    );
};

export default CreateClassroom;