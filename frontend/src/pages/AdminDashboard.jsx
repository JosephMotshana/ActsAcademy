import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddLecturer from '../components/AddLecturer';
import AddStudent from '../components/AddStudent';
import CreateClassroom from '../components/CreateClassroom';

const AdminDashboard = () => {
    const [lecturers, setLecturers] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [allEnrollments, setAllEnrollments] = useState([]); // Correctly declared once
    const [enrollmentData, setEnrollmentData] = useState({ student_id: '', classroom_id: '' });

    // SINGLE fetch function for all data
    const fetchData = async () => {
        try {
            const [lecRes, classRes, studRes, enrollRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/lecturers'),
                axios.get('http://localhost:5000/api/admin/classrooms'),
                axios.get('http://localhost:5000/api/admin/students'),
                axios.get('http://localhost:5000/api/admin/enrollments')
            ]);
            setLecturers(lecRes.data);
            setClassrooms(classRes.data);
            setStudents(studRes.data);
            setAllEnrollments(enrollRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => { 
        fetchData(); 
    }, []);

    // --- ENROLLMENT LOGIC ---
    const handleEnroll = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/enroll', { 
                studentId: enrollmentData.student_id, 
                classroomId: enrollmentData.classroom_id 
            });
            alert("Student Enrolled!");
            setEnrollmentData({ student_id: '', classroom_id: '' });
            fetchData(); // Refresh list after enrollment
        } catch (err) {
            alert(err.response?.data?.message || "Enrollment failed");
        }
    };

    // --- DELETE USER LOGIC ---
    const deleteUser = async (id) => {
        if (window.confirm("Remove this student permanently? This will also unenroll them from all classes.")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/student/${id}`);
                fetchData();
            } catch (err) { alert("Delete failed"); }
        }
    };

    // --- UNENROLL LOGIC (From specific class) ---
    const handleUnenroll = async (studentId, classroomId) => {
        if (!window.confirm("Remove student from this specific class?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/unenroll/${studentId}/${classroomId}`);
            alert("Student unenrolled");
            fetchData();
        } catch (err) {
            alert("Error removing student");
        }
    };

    const deleteClassroom = async (id) => {
        if (window.confirm("Delete this class? Enrollment data will be lost.")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/classroom/${id}`);
                fetchData();
            } catch (err) { alert("Delete failed"); }
        }
    };

    const reassignLecturer = async (classroomId, lecturerId) => {
        try {
            await axios.post('http://localhost:5000/api/admin/reassign-lecturer', { classroomId, lecturerId });
            alert("Lecturer reassigned!");
            fetchData();
        } catch (err) {
            alert("Failed to reassign");
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Segoe UI, Arial', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#1a237e' }}>Academy Admin Portal</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                
                {/* COLUMN 1: USER MANAGEMENT */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <AddLecturer onLecturerAdded={fetchData} />
                    <AddStudent onStudentAdded={fetchData} />
                    
                    <h3>Student Roster</h3>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {students.map(std => (
                            <div key={std.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                                <span>{std.username}</span>
                                <button onClick={() => deleteUser(std.id)} style={{ color: '#f44336', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete User</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMN 2: CLASSROOM MANAGEMENT */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <CreateClassroom lecturers={lecturers} onClassCreated={fetchData} />
                    
                    <h3>Active Classrooms</h3>
                    {classrooms.map(cls => (
                        <div key={cls.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>{cls.classroomname}</strong>
                                <button onClick={() => deleteClassroom(cls.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete Class</button>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                                Lecturer: {cls.lecturer_name || "Unassigned"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* QUICK ENROLLMENT TOOL */}
            <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h3>🏫 Student Enrollment Manager</h3>
                <form onSubmit={handleEnroll} style={{ display: 'flex', gap: '15px' }}>
                    <select 
                        value={enrollmentData.student_id} 
                        onChange={(e) => setEnrollmentData({...enrollmentData, student_id: e.target.value})} 
                        required 
                        style={{ flex: 1, padding: '12px', borderRadius: '6px' }}
                    >
                        <option value="">-- Select Student --</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.username}</option>)}
                    </select>

                    <select 
                        value={enrollmentData.classroom_id} 
                        onChange={(e) => setEnrollmentData({...enrollmentData, classroom_id: e.target.value})} 
                        required 
                        style={{ flex: 1, padding: '12px', borderRadius: '6px' }}
                    >
                        <option value="">-- Select Classroom --</option>
                        {classrooms.map(c => <option key={c.id} value={c.id}>{c.classroomname}</option>)}
                    </select>

                    <button type="submit" style={{ padding: '10px 25px', backgroundColor: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Enroll Student
                    </button>
                </form>
            </div>

            {/* ENROLLMENT RECORDS TABLE */}
            <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3>Active Enrollment Records</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Student Name</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Enrolled Class</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allEnrollments.map((record) => (
                            <tr key={`${record.student_id}-${record.classroom_id}`} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{record.student_name}</td>
                                <td style={{ padding: '12px' }}><strong>{record.class_name}</strong></td>
                                <td style={{ padding: '12px' }}>
                                    <button 
                                        onClick={() => handleUnenroll(record.student_id, record.classroom_id)}
                                        style={{ color: '#f44336', background: 'none', border: '1px solid #f44336', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Remove from Class
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {allEnrollments.length === 0 && <p style={{ textAlign: 'center', color: '#888', marginTop: '10px' }}>No students currently enrolled.</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;