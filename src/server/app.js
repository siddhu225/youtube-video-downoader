const express = require('express');
require('./db/mongoose')
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const videoRouter = require('./controllers/video');
const { config } = require('dotenv');
config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(videoRouter);

const server = http.createServer(app);
const io = socketio(server);
io.on('connection', () => {
  console.log('socket connected!');
});
global.io = io;

server.listen(8081, () => {
  console.log("Server running up 8081");
});