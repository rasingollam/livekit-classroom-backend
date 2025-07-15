import { useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';
import './App.css';

function App() {
  const [roomName, setRoomName] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const [token, setToken] = useState('');
  const [livekitUrl, setLivekitUrl] = useState('');

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomName || !participantName) {
      alert('Room name and participant name are required.');
      return;
    }

    // A simple unique identity for the participant
    const participantIdentity = `${isTeacher ? 'teacher' : 'student'}-${Date.now()}`;

    try {
      const response = await fetch('http://localhost:3001/api/get-livekit-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName,
          participantIdentity,
          participantName,
          isTeacher,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get token');
      }

      const data = await response.json();
      setToken(data.token);
      setLivekitUrl(data.url);
    } catch (error) {
      console.error('Error joining room:', error);
      alert(`Error joining room: ${error.message}`);
    }
  };

  // If we have a token, we render the video conference room.
  if (token) {
    return (
      <LiveKitRoom
        serverUrl={livekitUrl}
        token={token}
        connect={true}
        // When you disconnect, clear the token to return to the pre-join screen
        onDisconnected={() => setToken('')}
        // Add your components here
        audio={true}
        video={true}
      >
        {/* The main video conference grid, which includes its own controls */}
        <VideoConference />
        {/* A component to render all remote audio tracks */}
        <RoomAudioRenderer />
        {/* The extra ControlBar was here, now it's removed. */}
      </LiveKitRoom>
    );
  }

  // Otherwise, we render the pre-join screen.
  return (
    <div className="prejoin-container">
      <form onSubmit={handleJoinRoom} className="prejoin-form">
        <h2>Join Classroom</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <div className="teacher-checkbox">
          <input
            id="teacher-check"
            type="checkbox"
            checked={isTeacher}
            onChange={(e) => setIsTeacher(e.target.checked)}
          />
          <label htmlFor="teacher-check">I am a teacher</label>
        </div>
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
}

export default App;
