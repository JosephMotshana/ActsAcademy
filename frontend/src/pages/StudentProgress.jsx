import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Style/StudentGlobal.css';

const StudentProgress = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [roster, setRoster] = useState([]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                    const res = await axios.get(`/api/lecturer/performance/${classId}`);
                setRoster(res.data);
            } catch (err) {
                console.error("Error fetching progress:", err);
            }
        };
        fetchProgress();
    }, [classId]);

    return (
        <div className="progress-container">
            <h2 className="progress-title">Student Performance Tracking</h2>
            
            <div className="progress-table-wrapper">
                <table className="progress-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Tests Completed</th>
                            <th>Total Points</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roster.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="empty-state-cell">
                                    No students enrolled.
                                </td>
                            </tr>
                        ) : (
                            roster.map((s, idx) => (
                                <tr key={idx} className="progress-row">
                                    <td className="col-name">{s.student_name}</td>
                                    <td>{s.quizzes_completed || 0}</td>
                                    <td className="col-points">
                                        {s.total_points_earned || 0} / {s.total_possible_points || 0}
                                    </td>
                                    <td className="text-center">
                                        <button 
                                            onClick={() => navigate(`/lecturer/mark/${s.student_id}/${classId}`)}
                                            className="btn-mark-test"
                                        >
                                            Mark Test
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentProgress;