import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StudentMaterials = () => {
    const { classId } = useParams();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                // Fetching from the student-specific route we created earlier
                const res = await axios.get(`http://localhost:5000/api/student/materials/${classId}`);
                setMaterials(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching materials:", err);
                setLoading(false);
            }
        };

        if (classId) {
            fetchMaterials();
        }
    }, [classId]);

    if (loading) return <p>Loading course materials...</p>;

    return (
        <div style={{ display: 'grid', gap: '20px' }}>
            <h2>📚 Study Materials</h2>
            {materials.length > 0 ? (
                materials.map(m => (
                    <div key={m.id} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#1a237e' }}>{m.title}</h4>
                        
                        {/* Preview Logic based on file type */}
                        <div style={{ marginBottom: '15px' }}>
                            {m.type === 'image' && (
                                <img src={m.file_path} alt={m.title} style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '5px' }} />
                            )}
                            
                            {m.type === 'video' && (
                                <video controls style={{ width: '100%', borderRadius: '5px', backgroundColor: '#000' }}>
                                    <source src={m.file_path} />
                                    Your browser does not support the video tag.
                                </video>
                            )}

                            {m.type === 'document' && (
                                <p style={{ fontSize: '14px', color: '#666' }}>📄 Document File (Click below to download)</p>
                            )}
                        </div>

                        <div style={{ marginTop: '10px' }}>
                            <a 
                                href={m.file_path} 
                                download 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ 
                                    textDecoration: 'none', 
                                    background: '#e8eaf6', 
                                    padding: '10px 20px', 
                                    borderRadius: '5px', 
                                    color: '#1a237e', 
                                    fontWeight: 'bold',
                                    display: 'inline-block'
                                }}
                            >
                                {m.type === 'link' ? '🔗 Open External Link' : '⬇️ Download for Offline'}
                            </a>
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                    <p>No materials have been uploaded for this class yet.</p>
                </div>
            )}
        </div>
    );
};

export default StudentMaterials;