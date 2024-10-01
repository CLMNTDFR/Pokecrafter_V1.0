const express = require('express');
const userRoutes = require('./routes/user.routes');
const artworkRoutes = require('./routes/artwork.routes');
const contestRoutes = require('./routes/contest.routes');
const artworkContestRoutes = require('./routes/artwork.contest.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const fileUpload = require('express-fileupload');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// Configuration de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware pour le téléchargement de fichiers
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


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
