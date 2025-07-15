const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const roomRoutes = require('./roomRoutes');

router.use('/api', authRoutes);
router.use('/api', roomRoutes);

module.exports = router;