const express = require('express');
const router = express.Router();
const ConversationController = require('../controllers/conversation.controller');

// Route pour créer une conversation
router.post('/', ConversationController.createConversation);

// Route pour récupérer les messages d'une conversation
router.get('/:conversationId/messages', ConversationController.getConversationMessages);

module.exports = router;
