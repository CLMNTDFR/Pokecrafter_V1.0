const mongoose = require ("mongoose")

mongoose
    .connect('mongodb+srv://TM99:pa$$word@cluster0.uifxg.mongodb.net/',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }
        )
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.log("Failed to connect to MongoDB", err));
