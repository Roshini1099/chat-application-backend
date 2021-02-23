const { format } = require("morgan");
const winston = require("winston");

const logger = winston.createLogger({
    level: "info",
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: "./error.log",
        level: "error",
      }),
      new winston.transports.File({
        filename: "./debug.log",
        level: "debug",

      }),
      new winston.transports.File({
        filename: "./server.log",
        level: "verbose",
        json:true

      }),
      new winston.transports.File({ 
          filename: "./server.log",
          format: winston.format.combine(winston.format.timestamp(),winston.format.simple())
    })
    ]
  });

  module.exports = logger;