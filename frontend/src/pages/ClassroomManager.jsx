import React from 'react';
import { useParams, Link, Outlet, useNavigate } from 'react-router-dom';

const ClassroomManager = () => {
    const { classId } = useParams();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Study Materials', path: 'materials', icon: '📚' },
        { name: 'Live Classes', path: 'live', icon: '🎥' },
        { name: 'Create Test', path: 'create-test', icon: '📝' },
        { name: 'Student Progress', path: 'progress', icon: '📊' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial' }}>
            {/* LEFT SIDEBAR */}
            <nav style={{ width: '260px', backgroundColor: '#1a237e', color: 'white', padding: '20px' }}>
                <button onClick={() => navigate('/lecturer')} style={{ background: 'none', border: 'none', color: '#8c9eff', cursor: 'pointer', marginBottom: '20px' }}>
                    ← Back to Dashboard
                </button>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Course Tools</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {menuItems.map(item => (
                        <li key={item.path} style={{ marginBottom: '15px' }}>
                            <Link 
                                to={`/lecturer/class/${classId}/${item.path}`} 
                                style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.1)' }}
                            >
                                <span>{item.icon}</span> {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* RIGHT CONTENT AREA */}
            <main style={{ flex: 1, padding: '40px', backgroundColor: '#f5f5f5' }}>
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <Outlet /> {/* This is where StudyMaterials, CreateTest, etc. will render */}
                </div>
            </main>
        </div>
    );
};

export default ClassroomManager;