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
            const userData = res.data;

            // 1. Save to local storage
            localStorage.setItem('user', JSON.stringify(userData));
            
            // 2. Update state in App.js
            setUser(userData);

            // 3. Redirect based on role
            if (userData.role === 'ADMIN') navigate('/admin');
            else if (userData.role === 'LECTURER') navigate('/lecturer');
            else navigate('/student');

        } catch (err) {
            alert("Login failed! Check your credentials.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h2>Welcome to Acts Academy</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required 
                       style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required 
                       style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#2196f3', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;