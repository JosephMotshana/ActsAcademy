import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth & General
import Login from './pages/Login';

// Admin
import AdminDashboard from './pages/AdminDashboard';

// Lecturer Pages
import LecturerDashboard from './pages/LecturerDashboard';
import ClassroomManager from './pages/ClassroomManager';
import StudyMaterials from './pages/StudyMaterials';
import CreateTest from './pages/CreateTest';
import LiveClass from './pages/LiveClass';
import StudentProgress from './pages/StudentProgress';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentClassManager from './pages/StudentClassManager';
import StudentLive from './pages/StudentLive';
import StudentMaterials from './pages/StudentMaterials';
import StudentTests from './pages/StudentTests';
import StudentHistory from './pages/StudentHistory';
import TakeTest from './pages/TakeTest';

function App() {
    const [user, setUser] = useState(null);

    // 1. Persist Login State
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
            {/* 2. Global Navbar (Only shows when logged in) */}
            {user && (
                <nav style={{ padding: '15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Acts Academy Portal</span>
                    <div>
                        <span style={{ marginRight: '15px' }}>{user.username} ({user.role})</span>
                        <button onClick={handleLogout} style={{ cursor: 'pointer', background: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Logout</button>
                    </div>
                </nav>
            )}

            <Routes>
                {/* 3. Authentication Routing */}
                <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to={`/${user.role.toLowerCase()}`} />} />

                {/* 4. ADMIN ROUTES */}
                <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />

                {/* 5. LECTURER ROUTES (Nested Moodle Structure) */}
                <Route path="/lecturer" element={user?.role === 'LECTURER' ? <LecturerDashboard lecturerId={user.id} /> : <Navigate to="/" />} />
                
                <Route path="/lecturer/class/:classId" element={user?.role === 'LECTURER' ? <ClassroomManager /> : <Navigate to="/" />}>
                    <Route path="materials" element={<StudyMaterials />} />
                    <Route path="live" element={<LiveClass />} />
                    <Route path="create-test" element={<CreateTest />} />
                    <Route path="progress" element={<StudentProgress />} />
                </Route>

                {/* 6. STUDENT ROUTES (Nested Moodle Structure) */}
                <Route path="/student" element={user?.role === 'STUDENT' ? <StudentDashboard studentId={user.id} /> : <Navigate to="/" />} />
                
                <Route path="/student/class/:classId" element={user?.role === 'STUDENT' ? <StudentClassManager /> : <Navigate to="/" />}>
                    <Route path="live" element={<StudentLive />} />
                    <Route path="materials" element={<StudentMaterials />} />
                    <Route path="tests" element={<StudentTests />} />
                    <Route path="history" element={<StudentHistory />} />
                </Route>

                {/* 7. Standalone Test Taking Page (Full focus mode) */}
                <Route path="/student/take-test/:quizId" element={user?.role === 'STUDENT' ? <TakeTest studentId={user.id} /> : <Navigate to="/" />} />

            </Routes>
        </div>
    );
}

export default App;