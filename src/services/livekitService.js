const { AccessToken } = require('livekit-server-sdk');
const { roomService } = require('../config/livekit');
const env = require('../config/env');

/**
 * Generate a LiveKit access token
 */
const generateToken = async (roomName, participantIdentity, participantName, isTeacher) => {
  // Create an AccessToken object for the participant
  const at = new AccessToken(env.livekitApiKey, env.livekitApiSecret, {
    identity: participantIdentity, 
    name: participantName,
    ttl: 3600,  // Token expires in 1 hour
  });

  // Grant permissions for this participant in the specified room
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: isTeacher,
    canMute: isTeacher,
    canWhisper: true,
  });

  return at.toJwt();
};


module.exports = {
  generateToken
};