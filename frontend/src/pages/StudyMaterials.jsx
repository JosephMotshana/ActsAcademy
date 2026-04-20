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
            const res = await axios.get(`http://localhost:5000/api/lecturer/materials/${classId}`);
            setMaterials(res.data);
        } catch (err) {
            console.error("Error fetching materials", err);
        }
    };

    useEffect(() => { fetchMaterials(); }, [classId]);

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('classId', classId);
        
        if (type === 'link') {
            formData.append('link', link);
        } else {
            formData.append('file', file);
        }

        try {
            await axios.post('http://localhost:5000/api/lecturer/add-material', formData);
            alert("Uploaded successfully!");
            setTitle('');
            setLink('');
            setFile(null);
            fetchMaterials();
        } catch (err) {
            alert("Upload failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this material?")) {
            await axios.delete(`http://localhost:5000/api/lecturer/material/${id}`);
            fetchMaterials();
        }
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h2>📚 Manage Course Materials</h2>
            
            {/* Upload Form */}
            <form onSubmit={handleUpload} style={{ display: 'grid', gap: '15px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                <input placeholder="Material Title" value={title} onChange={e => setTitle(e.target.value)} required style={{padding: '10px'}}/>
                
                <select value={type} onChange={e => setType(e.target.value)} style={{padding: '10px'}}>
                    <option value="document">📄 Document (PDF/Word)</option>
                    <option value="image">🖼️ Picture</option>
                    <option value="video">🎥 Video File</option>
                    <option value="link">🔗 Web Link (Drive/YouTube)</option>
                </select>

                {type === 'link' ? (
                    <input placeholder="Paste URL here" value={link} onChange={e => setLink(e.target.value)} style={{padding: '10px'}}/>
                ) : (
                    <input type="file" onChange={e => setFile(e.target.files[0])} style={{padding: '10px'}}/>
                )}

                <button type="submit" style={{ backgroundColor: '#1a237e', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Post to Classroom
                </button>
            </form>

            {/* List of Materials */}
            <div style={{ display: 'grid', gap: '15px' }}>
                <h3>Current Materials</h3>
                {materials.map(m => (
                    <div key={m.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
                        <div>
                            <strong>{m.title}</strong> <small style={{color: '#666'}}>({m.type})</small>
                        </div>
                        <div style={{display: 'flex', gap: '15px'}}>
                            <a href={m.file_path || m.link} target="_blank" rel="noreferrer" style={{ color: '#1a237e', textDecoration: 'none', fontWeight: 'bold' }}>View</a>
                            <button onClick={() => handleDelete(m.id)} style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudyMaterials;