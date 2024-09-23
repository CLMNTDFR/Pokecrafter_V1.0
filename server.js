const express = require('express');
const userRoutes = require('./routes/user.routes');
const artworkRoutes = require('./routes/artwork.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');  // Import du package cors
require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');

const app = express();

// Configuration de CORS
app.use(cors({
  origin: 'http://localhost:3000', // Autoriser seulement les requêtes depuis ton frontend
  credentials: true  // Si tu utilises des cookies ou des sessions
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

app.use('/api/user', userRoutes);
app.use('/api/artwork', artworkRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
