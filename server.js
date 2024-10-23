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

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins for CORS
        methods: ["GET", "POST"]
    }
});

// CORS configuration to allow requests from the frontend
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
}));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Middleware to check the user authentication
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id); // Send user ID if authenticated
});

// Route configurations
app.use('/api/user', userRoutes);
app.use('/api/artwork', artworkRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/artwork-contest', artworkContestRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
    // Join a specific conversation room
    socket.on('joinConversation', async (conversationId) => {
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
            socket.join(conversationId); // Join the conversation room
        }
    });

    // Handle sending a message
    socket.on('sendMessage', async (messageData) => {
        const { conversationId, sender, content } = messageData;

        try {
            const conversation = await Conversation.findById(conversationId);

            // Ensure the sender is a participant in the conversation
            if (conversation && conversation.participants.includes(sender)) {
                const message = new Message({
                    conversationId,
                    sender,
                    content
                });

                await message.save(); // Save the message to the database

                // Emit the message to the conversation room
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

    socket.on('disconnect', () => {
        // Handle user disconnection
    });
});

// Start the server
server.listen(process.env.PORT, () => {
});

module.exports = app;
