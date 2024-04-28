const express = require('express');
require('./database/connection');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { distanceBetweenPoints } = require('./utils/utils');
const { sendDeviceLocationUpdateNotification } = require('./notifications/notification'); // Correct the path here

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:19006', // Your React Native app's origin
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

app.use(bodyParser.json());


// Mount the user router
const userRouter = require('./routes/user');
app.use('/user', userRouter);

// Mount the location router
const locationRouter = require('./routes/location');
app.use('/location', locationRouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
