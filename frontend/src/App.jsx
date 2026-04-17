import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import ClassroomView from './pages/ClassroomView';

function App() {
    const [user, setUser] = useState(null);

    // Check if user is already logged in when the app starts
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <div>
            {user && (
                <nav style={{ padding: '10px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Logged in as: {user.username} ({user.role})</span>
                    <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
                </nav>
            )}

            <Routes>
                <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to={`/${user.role.toLowerCase()}`} />} />
                
                {/* Role Protected Routes */}
                <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/lecturer" element={user?.role === 'LECTURER' ? <LecturerDashboard lecturerId={user.id} /> : <Navigate to="/" />} />
                
                {/* Classroom is accessible by both if they belong to it */}
                <Route path="/classroom/:id" element={<ClassroomView />} />
            </Routes>
        </div>
    );
}

export default App;