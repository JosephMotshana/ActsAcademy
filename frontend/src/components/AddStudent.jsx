import React, { useState } from 'react';
import axios from 'axios';

const AddStudent = ({ onStudentAdded }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // We use the register route but force the role to STUDENT
            await axios.post('http://localhost:5000/api/auth/register', { ...formData, role: 'STUDENT' });
            alert("Student created successfully!");
            setFormData({ username: '', email: '', password: '' });
            onStudentAdded(); // Refresh the list in the dashboard
        } catch (err) {
            alert("Error adding student");
        }
    };

    return (
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>➕ Register New Student</h3>
            <form onSubmit={handleSubmit}>
                <input placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required style={{marginRight: '5px'}}/>
                <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{marginRight: '5px'}}/>
                <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{marginRight: '5px'}}/>
                <button type="submit">Create Student</button>
            </form>
        </div>
    );
};

export default AddStudent;