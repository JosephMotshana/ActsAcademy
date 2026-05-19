import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../Style/global.css';

const StudyMaterials = () => {
    const { classId } = useParams();
    const [materials, setMaterials] = useState([]);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('document'); // document, image, video, link
    const [file, setFile] = useState(null);
    const [link, setLink] = useState('');

    const fetchMaterials = async () => {
        try {
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
            setTitle('');
            setLink('');
            setFile(null);
            document.getElementById("fileInput").value = ""; 
            fetchMaterials(); 
        } catch (err) {
            const backendError = err.response?.data?.error || err.message;
            alert(`Upload failed: ${backendError}`);
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
        <div className="study-materials-container">
            <h2 className="materials-page-title">Manage Course Materials</h2>
            
            {/* Upload Form */}
            <form onSubmit={handleUpload} className="materials-upload-form">
                <input 
                    className="material-input-field"
                    placeholder="Material Title (e.g. Week 1 Lecture Notes)" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    required 
                />
                
                <select 
                    className="material-select-field"
                    value={type} 
                    onChange={e => setType(e.target.value)}
                >
                    <option value="document">Document (PDF/Word)</option>
                    <option value="image">Picture</option>
                    <option value="video">Video File</option>
                    <option value="link">Web Link (Drive/YouTube)</option>
                </select>

                {type === 'link' ? (
                    <input 
                        className="material-input-field"
                        placeholder="Paste URL here (https://...)" 
                        value={link} 
                        onChange={e => setLink(e.target.value)} 
                        required
                    />
                ) : (
                    <input 
                        className="material-file-input"
                        id="fileInput"
                        type="file" 
                        onChange={e => setFile(e.target.files[0])} 
                        required
                    />
                )}

                <button type="submit" className="btn-post-material">
                    Post to Classroom
                </button>
            </form>

            {/* List of Materials */}
            <div className="materials-list-section">
                <h3 className="materials-list-title">Current Materials</h3>
                {materials.length === 0 ? (
                    <p className="no-materials-text">No materials uploaded yet.</p>
                ) : (
                    materials.map(m => (
                        <div key={m.id} className="material-item-card">
                            <div className="material-meta">
                                <strong className="material-item-title">{m.title}</strong> <br />
                                <small className="material-type-tag">{m.type}</small>
                            </div>
                            <div className="material-item-actions">
                                <a 
                                    href={m.file_url && m.file_url.startsWith('http') ? m.file_url : `${getApiBase()}${m.file_url}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="btn-view-material"
                                >
                                    View
                                </a>
                                <button 
                                    onClick={() => handleDelete(m.id)} 
                                    className="btn-delete-material"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudyMaterials;