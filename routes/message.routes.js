const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/message.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Route pour envoyer un message
router.post('/', requireAuth, MessageController.sendMessage);

module.exports = router;