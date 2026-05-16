import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../Style/StudentGlobal.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT',
        companyName: '',
        address: '',
        contactNo: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', formData);
            setSubmitted(true);
        } catch (err) {
            console.error("Registration error:", err);
            alert(err.response?.data?.error || "Registration failed. Check your details.");
        }
    };

    if (submitted) {
        return (
            <div className="login-page-wrapper">
                <div className="login-card">
                    <div className="success-icon"></div>
                    <h2 className="login-welcome-text">Application Sent!</h2>
                    <p className="login-subtitle">
                        Your request to join as a <strong>{formData.role}</strong> has been received. 
                        Our team will verify your details for <strong>{formData.companyName || 'your organization'}</strong> soon.
                    </p>
                    <Link to="/login" className="btn-login-submit" style={{ display: 'block', textDecoration: 'none', marginTop: '20px' }}>
                        Return to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page-wrapper">
            <div className="login-card register-card">
                <div className="login-header">
                    <div className="login-logo-placeholder">ACTS ACADEMY</div>
                    <h2 className="login-welcome-text">Create Account</h2>
                    <p className="login-subtitle">Submit your professional details for approval.</p>
                </div>

                <form onSubmit={handleRegister} className="login-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="login-label">Full Name</label>
                            <input name="name" type="text" className="login-input" placeholder="John Doe" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="login-label">Email Address</label>
                            <input name="email" type="email" className="login-input" placeholder="name@company.com" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="login-label">Contact Number</label>
                            <input name="contactNo" type="tel" className="login-input" placeholder="+27 123 4567" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="login-label">I am a:</label>
                            <select name="role" className="login-input" onChange={handleChange} value={formData.role}>
                                <option value="STUDENT">Student</option>
                                <option value="LECTURER">Lecturer</option>
                                <option value="EXECUTIVE">Company Executive</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="login-label">Company / Institution Name</label>
                        <input name="companyName" type="text" className="login-input" placeholder="Acts Academy Ltd" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="login-label">Physical Address</label>
                        <input name="address" type="text" className="login-input" placeholder="Street, City, Province" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="login-label">Password</label>
                        <input name="password" type="password" className="login-input" placeholder="Create secure password" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn-login-submit">
                        Request Access
                    </button>
                </form>

                <div className="login-registration-prompt">
                    <p>Already have an account? <Link to="/login" className="btn-register-link">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;