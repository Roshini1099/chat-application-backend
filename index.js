const express = require("express");
const initListeners = require('./socket/listener');
const bodyParser = require("body-parser");
const authRoute = require("./src/routes/authRoutes");
const userRoute = require("./src/routes/userRoutes");
const channelRoute = require("./src/routes/channelRoutes");
const InitiateMongoServer = require("./config");
const dotenv = require("dotenv");
var cors = require('cors')
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://amritb.github.io",
    methods: ["GET", "POST"]
  }
});
dotenv.config();
if (dotenv.error) throw new Error("Error in fetching .env file");

InitiateMongoServer();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/channel", channelRoute);

app.get("/*", (req, res, next) => {
  res.send({ msg: "page not found" });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).send(err.message);
});

initListeners(io);

var port = 3333;

server.listen(port, () => {
  console.log('Chat Application is listening on port ' + port);
});
