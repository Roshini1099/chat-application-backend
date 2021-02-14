const errors = require("../utils/errorUtil");
const { findByUserId, findByUserIdAndUpdate } = require('../utils/dbUtil');
const errorCodes = require('../utils/errorCodes');

exports.details = async (req, res, next) => {
    const { userId } = req.body;
    let existingUser;
    try {
        existingUser = await findByUserId(userId);
        if (existingUser) {
            res.status(errorCodes.ok).send(existingUser);
        } else {
            next(errors.not_found("User not found!!"));
        }
    } catch (err) {
        next(errors.internal_server_error("Internal server error"));
    }
};

exports.edit = async (req, res, next) => {
    const { userId, userName, status, profileImage, phoneNumber } = req.body;
    let existingUser;
    try {
        existingUser = await findByUserIdAndUpdate(userId, userName, status, profileImage, phoneNumber);
        if (existingUser) {
            res.status(errorCodes.ok).send({ "message": "Profile updated sucesfully" });
        } else {
            next(errors.unauthorised("Unauthorized request!!"));
        }
    } catch (err) {
        next(errors.internal_server_error("Internal server error"));
    }
};
