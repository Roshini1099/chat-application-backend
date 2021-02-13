const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const URI = process.env.mongodbURI;

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;