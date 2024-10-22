const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

exports.sendMessage = async (req, res) => {
    const { conversationId, sender, content } = req.body;

    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        if (!conversation.participants.includes(sender)) {
            return res.status(403).json({ error: 'User is not a participant in this conversation' });
        }

        const message = new Message({
            conversationId,
            sender,
            content
        });

        await message.save();

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
