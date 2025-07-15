const livekitService = require('../services/livekitService');

/**
 * Handle various teacher actions in a room
 */
const handleTeacherAction = async (req, res, next) => {
  try {
    const { roomName, participantIdentityToAffect, action, teacherIdentity } = req.body;

    switch (action) {
      case 'muteParticipant':
        await livekitService.muteParticipant(roomName, participantIdentityToAffect);
        return res.json({ message: `Participant ${participantIdentityToAffect} muted.` });
        
      case 'unmuteParticipant':
        await livekitService.unmuteParticipant(roomName, participantIdentityToAffect);
        return res.json({ message: `Participant ${participantIdentityToAffect} unmuted.` });
        
      case 'removeParticipant':
        await livekitService.removeParticipant(roomName, participantIdentityToAffect);
        return res.json({ message: `Participant ${participantIdentityToAffect} removed.` });
        
      case 'listParticipants':
        const allParticipants = await livekitService.listParticipants(roomName);
        // Filter out self if you don't want teacher to see themselves in list
        const participants = allParticipants.filter(p => p.identity !== teacherIdentity);
        return res.json({ participants });
        
      default:
        return res.status(400).json({ error: 'Invalid action.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleTeacherAction
};