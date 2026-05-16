import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../Style/StudentGlobal.css';

const StudentMaterials = () => {
    const { classId } = useParams();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMaterials = async () => {
        try {
            const res = await axios.get(`/api/student/materials/${classId}`);
            setMaterials(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching materials:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (classId) fetchMaterials();
    }, [classId]);

    const getCorrectUrl = (path) => {
        if (!path) return "#";
        if (path.startsWith('http')) return path;
        const base = window.__API_URL__ || import.meta.env.VITE_API_URL || '';
        return `${base}${path}`;
    };

    const downloadFile = (url, fileName) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobURL = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = blobURL;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.click(); // Double click for some browsers
                window.URL.revokeObjectURL(blobURL);
            })
            .catch(() => window.open(url, '_blank'));
    };

    if (loading) return <p className="materials-loading">Loading course materials...</p>;

    return (
        <div className="materials-page-container">
            <h2 className="materials-title">Study Materials</h2>
            
            <div className="materials-grid">
                {materials.map(m => {
                    const fileUrl = getCorrectUrl(m.file_path || m.file_url);
                    
                    return (
                        <div key={m.id} className="material-card">
                            <div className="material-card-header">
                                <h4 className="material-item-title">{m.title}</h4>
                                <span className="material-type-badge">{m.type}</span>
                            </div>

                            <div className="material-preview-box">
                                {m.type === 'image' && <img src={fileUrl} alt={m.title} className="preview-image" />}
                                {m.type === 'video' && <video src={fileUrl} controls className="preview-video" />}
                                {m.type === 'document' && <div className="preview-placeholder">📄 Document Ready</div>}
                                {m.type === 'link' && <div className="preview-placeholder">🔗 External Link</div>}
                            </div>

                            <div className="material-actions">
                                {m.type === 'link' ? (
                                    <a href={fileUrl} target="_blank" rel="noreferrer" className="btn-material btn-gold">
                                        Open Link
                                    </a>
                                ) : (
                                    <>
                                        <a href={fileUrl} target="_blank" rel="noreferrer" className="btn-material btn-navy">
                                            View
                                        </a>
                                        <button 
                                            onClick={() => downloadFile(fileUrl, `${m.title}`)} 
                                            className="btn-material btn-gold-outline"
                                        >
                                            Save to Device
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentMaterials;