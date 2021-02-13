var jwt = require('jsonwebtoken');
const errorCodes = require('../utils/errorCodes');
const errors = require("../utils/errorUtil");

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
        next(errors.forbidden("No token provided"));
    }
    jwt.verify(token, process.env.jwtSecret, function (err, decoded) {
        if (err && err.name === 'TokenExpiredError') {
            return res.status(errorCodes.ok).send({
                auth: true,
                token: 'expired',
                message: 'Token Expired'
            });
        } else if (err) {
            console.log('Failed to authenticate token', err);
            return  next(errors.internal_server_error("Failed to authenticate token"));
        }
        req.token = {
            id: decoded.id
        };
        next();
    });
}

module.exports = verifyToken;