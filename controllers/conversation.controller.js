const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

exports.createConversation = async (req, res) => {
    const { participants } = req.body;

    if (!participants || participants.length !== 2) {
        return res.status(400).json({ error: 'Deux participants sont requis pour créer une conversation.' });
    }

    try {
        // Vérifie si une conversation existe déjà entre les deux participants, peu importe l'ordre
        let conversation = await Conversation.findOne({
            participants: { $size: 2, $all: participants }
        });

        if (conversation) {
            return res.status(200).json(conversation); // La conversation existe déjà
        }

        // Si elle n'existe pas, créer une nouvelle conversation
        conversation = new Conversation({ participants });
        await conversation.save();

        return res.status(201).json(conversation);
    } catch (error) {
        return res.status(500).json({ error: 'Erreur lors de la création de la conversation.' });
    }
};

exports.getConversationMessages = async (req, res) => {
    const { conversationId } = req.params;

    if (!conversationId) {
        return res.status(400).json({ error: 'ID de conversation manquant.' });
    }

    try {
        // Récupère les messages associés à la conversation, triés par ordre croissant de date
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        if (!messages) {
            return res.status(404).json({ error: 'Aucun message trouvé pour cette conversation.' });
        }

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
    }
};
