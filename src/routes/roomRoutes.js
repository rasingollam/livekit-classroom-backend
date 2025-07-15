const express = require('express');
const router = express.Router();
const { handleTeacherAction } = require('../controllers/roomController');
const { validateTeacherAction } = require('../middleware/validator');

router.post('/teacher-action', validateTeacherAction, handleTeacherAction);

module.exports = router;