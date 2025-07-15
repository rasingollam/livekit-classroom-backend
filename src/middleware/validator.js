const env = require('../config/env');

/**
 * Validate token generation request
 */
const validateTokenRequest = (req, res, next) => {
  const { roomName, participantIdentity, participantName } = req.body;

  if (!env.livekitApiKey || !env.livekitApiSecret) {
    return res.status(500).json({ error: 'Server is not configured. Missing API key or secret.' });
  }

  if (!roomName || !participantIdentity || !participantName) {
    return res.status(400).json({ error: 'Room name, participant identity, and name are required.' });
  }

  next();
};

/**
 * Validate teacher action request
 */
const validateTeacherAction = (req, res, next) => {
  const { roomName, action, teacherIdentity, participantIdentityToAffect } = req.body;

  if (!roomName || !action || !teacherIdentity) {
    return res.status(400).json({ error: 'Room name, action, and teacher identity are required.' });
  }

  // Check if participantIdentityToAffect is needed for the requested action
  if (['muteParticipant', 'unmuteParticipant', 'removeParticipant'].includes(action) && 
      !participantIdentityToAffect) {
    return res.status(400).json({ error: 'Participant identity to affect is required for this action.' });
  }

  next();
};

module.exports = {
  validateTokenRequest,
  validateTeacherAction
};