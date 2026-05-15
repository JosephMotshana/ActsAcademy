import React, { useState } from 'react';
import axios from 'axios';

const AddStudent = ({ onStudentAdded }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert("Student registered!");
            setFormData({ username: '', email: '', password: '', role: 'STUDENT' });
            onStudentAdded();
        } catch (err) {
            alert("Registration failed");
        }
    };

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd' }}>
            <h4>Register New Student</h4>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Student Name" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <button type="submit">Add Student</button>
            </form>
        </div>
    );
};

export default AddStudent;