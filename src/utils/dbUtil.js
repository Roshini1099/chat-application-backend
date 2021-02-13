const User = require('../models/user');

const findByEmail = async (email) => {
    const user = await User.findOne({ emailId: email });
    return user;
};

const createNewUser = async (emailId, password, userName) => {
    let user;
    user = await new User({
        emailId,
        password,
        userName
    });
    return user;
};
exports.findByEmail = findByEmail;
exports.createNewUser = createNewUser;