import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LecturerDashboard = ({ lecturerId }) => {
    const [myClasses, setMyClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        // For now, we manually pass a lecturerId until login is ready
        const res = await axios.get(`http://localhost:5000/api/admin/my-classes/${lecturerId}`);
        setMyClasses(res.data);
    };

    const viewStudents = async (classId, className) => {
        const res = await axios.get(`http://localhost:5000/api/admin/class-students/${classId}`);
        setStudents(res.data);
        setSelectedClass(className);
    };

    const removeStudentFromClass = async (studentId) => {
        if (window.confirm("Remove student from this class?")) {
            // This hits your existing delete student route
            await axios.delete(`http://localhost:5000/api/admin/student/${studentId}`);
            // Refresh the student list for this class
            const classObj = myClasses.find(c => c.classroomname === selectedClass);
            viewStudents(classObj.id, selectedClass);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Lecturer Portal</h1>
            <div style={{ display: 'flex', gap: '40px' }}>
                
                {/* Section 1: My assigned classes */}
                <div style={{ flex: 1 }}>
                    <h3>My Assigned Classes</h3>
                    {myClasses.length > 0 ? (
                        <ul>
                            {myClasses.map(c => (
                                <li key={c.id} style={{ marginBottom: '10px' }}>
                                    {c.classroomname} 
                                    <button onClick={() => viewStudents(c.id, c.classroomname)} style={{ marginLeft: '10px' }}>
                                        View Students
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No classes assigned yet.</p>}
                </div>

                {/* Section 2: Students in selected class */}
                <div style={{ flex: 1, borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
                    {selectedClass ? (
                        <>
                            <h3>Students in {selectedClass}</h3>
                            <ul>
                                {students.map(s => (
                                    <li key={s.id} style={{ marginBottom: '10px' }}>
                                        {s.username} ({s.email})
                                        <button 
                                            onClick={() => removeStudentFromClass(s.id)} 
                                            style={{ marginLeft: '10px', color: 'red' }}
                                        >
                                            Remove Student
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : <p>Select a class to manage students.</p>}
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboard;