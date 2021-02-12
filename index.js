const express = require("express");
const dotenv = require("dotenv");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

dotenv.config();



io.use((socket, next) => {
//middleware
  next();
});

io.on("connection", (socket) => {
});

server.listen(3000);
