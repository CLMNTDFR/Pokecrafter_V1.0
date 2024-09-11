const express = require('express');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const app = express();


app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
