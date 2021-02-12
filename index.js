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


var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Chat application API is listening on port " + port);
});

