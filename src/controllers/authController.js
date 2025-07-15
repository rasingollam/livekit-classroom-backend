const livekitService = require('../services/livekitService');
const env = require('../config/env');

/**
 * Generate a LiveKit token for room access
 */
const getLivekitToken = async (req, res, next) => {
  try {
    const { roomName, participantIdentity, participantName, isTeacher } = req.body;

    const token = await livekitService.generateToken(
      roomName, 
      participantIdentity, 
      participantName, 
      isTeacher
    );

    console.log(`Generated token for ${participantName} (${participantIdentity}) to join room ${roomName}`);
    
    res.json({ 
      token, 
      url: env.livekitUrl 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLivekitToken
};