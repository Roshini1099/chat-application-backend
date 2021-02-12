const express = require("express");
const initListeners = require('./socket/listener')
const dotenv = require("dotenv");
var cors = require('cors')
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server,{
    cors: {
      origin: "https://amritb.github.io",
      methods: ["GET", "POST"]
    }
});
app.use(cors())

dotenv.config();
initListeners(io);

server.listen(3000,()=>{
    console.log('listening to port 3000')
});
