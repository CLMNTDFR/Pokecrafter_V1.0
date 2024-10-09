const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

exports.sendMessage = async (req, res) => {
    const { conversationId, sender, content } = req.body;

    try {
        // Vérifie si la conversation existe
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // Vérifie si l'utilisateur est un participant de la conversation
        if (!conversation.participants.includes(sender)) {
            return res.status(403).json({ error: 'User is not a participant in this conversation' });
        }

        // Crée et enregistre le message
        const message = new Message({
            conversationId,
            sender,
            content
        });

        await message.save();

        // Répond avec le message créé
        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};