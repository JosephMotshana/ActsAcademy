import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StudentMaterials = () => {
    const { classId } = useParams();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMaterials = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/student/materials/${classId}`);
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
        return `http://localhost:5000${path}`;
    };

    // FORCE DOWNLOAD FUNCTION
    // This helps mobile browsers "save" instead of just opening the file in a tab
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
                window.URL.revokeObjectURL(blobURL);
            })
            .catch(() => window.open(url, '_blank')); // Fallback
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading course materials...</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ color: '#1a237e', borderBottom: '2px solid #1a237e', paddingBottom: '10px' }}>
                📚 Study Materials
            </h2>
            
            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                {materials.map(m => {
                    const fileUrl = getCorrectUrl(m.file_path || m.file_url);
                    
                    return (
                        <div key={m.id} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h4 style={{ margin: '0', color: '#1a237e' }}>{m.title}</h4>
                                <small style={{ color: '#888' }}>{m.type.toUpperCase()}</small>
                            </div>

                            {/* PREVIEW CONTAINER */}
                            <div style={{ margin: '15px 0', background: '#f4f4f4', borderRadius: '8px', overflow: 'hidden' }}>
                                {m.type === 'image' && <img src={fileUrl} alt="" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />}
                                {m.type === 'video' && <video src={fileUrl} controls style={{ width: '100%' }} />}
                                {m.type === 'document' && <div style={{ padding: '20px', textAlign: 'center' }}>📄 PDF/Document Ready</div>}
                            </div>

                            {/* ACTIONS */}
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {m.type === 'link' ? (
                                    <a href={fileUrl} target="_blank" rel="noreferrer" style={buttonStyle('#ff9800')}>
                                        🔗 Open Link
                                    </a>
                                ) : (
                                    <>
                                        {/* VIEW BUTTON */}
                                        <a href={fileUrl} target="_blank" rel="noreferrer" style={buttonStyle('#1a237e')}>
                                            👁️ View
                                        </a>
                                        {/* DOWNLOAD BUTTON */}
                                        <button 
                                            onClick={() => downloadFile(fileUrl, `${m.title}`)} 
                                            style={{ ...buttonStyle('#4caf50'), border: 'none', cursor: 'pointer' }}
                                        >
                                            ⬇️ Save to Device
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

const buttonStyle = (bg) => ({
    textDecoration: 'none',
    background: bg,
    padding: '10px 20px',
    borderRadius: '6px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem'
});

export default StudentMaterials;