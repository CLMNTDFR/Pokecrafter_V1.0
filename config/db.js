// Establishes a connection to the MongoDB database using Mongoose with credentials from environment variables.
const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USER_PASS}@pokecrafter.llrx5.mongodb.net/`;

mongoose
    .connect(uri)
