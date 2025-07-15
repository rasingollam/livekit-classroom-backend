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


module.exports = {
  validateTokenRequest
};