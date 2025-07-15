const { RoomServiceClient } = require('livekit-server-sdk');
const env = require('./env');

// Initialize RoomServiceClient for server-side actions
const roomService = new RoomServiceClient(
  env.livekitUrl,
  env.livekitApiKey,
  env.livekitApiSecret
);

module.exports = {
  roomService
};