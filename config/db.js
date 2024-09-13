const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USER_PASS}@pokecrafter.llrx5.mongodb.net/`;

mongoose
    .connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


