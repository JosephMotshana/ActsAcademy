import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddLecturer from '../components/AddLecturer';
import CreateClassroom from '../components/CreateClassroom';

const AdminDashboard = () => {
    // 1. ALL STATES (Hooks) must be at the very top
    const [lecturers, setLecturers] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [enrollmentData, setEnrollmentData] = useState({ student_id: '', classroom_id: '' });

    // 2. FETCH DATA FUNCTION
    const fetchData = async () => {
        try {
            const lecRes = await axios.get('http://localhost:5000/api/admin/lecturers');
            const classRes = await axios.get('http://localhost:5000/api/admin/classrooms');
            
            // Try fetching students, but don't crash if the route isn't ready yet
            try {
                const studRes = await axios.get('http://localhost:5000/api/admin/students');
                setStudents(studRes.data);
            } catch (e) { console.log("Students route not found yet"); }

            setLecturers(lecRes.data);
            setClassrooms(classRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    // 3. ACTIONS (Delete/Enroll)
    const deleteClassroom = async (id) => {
        if (window.confirm("Are you sure? This will also remove all students from this class!")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/classroom/${id}`);
                fetchData();
            } catch (err) {
                alert("Error deleting classroom");
            }
        }
    };

    const deleteLecturer = async (id) => {
        if (window.confirm("Are you sure? This will unassign their classes.")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/lecturer/${id}`);
                fetchData();
            } catch (err) {
                alert("Error removing lecturer");
            }
        }
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/enroll', enrollmentData);
            alert("Student Enrolled!");
            fetchData();
        } catch (err) {
            alert("Enrollment failed");
        }
    };
    const deleteStudent = async (id) => {
    if (window.confirm("Are you sure? This will remove the student from all classes!")) {
        try {
            await axios.delete(`http://localhost:5000/api/admin/student/${id}`);
            fetchData(); // Refresh all lists
        } catch (err) {
            alert("Error removing student");
        }
    }
};

    // 4. INITIAL LOAD
    useEffect(() => {
        fetchData();
    }, []);

    // 5. THE UI
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Academy Management Portal</h1>
            
            <div style={{ display: 'flex', gap: '40px' }}>
                {/* Left Column: Staff */}
                <div style={{ flex: 1 }}>
                    <AddLecturer onLecturerAdded={fetchData} />
                    <h3>Active Lecturers</h3>
                    <ul>
                        {lecturers.map(lec => (
                            <li key={lec.id} style={{ marginBottom: '10px' }}>
                                {lec.username} ({lec.email}) 
                                <button onClick={() => deleteLecturer(lec.id)} style={{ marginLeft: '10px', color: 'red' }}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Column: Classrooms */}
                <div style={{ flex: 1 }}>
                    <CreateClassroom lecturers={lecturers} onClassCreated={fetchData} />
                    <h3>Current Classrooms</h3>
                    <ul>
                        {classrooms.map(cls => (
                            <li key={cls.id} style={{ marginBottom: '10px' }}>
                                <strong>{cls.classroomname}</strong> - Lecturer: {cls.lecturer_name || 'Unassigned'}
                                <button onClick={() => deleteClassroom(cls.id)} style={{ marginLeft: '10px', fontSize: '12px' }}>Delete Class</button>
                            </li>
                        ))}
                    </ul>
                </div>
            <div style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
    <h2>Student Enrollment</h2>
    <form onSubmit={handleEnroll}>
        <select 
            onChange={(e) => setEnrollmentData({...enrollmentData, student_id: e.target.value})} 
            required
        >
            <option value="">Select Student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.username}</option>)}
        </select>

        <select 
            onChange={(e) => setEnrollmentData({...enrollmentData, classroom_id: e.target.value})} 
            required
        >
            <option value="">Select Classroom</option>
            {classrooms.map(c => <option key={c.id} value={c.id}>{c.classroomname}</option>)}
        </select>

        <button type="submit">Enroll Student in Class</button>
    </form>
</div>
<div style={{ marginTop: '20px' }}>
    <h3>Active Students</h3>
    <ul>
        {students.map(std => (
            <li key={std.id} style={{ marginBottom: '10px' }}>
                {std.username} ({std.email})
                <button 
                    onClick={() => deleteStudent(std.id)} 
                    style={{ marginLeft: '10px', color: 'orange', fontSize: '11px' }}
                >
                    Delete Student
                </button>
            </li>
        ))}
    </ul>
</div>
            </div>
        </div>
    );
};

// FIX: Export the component name, not the filename
export default AdminDashboard;