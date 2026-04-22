import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StudyMaterials = () => {
    const { classId } = useParams();
    const [materials, setMaterials] = useState([]);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('document'); // document, image, video, link
    const [file, setFile] = useState(null);
    const [link, setLink] = useState('');

    const fetchMaterials = async () => {
        try {
            // Ensure this matches your backend port (usually 5000)
            const res = await axios.get(`http://localhost:5000/api/lecturer/materials/${classId}`);
            setMaterials(res.data);
        } catch (err) {
            console.error("Error fetching materials", err);
        }
    };

    useEffect(() => { 
        if (classId) fetchMaterials(); 
    }, [classId]);

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!classId) {
            alert("No Class ID found. Cannot upload.");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('classId', classId);

        if (type === 'link') {
            formData.append('link', link);
        } else {
            if (!file) {
                alert("Please select a file first!");
                return;
            }
            formData.append('file', file);
        }

        try {
            await axios.post('http://localhost:5000/api/lecturer/add-material', formData);
            alert("Uploaded successfully!");
            
            // Reset form
            setTitle('');
            setLink('');
            setFile(null);
            document.getElementById("fileInput").value = ""; // Clear file input manually
            
            fetchMaterials(); // Refresh the list
        } catch (err) {
            const backendError = err.response?.data?.error || err.message;
            alert(`Upload failed: ${backendError}`);
            console.error("Full error:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this material?")) {
            try {
                await axios.delete(`http://localhost:5000/api/lecturer/material/${id}`);
                fetchMaterials();
            } catch (err) {
                alert("Failed to delete material.");
            }
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2>📚 Manage Course Materials</h2>
            
            {/* Upload Form */}
            <form onSubmit={handleUpload} style={{ display: 'grid', gap: '15px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #dee2e6' }}>
                <input 
                    placeholder="Material Title (e.g. Week 1 Lecture Notes)" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    required 
                    style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
                />
                
                <select value={type} onChange={e => setType(e.target.value)} style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}>
                    <option value="document">📄 Document (PDF/Word)</option>
                    <option value="image">🖼️ Picture</option>
                    <option value="video">🎥 Video File</option>
                    <option value="link">🔗 Web Link (Drive/YouTube)</option>
                </select>

                {type === 'link' ? (
                    <input 
                        placeholder="Paste URL here (https://...)" 
                        value={link} 
                        onChange={e => setLink(e.target.value)} 
                        required
                        style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
                    />
                ) : (
                    <input 
                        id="fileInput"
                        type="file" 
                        onChange={e => setFile(e.target.files[0])} 
                        required
                        style={{padding: '10px'}}
                    />
                )}

                <button type="submit" style={{ backgroundColor: '#1a237e', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Post to Classroom
                </button>
            </form>

            {/* List of Materials */}
            <div style={{ display: 'grid', gap: '15px' }}>
                <h3>Current Materials</h3>
                {materials.length === 0 ? <p>No materials uploaded yet.</p> : materials.map(m => (
                    <div key={m.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div>
                            <strong>{m.title}</strong> <br />
                            <small style={{color: '#666', textTransform: 'capitalize'}}>{m.type}</small>
                        </div>
                        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                            {/* FIXED LINK LOGIC BELOW */}
                            <a 
                                href={m.file_url && m.file_url.startsWith('http') ? m.file_url : `http://localhost:5000${m.file_url}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ color: '#1a237e', textDecoration: 'none', fontWeight: 'bold', border: '1px solid #1a237e', padding: '5px 10px', borderRadius: '4px' }}
                            >
                                View
                            </a>
                            <button 
                                onClick={() => handleDelete(m.id)} 
                                style={{color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '500'}}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudyMaterials;