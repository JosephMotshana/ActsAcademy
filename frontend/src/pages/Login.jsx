import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../style/StudentGlobal.css';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const userData = res.data.user || res.data; 

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userId', userData.id); 
            setUser(userData);

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
        <div className="login-page-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo-placeholder">ACTS ACADEMY</div>
                    <h2 className="login-welcome-text">Welcome Back</h2>
                    <p className="login-subtitle">Please sign in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label className="login-label">Email Address</label>
                        <input 
                            type="email" 
                            className="login-input"
                            placeholder="name@academy.com" 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="login-label">Password</label>
                        <input 
                            type="password" 
                            className="login-input"
                            placeholder="••••••••" 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-login-submit">
                        Sign In
                    </button>
                </form>
                
                {/* REPLACED LINK WITH A BUTTON FOR BETTER RELIABILITY */}
                <div className="login-registration-prompt">
                    <p>New to the Academy?</p>

                <button 
                        type="button" 
                        className="btn-outline-register" 
                        onClick={() => navigate('/register')}
                    >
                        Create an Account
                    </button>
                </div>

                <div className="login-footer">
                    <p>© 2026 Acts Academy. Secure Portal.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;