const express = require('express');
const router = express.Router();
const ConversationController = require('../controllers/conversation.controller');

// Create a conversation
router.post('/', ConversationController.createConversation);

// Get the message of a conversation
router.get('/:conversationId/messages', ConversationController.getConversationMessages);

module.exports = router;
