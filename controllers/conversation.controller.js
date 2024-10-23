const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

// Create a new conversation between two participants
exports.createConversation = async (req, res) => {
    const { participants } = req.body;

    // Check if participants are provided and ensure there are exactly two participants
    if (!participants || participants.length !== 2) {
        return res.status(400).json({ error: 'Two participants are required to create a conversation.' });
    }

    try {
        // Check if a conversation between these two participants already exists
        let conversation = await Conversation.findOne({
            participants: { $size: 2, $all: participants }
        });

        // If the conversation exists, return it
        if (conversation) {
            return res.status(200).json(conversation);
        }

        // If no conversation exists, create a new one
        conversation = new Conversation({ participants });
        await conversation.save(); // Save the new conversation

        return res.status(201).json(conversation);
    } catch (error) {
        return res.status(500).json({ error: 'Error during the creation of the conversation' });
    }
};

// Retrieve all messages from a specific conversation
exports.getConversationMessages = async (req, res) => {
    const { conversationId } = req.params;

    // Check if the conversation ID is provided
    if (!conversationId) {
        return res.status(400).json({ error: 'ID of the conversation is missing' });
    }

    try {
        // Fetch all messages associated with the conversation, sorted by creation date
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        // If no messages are found, return a 404 response
        if (!messages) {
            return res.status(404).json({ error: 'No messages found for this conversation' });
        }

        return res.status(200).json(messages); // Return the messages
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving messages.' });
    }
};

// Retrieve all conversations for a specific user
exports.getUserConversations = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find all conversations where the user is a participant
        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        });

        // If no conversations are found, return a 404 response
        if (!conversations || conversations.length === 0) {
            return res.status(404).json({ error: 'No conversations found' });
        }

        return res.status(200).json(conversations); // Return the conversations
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching conversations' });
    }
};
