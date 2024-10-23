const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

exports.sendMessage = async (req, res) => {
    const { conversationId, sender, content } = req.body;

    try {
        // Verify if the conversation exists
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' }); // Return error if conversation doesn't exist
        }

        // Ensure the sender is part of the conversation
        if (!conversation.participants.includes(sender)) {
            return res.status(403).json({ error: 'User is not a participant in this conversation' }); // Restrict access if sender is not a participant
        }

        // Create a new message instance
        const message = new Message({
            conversationId,
            sender,
            content
        });

        await message.save(); // Save the new message in the database

        res.status(201).json(message); // Send back the created message
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' }); // Handle any unexpected server errors
    }
};
