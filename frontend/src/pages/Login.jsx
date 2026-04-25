import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // The backend usually returns user data inside res.data or res.data.user
            // Adjust this based on your specific backend response structure
            const userData = res.data.user || res.data; 

            // --- THE CRITICAL FIXES ---
            // 1. Save the full user object
            localStorage.setItem('user', JSON.stringify(userData));
            
            // 2. Save the userId separately so TakeTest can find it easily
            localStorage.setItem('userId', userData.id); 
            
            // 3. Update the global state in App.js
            setUser(userData);

            // --- REDIRECT LOGIC ---
            if (userData.role === 'ADMIN') {
                navigate('/admin');
            } else if (userData.role === 'LECTURER') {
                navigate('/lecturer');
            } else {
                navigate('/student');
            }

        } catch (err) {
            console.error("Login error:", err);
            alert("Login failed! Check your credentials.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h2 style={{ textAlign: 'center', color: '#1a237e' }}>Welcome to Acts Academy</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} 
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} 
                    />
                </div>
                <button 
                    type="submit" 
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        background: '#1a237e', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;