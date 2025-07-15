const express = require('express');
const { AccessToken, RoomServiceClient } = require('livekit-server-sdk');
require('dotenv').config(); // Load environment variables
const cors = require('cors'); // For development, allow cross-origin requests

const app = express();
const port = process.env.PORT || 3001; // Use port from .env or default to 3001

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // ONLY allow your React app's origin during development
    // In production, change this to your deployed React app's URL (e.g., 'https://your-classroom-app.com')
}));
app.use(express.json()); // To parse JSON request bodies

// LiveKit credentials from environment variables
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

// Initialize RoomServiceClient for server-side actions (like muting)
const roomService = new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

// --- API Endpoint: Generate LiveKit Token ---
app.post('/api/get-livekit-token', async (req, res) => { // Make the function async
    const { roomName, participantIdentity, participantName, isTeacher } = req.body;

    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
        return res.status(500).json({ error: 'Server is not configured. Missing API key or secret.' });
    }

    if (!roomName || !participantIdentity || !participantName) {
        return res.status(400).json({ error: 'Room name, participant identity, and name are required.' });
    }

    // Create an AccessToken object for the participant
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: participantIdentity, // Unique ID for this participant (e.g., user's database ID)
        name: participantName,       // Display name in the room
        ttl: 3600,                   // Token expires in 1 hour (3600 seconds) - adjust as needed
    });

    // Grant permissions for this participant in the specified room
    at.addGrant({
        roomJoin: true,              // Allow joining the room
        room: roomName,              // The specific room they are joining
        canPublish: true,            // Can publish audio/video (teacher and students)
        canSubscribe: true,          // Can subscribe to others' audio/video
        canPublishData: true,        // Can send data messages (for chat, etc.)
        // Advanced permissions based on role:
        roomAdmin: isTeacher,        // Only teachers should have room admin privileges
        canMute: isTeacher,          // Teachers can mute/unmute others
        canWhisper: true,            // Allow private messages (optional)
        // For a classroom: teacher might need canUpdateParticipants: true, canUpdateRoom: true
    });

    const token = await at.toJwt(); // Add await here
    console.log('Generated Token on Server:', token); // Add this line for debugging
    res.json({ token, url: LIVEKIT_URL }); // Send token and LiveKit URL to frontend
});

// --- API Endpoint: Teacher Actions ---
app.post('/api/teacher-action', async (req, res) => {
    const { roomName, participantIdentityToAffect, action, teacherIdentity } = req.body;

    // In a real app, you'd verify `teacherIdentity` against your authenticated user session
    // to ensure only actual teachers can perform these actions.
    // For this example, we assume the frontend is sending a teacher's identity.

    if (!roomName || !action || !teacherIdentity) {
        return res.status(400).json({ error: 'Room name, action, and teacher identity are required.' });
    }

    try {
        if (action === 'muteParticipant' && participantIdentityToAffect) {
            await roomService.mutePublishedTrack(roomName, participantIdentityToAffect, 'audio', true);
            return res.json({ message: `Participant ${participantIdentityToAffect} muted.` });
        } else if (action === 'unmuteParticipant' && participantIdentityToAffect) {
            await roomService.mutePublishedTrack(roomName, participantIdentityToAffect, 'audio', false);
            return res.json({ message: `Participant ${participantIdentityToAffect} unmuted.` });
        } else if (action === 'removeParticipant' && participantIdentityToAffect) {
            await roomService.removeParticipant(roomName, participantIdentityToAffect);
            return res.json({ message: `Participant ${participantIdentityToAffect} removed.` });
        } else if (action === 'listParticipants') {
            const roomInfo = await roomService.listParticipants(roomName);
            // Filter out self if you don't want teacher to see themselves in list
            const participants = roomInfo.participants.filter(p => p.identity !== teacherIdentity);
            return res.json({ participants: participants });
        } else {
            return res.status(400).json({ error: 'Invalid action or missing participantIdentityToAffect.' });
        }
    } catch (error) {
        console.error('Error performing teacher action:', error);
        // Provide more specific error info if possible, e.g., if room not found
        // Check the error code for a more reliable way to detect a non-existent room
        if (error.code === 'not_found') {
            // If the room doesn't exist, it has no participants. Return an empty list.
            if (action === 'listParticipants') {
                return res.json({ participants: [] });
            }
            return res.status(404).json({ error: 'Room not found or no active participants yet.' });
        }
        return res.status(500).json({ error: 'Failed to perform action.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Node.js backend listening on http://localhost:${port}`);
    
    // More detailed check for environment variables
    const apiKey = process.env.LIVEKIT_API_KEY || '';
    const apiSecret = process.env.LIVEKIT_API_SECRET || '';

    if (apiKey) {
        console.log(`API Key Loaded. Starts with: ${apiKey.substring(0, 4)}...`);
    } else {
        console.error('ERROR: LIVEKIT_API_KEY is MISSING or empty in .env file!');
    }

    if (apiSecret) {
        console.log('API Secret is Loaded.');
    } else {
        console.error('ERROR: LIVEKIT_API_SECRET is MISSING or empty in .env file!');
    }
});
