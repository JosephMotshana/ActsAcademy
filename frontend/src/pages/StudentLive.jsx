import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const StudentLive = ({ user }) => {
    const { classId } = useParams();
    const roomName = `ActsAcademy_Room_${classId}`;

    useEffect(() => {
        const domain = "meet.jit.si";
        const options = {
            roomName: roomName,
            width: "100%",
            height: 600,
            parentNode: document.querySelector('#student-meet'),
            userInfo: {
                displayName: user?.username || "Student"
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: ['microphone', 'camera', 'chat', 'raisehand', 'tileview'],
            }
        };
        const api = new window.JitsiMeetExternalAPI(domain, options);
        return () => api.dispose();
    }, [roomName, user?.username]);

    return (
        <div>
            <h2>🎥 Join Live Class</h2>
            <div id="student-meet" style={{ borderRadius: '10px', overflow: 'hidden' }}></div>
        </div>
    );
};

export default StudentLive;