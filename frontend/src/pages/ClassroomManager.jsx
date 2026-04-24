import React from 'react';
import { useParams, Link, Outlet, useNavigate } from 'react-router-dom';

const ClassroomManager = () => {
    const { classId } = useParams();
    const navigate = useNavigate();

    // Menu items for the nested Outlet
    const menuItems = [
        { name: 'Study Materials', path: 'materials', icon: '📚' },
        { name: 'Live Classes', path: 'live', icon: '🎥' },
        { name: 'Manage Assessments', path: 'manage-quizzes', icon: '⚙️' }, 
        { name: 'Performance', path: 'performance', icon: '📈' },
        { name: 'Mark Assessments', path: 'mark-assessment', icon: '✅' }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial', backgroundColor: '#f5f5f5' }}>
            {/* LEFT SIDEBAR */}
            <nav style={{ width: '280px', backgroundColor: '#1a237e', color: 'white', padding: '25px', boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}>
                <button 
                    onClick={() => navigate('/lecturer')} 
                    style={{ background: 'none', border: 'none', color: '#8c9eff', cursor: 'pointer', marginBottom: '25px', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    ← BACK TO DASHBOARD
                </button>
                
                <h2 style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.8, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Lecturer Tools
                </h2>

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {menuItems.map(item => (
                        <li key={item.path} style={{ marginBottom: '12px' }}>
                            <Link 
                                to={`/lecturer/class/${classId}/${item.path}`} 
                                style={{ 
                                    color: 'white', 
                                    textDecoration: 'none', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '12px', 
                                    padding: '12px 15px', 
                                    borderRadius: '8px', 
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span> 
                                <span style={{ fontWeight: '500' }}>{item.name}</span>
                            </Link>
                        </li>
                    ))}

                    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '25px 0' }} />

                    {/* ACTIONS */}
                    <li>
                        <Link 
                            to={`/lecturer/class/${classId}/create-quiz`} 
                            style={{ 
                                color: 'white', 
                                textDecoration: 'none', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: '10px', 
                                padding: '14px', 
                                borderRadius: '8px', 
                                backgroundColor: '#2e7d32', // Solid green for action
                                fontWeight: 'bold',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        >
                            ➕ NEW ASSESSMENT
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* RIGHT CONTENT AREA */}
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', minHeight: '80vh' }}>
                        <Outlet /> 
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClassroomManager;