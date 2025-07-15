const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const roomRoutes = require('./roomRoutes');

router.use('/api/classroom', authRoutes);
router.use('/api/classroom', roomRoutes);

module.exports = router;