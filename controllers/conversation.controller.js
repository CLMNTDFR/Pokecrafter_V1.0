const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

exports.createConversation = async (req, res) => {
    const { participants } = req.body;

    if (!participants || participants.length !== 2) {
        return res.status(400).json({ error: 'Two participants are required to create a conversation.' });
    }

    try {
        let conversation = await Conversation.findOne({
            participants: { $size: 2, $all: participants }
        });

        if (conversation) {
            return res.status(200).json(conversation); //The conversation already exists.
        }

        conversation = new Conversation({ participants });
        await conversation.save();

        return res.status(201).json(conversation);
    } catch (error) {
        return res.status(500).json({ error: 'Error during the creation of the conversation' });
    }
};

exports.getConversationMessages = async (req, res) => {
    const { conversationId } = req.params;

    if (!conversationId) {
        return res.status(400).json({ error: 'ID of the conversation is missing' });
    }

    try {
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        if (!messages) {
            return res.status(404).json({ error: 'No messages found for this conversation' });
        }

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving messages.' });
    }
};

exports.getUserConversations = async (req, res) => {
    const userId = req.params.userId;

    try {
        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        });

        if (!conversations || conversations.length === 0) {
            return res.status(404).json({ error: 'No conversations found' });
        }

        return res.status(200).json(conversations);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching conversations' });
    }
};
