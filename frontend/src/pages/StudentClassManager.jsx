import React, { useState } from 'react';
import { useParams, Link, Outlet, useNavigate } from 'react-router-dom';
import '../../Style/StudentGlobal.css';

const StudentClassManager = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // Menu items for the student flow
    const menuItems = [
        { name: 'Live Session', path: 'live' },
        { name: 'Study Materials', path: 'materials' },
        { name: 'Available Tests', path: 'tests' },
        { name: 'My Results', path: 'history' }
    ];

    return (
        <div className="classroom-manager-layout">
            {/* LEFT SIDEBAR */}
            <nav className="classroom-manager-sidebar">
                <div className="classroom-manager-sidebar-header">
                    <button 
                        onClick={() => navigate('/student')} 
                        className="classroom-manager-back-button"
                    >
                        ← My Classes
                    </button>

                    <button
                        type="button"
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="classroom-manager-hamburger-button"
                        aria-expanded={menuOpen}
                    >
                        ☰ Class Menu
                    </button>
                </div>

                <div className={menuOpen ? 'classroom-manager-menu-visible' : 'classroom-manager-menu-hidden'}>
                    <h2 className="classroom-manager-title">
                        Classroom
                    </h2>

                    <ul className="classroom-manager-menu">
                        {menuItems.map(item => (
                            <li key={item.path} className="classroom-manager-menu-item">
                                <Link 
                                    to={`/student/class/${classId}/${item.path}`} 
                                    className="classroom-manager-menu-link"
                                    onClick={() => setMenuOpen(false)} // Auto-close on mobile
                                >
                                    <span className="classroom-manager-menu-text">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* RIGHT CONTENT AREA */}
            <main className="classroom-manager-content">
                <div className="classroom-manager-content-wrapper">
                    <div className="classroom-manager-panel">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentClassManager;