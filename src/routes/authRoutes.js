const express = require('express');
const router = express.Router();
const { getLivekitToken } = require('../controllers/authController');
const { validateTokenRequest } = require('../middleware/validator');

router.post('/get-livekit-token', validateTokenRequest, getLivekitToken);

module.exports = router;