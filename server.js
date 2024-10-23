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

// Configuration of the messaging using socket.io
const Conversation = require('./models/conversation.model');
const Message = require('./models/message.model');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Middleware to check the user
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
});

app.use('/api/user', userRoutes);
app.use('/api/artwork', artworkRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/artwork-contest', artworkContestRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);

io.on('connection', (socket) => {
    // Join a conversation
    socket.on('joinConversation', async (conversationId) => {
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
            socket.join(conversationId);
        }
    });

    // Send a message
    socket.on('sendMessage', async (messageData) => {
        const { conversationId, sender, content } = messageData;

        try {
            const conversation = await Conversation.findById(conversationId);

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
                socket.emit('error', { message: 'You cannot send a message in this conversation' });
            }
        } catch (error) {
            socket.emit('error', { message: 'Error while sending the message' });
        }
    });

    socket.on('disconnect', () => {});
});

server.listen(process.env.PORT, () => {
});

module.exports = app;