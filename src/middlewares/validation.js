const errors = require("../utils/errorUtil");

const isValidPhoneNumber = (phoneNumber) => {
    const regEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return regEx.test(phoneNumber);
  };

 const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validation(req, res, next) {
    if (req.originalUrl === '/api/auth/register') {
        const { userName, password, emailId } = req.body;
        if (!validateEmail(emailId) || !password || !userName) {
            return next(errors.bad_request("Bad request"));
        }
    }
    else if (req.originalUrl === '/api/auth/login') {
        const { emailId, password } = req.body;
        if (!validateEmail(emailId) || !password) {
            return next(errors.bad_request("Bad request"));
        }
    }
    else if (req.originalUrl === '/api/channel/newChannel') {
        const { userId, type } = req.body;
        if (!userId || !type) {
            return next(errors.bad_request("Bad request"));
        }
    }
    else if (req.originalUrl === '/api/channel/joinChannel') {
        const { chatName, userId } = req.body;
        if (!chatName || !userId) {
            return next(errors.bad_request("Bad request"));
        }
    }
    else if (req.originalUrl === '/api/channel/search') {
        const { searchKeys } = req.body;
        if (!searchKeys) {
            return next(errors.bad_request("Bad request"));
        }
    }
    else if (req.originalUrl === '/api/user/details') {
        const { userId } = req.body;
        console.log(userId)
        if (!userId) {
            return next(errors.bad_request("Bad request"));
        }
    }
    else if (req.originalUrl === '/api/user/edit') {
        const { userId, userName, status, profileImage, phoneNumber } = req.body;
        if (!userId || !userName || !status || !profileImage || !isValidPhoneNumber(phoneNumber)) {
            return next(errors.bad_request("Bad request"));
        }
    }
    
    next();
}

module.exports = validation;