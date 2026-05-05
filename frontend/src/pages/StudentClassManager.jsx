import React from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';

const StudentClassManager = () => {
    const { classId } = useParams();

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <nav style={{ width: '250px', backgroundColor: '#37474f', color: 'white', padding: '20px' }}>
                <Link to="/student" style={{ color: '#cfd8dc', textDecoration: 'none' }}>← Back to Home</Link>
                <h2 style={{ margin: '20px 0' }}>Classroom</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li><Link to="live" style={navStyle}> Live Session</Link></li>
                    <li><Link to="materials" style={navStyle}> Study Materials</Link></li>
                    <li><Link to="tests" style={navStyle}> Available Tests</Link></li>
                    <li><Link to="history" style={navStyle}> My Results</Link></li>
                </ul>
            </nav>
            <main style={{ flex: 1, padding: '30px', backgroundColor: '#f5f5f5' }}>
                <Outlet />
            </main>
        </div>
    );
};

const navStyle = { color: 'white', textDecoration: 'none', display: 'block', padding: '10px', borderRadius: '5px', marginBottom: '5px', backgroundColor: 'rgba(255,255,255,0.05)' };

export default StudentClassManager;