import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LecturerDashboard = ({ lecturerId }) => {
    const [myClasses, setMyClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
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
            await axios.delete(`http://localhost:5000/api/admin/student/${studentId}`);
            const classObj = myClasses.find(c => c.classroomname === selectedClass);
            viewStudents(classObj.id, selectedClass);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Lecturer Portal</h1>
            <div style={{ display: 'flex', gap: '40px' }}>
                
                <div style={{ flex: 1 }}>
                    <h3>My Assigned Classes</h3>
                    {myClasses.length > 0 ? (
                        <ul>
                            {myClasses.map(c => (
                                <li key={c.id} style={{ marginBottom: '10px' }}>
                                    {/* STEP 2: WRAP THE NAME IN A LINK */}
                                    <Link 
                                        to={`/classroom/${c.id}`} 
                                        style={{ textDecoration: 'none', color: '#2196f3', fontWeight: 'bold' }}
                                    >
                                        {c.classroomname}
                                    </Link>
                                    
                                    <button onClick={() => viewStudents(c.id, c.classroomname)} style={{ marginLeft: '10px' }}>
                                        Manage Students
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No classes assigned yet.</p>}
                </div>

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
                    ) : <p>Select "Manage Students" to see the class list.</p>}
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboard;