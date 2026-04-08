import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [lecturers, setLecturers] = useState([]);

  // Function to delete a lecturer
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this lecturer?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/lecturer/${id}`);
        // Refresh the list after deleting
        setLecturers(lecturers.filter(lec => lec.id !== id));
        alert("Lecturer removed successfully");
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
  };

  return (
    <div>
      <h2>Academy Management</h2>
      {/* You would typically fetch and map lecturers here */}
      <button onClick={() => handleDelete(1)}> Remove Lecturer (ID: 1) </button>
    </div>
  );
};

export default AdminPanel;