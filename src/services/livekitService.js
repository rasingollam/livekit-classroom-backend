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

/**
 * Mute a participant's audio
 */
const muteParticipant = async (roomName, participantIdentity) => {
  return roomService.mutePublishedTrack(roomName, participantIdentity, 'audio', true);
};

/**
 * Unmute a participant's audio
 */
const unmuteParticipant = async (roomName, participantIdentity) => {
  return roomService.mutePublishedTrack(roomName, participantIdentity, 'audio', false);
};

/**
 * Remove a participant from a room
 */
const removeParticipant = async (roomName, participantIdentity) => {
  return roomService.removeParticipant(roomName, participantIdentity);
};

/**
 * List all participants in a room
 */
const listParticipants = async (roomName) => {
  try {
    const roomInfo = await roomService.listParticipants(roomName);
    return roomInfo.participants;
  } catch (error) {
    if (error.code === 'not_found') {
      return [];
    }
    throw error;
  }
};

module.exports = {
  generateToken,
  muteParticipant,
  unmuteParticipant,
  removeParticipant,
  listParticipants
};