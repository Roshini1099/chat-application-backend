var jwt = require('jsonwebtoken');
const errorCodes = require('../utils/errorCodes');
const errors = require("../utils/errorUtil");

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
        return res.status(errorCodes.forbidden).send({
            message: 'No Token Provided'
        });
    }
    jwt.verify(token, process.env.jwtSecret, function (err, decoded) {
        if (err && err.name === 'TokenExpiredError') {
            return res.status(errorCodes.ok).send({
                auth: true,
                token: 'expired',
                message: 'Token Expired'
            });
        } else if (err) {
            return res.status(errorCodes.internal_server_error).send({
                message: 'Failed to authenticate token'
            });
        }
        req.token = {
            id: decoded.id
        };
        next();
    });
}

module.exports = verifyToken;