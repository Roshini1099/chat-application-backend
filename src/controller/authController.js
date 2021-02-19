const errors = require("../utils/errorUtil");
const { findByEmail, createNewUser, findByUserId } = require('../utils/dbUtil');
const { hashPassword, checkPassword, createToken } = require('../utils/authUtil');
const errorCodes = require('../utils/errorCodes');

exports.register = async (req, res, next) => {
  const { userName, emailId, password } = req.body;
  let existingUser, hashedPassword, createdUser;
  existingUser = await findByEmail(emailId);
  if (existingUser) {
    next(errors.conflict("User already exists!!"));
  } else {
    try {
      hashedPassword = await hashPassword(password);
      createdUser = await createNewUser(emailId, hashedPassword, userName);
      await createdUser.save();
      res.status(errorCodes.ok).send({ "Message": "User registered successfully" });
    } catch (err) {
      next(errors.internal_server_error("Internal server error"));
    }
  }
};

exports.login = async (req, res, next) => {
  const { emailId, password } = req.body;
  let existingUser, isValidPassword, token;
  try {
    existingUser = await findByEmail(emailId);
    if (!existingUser) {
      next(errors.not_found("No user found"));
    }
    isValidPassword = await checkPassword(password, existingUser.password);
    if (!isValidPassword) {
      next(errors.unauthorised("Incorrect credentials"));
    }
    token = await createToken(existingUser._id, existingUser.emailId);
    res.status(errorCodes.ok).send({ user: existingUser, token: token });
  } catch (err) {
    next(errors.internal_server_error("Internal server error"));
  }
};
