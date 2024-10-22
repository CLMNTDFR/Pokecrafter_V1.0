const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

exports.createConversation = async (req, res) => {
    const { participants } = req.body;

    if (!participants || participants.length !== 2) {
        return res.status(400).json({ error: 'Two participants are required to create a conversation.' });
    }

    try {
        // Check if a conversation exists between 2 users
        let conversation = await Conversation.findOne({
            participants: { $size: 2, $all: participants }
        });

        if (conversation) {
            return res.status(200).json(conversation);
        }

        conversation = new Conversation({ participants });
        await conversation.save();

        return res.status(201).json(conversation);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating conversation.' });
    }
};

exports.getConversationMessages = async (req, res) => {
    const { conversationId } = req.params;

    if (!conversationId) {
        return res.status(400).json({ error: 'Conversation ID missing.' });
    }

    try {
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        if (!messages) {
            return res.status(404).json({ error: 'No messages found for this conversation.' });
        }

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving messages.' });
    }
};
