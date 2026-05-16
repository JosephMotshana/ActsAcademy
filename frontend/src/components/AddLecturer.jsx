import React, { useState } from 'react';
import axios from 'axios';

const AddLecturer = ({ onLecturerAdded }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'LECTURER' // Hardcoded since this form is specifically for lecturers
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', formData);
            alert("Lecturer added successfully!");
            setFormData({ username: '', email: '', password: '', role: 'LECTURER' });
            onLecturerAdded(); // This refreshes the list in the parent component
        } catch (err) {
            alert(err.response?.data?.error || "Error adding lecturer");
        }
    };

    return (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
            <h3>Add New Lecturer</h3>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <button type="submit">Register Lecturer</button>
            </form>
        </div>
    );
};

export default AddLecturer;