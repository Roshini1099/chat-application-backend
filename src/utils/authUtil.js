const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const hashPassword = async (password) => {
    let hashedPassword;
    hashedPassword = await bcrypt.hashSync(password, 10);
    return hashedPassword;
};

const checkPassword = async (password, existingPassword) => {
    return await bcrypt.compareSync(password, existingPassword);
};

const createToken = (userId, emailId) => {
    let token;
    token = jwt.sign(
        {
            userId,
            emailId,
        },
        process.env.jwtSecret
        , {
            expiresIn: 86400000 * 15 // 15 days
        },
    );
    return token;
};

exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;
exports.createToken = createToken;
