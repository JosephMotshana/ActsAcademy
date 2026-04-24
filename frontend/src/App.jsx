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
import LiveClass from './pages/LiveClass';
import PerformancePage from './pages/PerformancePage';
import MarkAssessment from './pages/MarkAssessment';
import ManageQuizzes from './pages/ManageQuizzes';       // Added Import
import CreateOrEditQuiz from './pages/CreateOrEditQuiz'; // Added Import

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentClassManager from './pages/StudentClassManager';
import StudentLive from './pages/StudentLive';
import StudentMaterials from './pages/StudentMaterials';
import StudentTests from './pages/StudentTests';
import StudentHistory from './pages/StudentHistory';
import TakeTest from './pages/TakeTest';
import ReviewTest from './pages/ReviewTest';

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
                <nav style={{ 
                    padding: '15px 30px', 
                    background: '#1a237e', 
                    color: 'white', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)' 
                }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>
                        ACTS ACADEMY PORTAL
                    </span>
                    <div>
                        <span style={{ marginRight: '20px', fontSize: '0.9rem', opacity: 0.9 }}>
                            {user.username} ({user.role})
                        </span>
                        <button 
                            onClick={handleLogout} 
                            style={{ 
                                cursor: 'pointer', 
                                background: '#f44336', 
                                color: 'white', 
                                border: 'none', 
                                padding: '6px 15px', 
                                borderRadius: '6px',
                                fontWeight: 'bold'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </nav>
            )}

            <Routes>
                {/* 3. Authentication Routing */}
                <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to={`/${user.role.toLowerCase()}`} />} />

                {/* 4. ADMIN ROUTES */}
                <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />

                {/* 5. LECTURER ROUTES (Dashboard + Nested Classrooms) */}
                <Route path="/lecturer" element={user?.role === 'LECTURER' ? <LecturerDashboard lecturerId={user.id} /> : <Navigate to="/" />} />
                
                <Route path="/lecturer/class/:classId" element={user?.role === 'LECTURER' ? <ClassroomManager /> : <Navigate to="/" />}>
                    <Route path="materials" element={<StudyMaterials />} />
                    <Route path="live" element={<LiveClass />} />
                    <Route path="performance" element={<PerformancePage />} />
                    <Route path="mark-assessment" element={<MarkAssessment />} />
                    <Route path="manage-quizzes" element={<ManageQuizzes />} /> {/* Added Nested Route */}
                </Route>

                {/* Standalone Lecturer Assessment Routes */}
                <Route path="/lecturer/class/:classId/create-quiz" element={<CreateOrEditQuiz />} />
                <Route path="/lecturer/edit-quiz/:quizId" element={<CreateOrEditQuiz />} />

                {/* 6. STUDENT ROUTES (Dashboard + Nested Classrooms) */}
                <Route path="/student" element={user?.role === 'STUDENT' ? <StudentDashboard studentId={user.id} /> : <Navigate to="/" />} />

                <Route path="/student/class/:classId" element={user?.role === 'STUDENT' ? <StudentClassManager /> : <Navigate to="/" />}>
                    <Route path="live" element={<StudentLive />} />
                    <Route path="materials" element={<StudentMaterials />} />
                    <Route path="tests" element={<StudentTests user={user} />} />
                    <Route path="history" element={<StudentHistory user={user} />} />
                </Route>

                {/* 7. STANDALONE ASSESSMENT PAGES (Full Focus Mode) */}
                <Route 
                    path="/student/take-test/:testId" 
                    element={user?.role === 'STUDENT' ? <TakeTest user={user} /> : <Navigate to="/" />} 
                />
                
                <Route 
                    path="/student/review/:testId" 
                    element={user?.role === 'STUDENT' ? <ReviewTest user={user} /> : <Navigate to="/" />} 
                />

                {/* 8. CATCH-ALL REDIRECT */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;