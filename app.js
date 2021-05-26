
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const fileUpload = require('express-fileupload');

require('dotenv').config();

const sanityCheckRouter = require('./routes/sanityCheck.router');

const authRouter = require('./routes/auth.router');
const moderatorRouter = require('./routes/moderator.router');
const roomRouter = require('./routes/room.router');
const userRouter = require('./routes/user.router');
const eventRouter = require('./routes/event.router');


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
app.use(cors());

app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
}));

// routes
app.use('/', sanityCheckRouter);
app.use('/api/auth', authRouter);
app.use('/api/moderator', moderatorRouter);
app.use('/api/room', roomRouter);
app.use('/api/user', userRouter);
app.use('/api/event', eventRouter);




const port = process.env.PORT || 8000;


// show all implemented endpoints
let showRoutes = 1;
if (showRoutes){
  let route, routes = [];
  app._router.stack.forEach(function(middleware){
    if(middleware.route){ // routes registered directly on the app
        routes.push(middleware.route);
    } else if(middleware.name === 'router'){ // router middleware 
        middleware.handle.stack.forEach(function(handler){
            route = handler.route;
            route && routes.push(route);
        });
    }
  });
  console.log(route);
  console.log(routes);
}


app.listen(port, () => {
  
  console.log(`App running on ${port}`);
});

