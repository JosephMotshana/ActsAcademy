import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddLecturer from '../components/AddLecturer';
import AddStudent from '../components/AddStudent'; // Added
import CreateClassroom from '../components/CreateClassroom';

const AdminDashboard = () => {
    const [lecturers, setLecturers] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [enrollmentData, setEnrollmentData] = useState({ student_id: '', classroom_id: '' });

    const fetchData = async () => {
        try {
            const [lecRes, classRes, studRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/lecturers'),
                axios.get('http://localhost:5000/api/admin/classrooms'),
                axios.get('http://localhost:5000/api/admin/students')
            ]);
            setLecturers(lecRes.data);
            setClassrooms(classRes.data);
            setStudents(studRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    const reassignLecturer = async (classroomId, lecturerId) => {
        if (!lecturerId) return;
        try {
            await axios.post('http://localhost:5000/api/admin/reassign-lecturer', { classroomId, lecturerId });
            alert("Lecturer reassigned!");
            fetchData();
        } catch (err) {
            alert("Failed to reassign: " + err.message);
        }
    };

    const deleteClassroom = async (id) => {
        if (window.confirm("Delete this class? Enrollment data will be lost.")) {
            await axios.delete(`http://localhost:5000/api/admin/classroom/${id}`);
            fetchData();
        }
    };

    const deleteLecturer = async (id) => {
        if (window.confirm("Remove this lecturer? Their classes will become unassigned.")) {
            await axios.delete(`http://localhost:5000/api/admin/lecturer/${id}`);
            fetchData();
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm("Remove this student permanently?")) {
            await axios.delete(`http://localhost:5000/api/admin/student/${id}`);
            fetchData();
        }
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/enroll', enrollmentData);
            alert("Student Enrolled!");
            setEnrollmentData({ student_id: '', classroom_id: '' });
            fetchData();
        } catch (err) {
            alert("Enrollment failed (Check if student is already in this class)");
        }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div style={{ padding: '30px', fontFamily: 'Segoe UI, Arial', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Academy Admin Portal</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                
                {/* Column 1: User Management */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <AddLecturer onLecturerAdded={fetchData} />
                    <AddStudent onStudentAdded={fetchData} />
                    
                    <h3>Staff & Students</h3>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <h4>Lecturers</h4>
                        {lecturers.map(lec => (
                            <div key={lec.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #eee' }}>
                                <span>{lec.username}</span>
                                <button onClick={() => deleteLecturer(lec.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                            </div>
                        ))}
                        <h4 style={{ marginTop: '20px' }}>Students</h4>
                        {students.map(std => (
                            <div key={std.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #eee' }}>
                                <span>{std.username}</span>
                                <button onClick={() => deleteUser(std.id)} style={{ color: 'orange', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 2: Classroom Management */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <CreateClassroom lecturers={lecturers} onClassCreated={fetchData} />
                    
                    <h3>Classroom List</h3>
                    {classrooms.map(cls => (
                        <div key={cls.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Link to={`/classroom/${cls.id}`} style={{ fontSize: '1.1rem', fontWeight: 'bold', textDecoration: 'none', color: '#007bff' }}>
                                    {cls.classroomname}
                                </Link>
                                <button onClick={() => deleteClassroom(cls.id)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px' }}>Delete</button>
                            </div>
                            <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                                <span>Lecturer: <strong>{cls.lecturer_name || <span style={{color: 'red'}}>Unassigned</span>}</strong></span>
                                <select 
                                    style={{ marginLeft: '10px', padding: '2px' }}
                                    onChange={(e) => reassignLecturer(cls.id, e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Change Lecturer</option>
                                    {lecturers.map(l => <option key={l.id} value={l.id}>{l.username}</option>)}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom: Enrollment Tool */}
            <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3>Quick Enroll</h3>
                <form onSubmit={handleEnroll} style={{ display: 'flex', gap: '15px' }}>
                    <select value={enrollmentData.student_id} onChange={(e) => setEnrollmentData({...enrollmentData, student_id: e.target.value})} required style={{ flex: 1, padding: '10px' }}>
                        <option value="">Select Student</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.username}</option>)}
                    </select>
                    <select value={enrollmentData.classroom_id} onChange={(e) => setEnrollmentData({...enrollmentData, classroom_id: e.target.value})} required style={{ flex: 1, padding: '10px' }}>
                        <option value="">Select Class</option>
                        {classrooms.map(c => <option key={c.id} value={c.id}>{c.classroomname}</option>)}
                    </select>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Enroll Student</button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;