const errors = require("../utils/errorUtil");

function validation(req, res, next) {
    if (req.originalUrl === '/api/auth/register') {
        const { userName, password, emailId } = req.body;
        if (!emailId || !password || !userName) {
            return next(errors.bad_request("Bad request"));
        }
    }
    else if (req.originalUrl === '/api/auth/login') {
        const { emailId, password } = req.body;
        if (!emailId || !password) {
            return next(errors.bad_request("Bad request"));
        }
    }
    next();
}

module.exports = validation;