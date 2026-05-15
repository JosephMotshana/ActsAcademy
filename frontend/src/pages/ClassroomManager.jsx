import React, { useState } from 'react';
import { useParams, Link, Outlet, useNavigate } from 'react-router-dom';
import '../../Style/global.css';
const ClassroomManager = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // Menu items for the nested Outlet
    const menuItems = [
        { name: 'Study Materials', path: 'materials'},
        { name: 'Live Classes', path: 'live' },
        { name: 'Manage Assessments', path: 'manage-quizzes'}, 
        { name: 'Performance', path: 'performance'},
        { name: 'Mark Assessments', path: 'mark-assessment' }
    ];

    return (
        <div className="classroom-manager-layout">
            {/* LEFT SIDEBAR */}
            <nav className="classroom-manager-sidebar">
                <div className="classroom-manager-sidebar-header">
                    <button 
                        onClick={() => navigate('/lecturer')} 
                        className="classroom-manager-back-button"
                    >
                        ← Classes
                    </button>

                    <button
                        type="button"
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="classroom-manager-hamburger-button"
                        aria-expanded={menuOpen}
                    >
                        ☰ Lecturer Tools
                    </button>
                </div>

                <div className={menuOpen ? 'classroom-manager-menu-visible' : 'classroom-manager-menu-hidden'}>
                    <h2 className="classroom-manager-title">
                        Lecturer Tools
                    </h2>

                    <ul className="classroom-manager-menu">
                        {menuItems.map(item => (
                            <li key={item.path} className="classroom-manager-menu-item">
                        <Link 
                            to={`/lecturer/class/${classId}/${item.path}`} 
                            className="classroom-manager-menu-link"
                        >
                            <span className="classroom-manager-menu-icon">{item.icon}</span>
                            <span className="classroom-manager-menu-text">{item.name}</span>
                        </Link>
                    </li>
                ))}

                <hr className="classroom-manager-divider" />

                {/* ACTIONS */}
                <li>
                    <Link 
                        to={`/lecturer/class/${classId}/create-quiz`} 
                        className="classroom-manager-action-link"
                    >
                        NEW ASSESSMENT
                    </Link>
                </li>
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

export default ClassroomManager;