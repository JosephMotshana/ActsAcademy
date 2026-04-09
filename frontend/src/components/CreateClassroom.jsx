import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateClassroom = ({ lecturers, onClassCreated }) => {
    const [classroomname, setClassroomname] = useState('');
    const [selectedLecturer, setSelectedLecturer] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/classroom', {
                classroomname,
                lecturer_id: selectedLecturer
            });
            alert("Class created!");
            setClassroomname('');
            onClassCreated();
        } catch (err) {
            alert("Error creating class");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9' }}>
            <h4>Create New Classroom</h4>
            <input 
                placeholder="Class Name (e.g. Physics 101)" 
                value={classroomname} 
                onChange={(e) => setClassroomname(e.target.value)} 
                required 
            />
            <select onChange={(e) => setSelectedLecturer(e.target.value)} required>
                <option value="">Assign a Lecturer</option>
                {lecturers.map(lec => (
                    <option key={lec.id} value={lec.id}>{lec.username}</option>
                ))}
            </select>
            <button type="submit">Create Class</button>
        </form>
    );
};

export default CreateClassroom;