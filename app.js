
const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config();

const sanityCheckRouter = require('./routes/sanityCheck.router');

const authRouter = require('./routes/auth.router');
const moderatorRouter = require('./routes/moderator.router');



const app = express();
// console.log(process.env.MONGODB_URI)

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch(err=>{
        console.log(err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', sanityCheckRouter);
app.use('/api/auth', authRouter);
app.use('/api/moderator', moderatorRouter);



const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on ${port}`);
});