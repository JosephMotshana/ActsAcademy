import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LiveClass = ({ user }) => {
    const { classId } = useParams();
    const roomName = `ActsAcademy_Room_${classId}`;

    useEffect(() => {
        // Load Jitsi External API script
        const domain = "meet.jit.si";
        const options = {
            roomName: roomName,
            width: "100%",
            height: 700,
            parentNode: document.querySelector('#meet'),
            userInfo: {
                displayName: `Lecturer: ${user.username}`
            },
            configOverwrite: { startWithAudioMuted: true },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'framerate', 'chat', 'raisehand', 'videoquality', 'filmstrip',
                    'invite', 'feedback', 'stats', 'shortcuts', 'tileview', 'videobackgroundblur',
                    'download', 'help', 'mute-everyone', 'security'
                ],
            }
        };
        const api = new window.JitsiMeetExternalAPI(domain, options);

        return () => api.dispose();
    }, [roomName, user.username]);

    return (
        <div>
            <h2>🎥 Live Lecture Hall</h2>
            <p>You are the host. Students will join as participants.</p>
            <div id="meet" style={{ borderRadius: '10px', overflow: 'hidden', border: '2px solid #1a237e' }}></div>
        </div>
    );
};

export default LiveClass;