const express = require("express");
const bodyParser = require("body-parser");
const authRoute = require("./src/routes/authRoutes");
const dotenv = require("dotenv");
dotenv.config();
const InitiateMongoServer = require("./config");
InitiateMongoServer();
var cors = require('cors')
const app = express();
app.use(cors())
if (dotenv.error) throw new Error("Error in fetching .env file");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);

app.get("/*", (req, res, next) => {
  res.send({ msg: "page not found" });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).send(err);
});

const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.use((socket, next) => {
  //middleware
    next();
  });
  
  io.on("connection", (socket) => {
  });
  
var port = 3333;

server.listen(port, () => {
  console.log('Chat Application is listening on port ' + port);
});
