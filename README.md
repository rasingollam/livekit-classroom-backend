# EdumeClassroom LiveKit Backend API Documentation

This document explains how to use the backend authentication route (`authRoutes.js`) from your React frontend to join a LiveKit-powered classroom.  
A usage example is provided from the frontend file [`App.js`](livekit-classroom-frontend/src/App.js).

---

## API Endpoint

**POST** `/api/classroom/get-livekit-token`

This endpoint generates a LiveKit access token for a user (student or teacher) to join a classroom (room).

### Request Body

Send a JSON object with the following fields:

| Field                | Type      | Required | Description                                 |
|----------------------|-----------|----------|---------------------------------------------|
| `roomName`           | string    | Yes      | The name of the classroom/room to join      |
| `participantIdentity`| string    | Yes      | A unique identifier for the participant     |
| `participantName`    | string    | Yes      | The display name of the participant         |
| `isTeacher`          | boolean   | Yes      | Set to `true` if the user is a teacher      |

**Example:**
```json
{
  "roomName": "math-class",
  "participantIdentity": "teacher-1721041234567",
  "participantName": "Alice",
  "isTeacher": true
}
```

---

## How to Use This API in the React Frontend

Below is an example of how to call this API from your React frontend.  

```javascript
const handleJoinRoom = async (e) => {
  e.preventDefault();
  if (!roomName || !participantName) {
    alert('Room name and participant name are required.');
    return;
  }

  // Generate a unique participant identity
  const participantIdentity = `${isTeacher ? 'teacher' : 'student'}-${Date.now()}`;

  try {
    const response = await fetch('http://localhost:3001/api/classroom/get-livekit-token', {
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
    setToken(data.token);        // Save the token for LiveKitRoom
    setLivekitUrl(data.url);     // Save the LiveKit server URL
  } catch (error) {
    alert(`Error joining room: ${error.message}`);
  }
};
```

### Usage Flow

1. **Collect user input** for name, room, and teacher status.
2. **Call the API** as shown above to get a LiveKit token and server URL.
3. **Pass the token and URL** to your LiveKitRoom component to join the classroom.

---

## Example UI Integration

```javascript
<LiveKitRoom
  serverUrl={livekitUrl}
  token={token}
  connect={true}
  onDisconnected={() => setToken('')}
  audio={true}
  video={true}
>
  <VideoConference />
  <RoomAudioRenderer />
</LiveKitRoom>
```

---

## Notes

- Both teachers and students use the same endpoint; set `isTeacher` accordingly.
- The backend will create the room automatically if it does not exist when the first participant joins.
- Make sure your backend server is running and accessible from your frontend.
- For a full working example, see [`livekit-classroom-frontend/src/App.js`](livekit-classroom-frontend/src/App.js).