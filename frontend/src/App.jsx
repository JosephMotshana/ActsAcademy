import React, { useState, useEffect } from 'react';
import { BrowserRouter,Routes, Route, Navigate , Link} from 'react-router-dom';
// Add this line at the top of App.jsx
import Register from './pages/Register';
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
import ManageQuizzes from './pages/ManageQuizzes';
import CreateOrEditQuiz from './pages/CreateOrEditQuiz';

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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("Failed to parse user session", error);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userId'); 
        setUser(null);
    };

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading Portal...</div>;
    }

    return (
        <div>
            {user && (
                <nav style={{ 
                    padding: '15px 30px', 
                    background: '#1a305e', 
                    color: 'white', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                   
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
                                background: '#c5a059', 
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
                {/* 1. AUTH */}
                <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to={`/${user.role.toLowerCase()}`} />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role.toLowerCase()}`} />} />

                {/* 2. ADMIN */}
                <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />

                {/* 3. LECTURER */}
                <Route path="/lecturer" element={user?.role === 'LECTURER' ? <LecturerDashboard lecturerId={user.id} /> : <Navigate to="/" />} />
                
                {/* Nested Classroom Routes */}
                <Route path="/lecturer/class/:classId" element={user?.role === 'LECTURER' ? <ClassroomManager /> : <Navigate to="/" />}>
                    <Route path="materials" element={<StudyMaterials />} />
                    <Route path="live" element={<LiveClass />} />
                    <Route path="performance" element={<PerformancePage />} />
                    <Route path="manage-quizzes" element={<ManageQuizzes />} />
                    <Route path="mark-assessment" element={<MarkAssessment />} />
                </Route>

                {/* STANDALONE LECTURER ROUTES (Important: These must be outside the ClassroomManager Route to show full screen) */}
                // App.js example
<Route path="/lecturer/class/:classId/mark-assessment/:studentId" element={<MarkAssessment />} />
                <Route 
                    path="/lecturer/class/:classId/create-quiz" 
                    element={user?.role === 'LECTURER' ? <CreateOrEditQuiz /> : <Navigate to="/" />} 
                />
                <Route 
                    path="/lecturer/class/:classId/edit-quiz/:quizId" 
                    element={user?.role === 'LECTURER' ? <CreateOrEditQuiz /> : <Navigate to="/" />} 
                />

                {/* 4. STUDENT */}
                <Route path="/student" element={user?.role === 'STUDENT' ? <StudentDashboard studentId={user.id} /> : <Navigate to="/" />} />

                <Route path="/student/class/:classId" element={user?.role === 'STUDENT' ? <StudentClassManager /> : <Navigate to="/" />}>
                    <Route path="live" element={<StudentLive />} />
                    <Route path="materials" element={<StudentMaterials />} />
                    <Route path="tests" element={<StudentTests user={user} />} />
                    <Route path="history" element={<StudentHistory user={user} />} />
                </Route>

                <Route 
                    path="/student/take-test/:testId" 
                    element={user?.role === 'STUDENT' ? <TakeTest user={user} /> : <Navigate to="/" />} 
                />
                <Route 
                    path="/student/review/:testId" 
                    element={user?.role === 'STUDENT' ? <ReviewTest user={user} /> : <Navigate to="/" />} 
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            </div>
    );

}


export default App;