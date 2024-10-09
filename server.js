const express = require('express');
const conversationRoutes = require('./routes/conversation.routes');
const messageRoutes = require('./routes/message.routes');
const userRoutes = require('./routes/user.routes');
const artworkRoutes = require('./routes/artwork.routes');
const contestRoutes = require('./routes/contest.routes');
const artworkContestRoutes = require('./routes/artwork.contest.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const { checkUser, requireAuth } = require('./middleware/auth.middleware');

// Assurez-vous d'importer vos modèles Conversation et Message
const Conversation = require('./models/conversation.model'); // Ajustez le chemin si nécessaire
const Message = require('./models/message.model'); // Ajustez le chemin si nécessaire

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Ajustez si nécessaire
        methods: ["GET", "POST"]
    }
});

// Configuration de CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Middleware pour vérifier l'utilisateur
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/artwork', artworkRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/artwork-contest', artworkContestRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
    console.log('Nouvel utilisateur connecté:', socket.id);

    // Rejoindre une conversation
    socket.on('joinConversation', async (conversationId) => {
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
            socket.join(conversationId);
            console.log(`Utilisateur avec l'ID ${socket.id} a rejoint la conversation ${conversationId}`);
        } else {
            console.log(`Conversation ${conversationId} non trouvée.`);
        }
    });

    // Envoyer un message
    socket.on('sendMessage', async (messageData) => {
        const { conversationId, sender, content } = messageData;

        try {
            const conversation = await Conversation.findById(conversationId);
            console.log('Conversation:', conversation);
            console.log('Sender:', sender);
            console.log('Participants:', conversation ? conversation.participants : 'Aucune conversation trouvée');

            if (conversation && conversation.participants.includes(sender)) {
                const message = new Message({
                    conversationId,
                    sender,
                    content
                });

                await message.save();

                io.to(conversationId).emit('receiveMessage', {
                    sender,
                    content,
                    createdAt: new Date()
                });
            } else {
                console.log(`L'utilisateur ${sender} n'est pas autorisé à envoyer un message dans la conversation ${conversationId}`);
                socket.emit('error', { message: 'Vous n\'êtes pas autorisé à envoyer un message dans cette conversation.' });
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            socket.emit('error', { message: 'Une erreur est survenue lors de l\'envoi du message.' });
        }
    });

    // Logs de déconnexion
    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté:', socket.id);
    });
});

// Lancement du serveur
server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

module.exports = app;