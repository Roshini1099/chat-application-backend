const User = require('../models/user');
const Chat = require('../models/chat');

const findByEmail = async (email) => {
    const user = await User.findOne({ emailId: email });
    return user;
};

const findByUserId = async (userId) => {
    const user = await User.findById(userId);
    return user;
};

const findByChatName = async (chatName) => {
    const chat = await Chat.findOne({ chatName });
    return chat;
};
const findByUserIdAndUpdate = async (userId, userName, status, profileImage, phoneNumber) => {
    const user = await User.findByIdAndUpdate(userId, {
        $set: {
            userName,
            phoneNumber,
            profileImage,
            status
        }
    });
    return user;
}

const createNewUser = async (emailId, password, userName) => {
    let user;
    user = await new User({
        emailId,
        password,
        userName
    });
    return user;
};

const createNewChat = async (chatName, userId, type) => {
    let chat;
    chat = await new Chat({
        chatName,
        participants: userId,
        type
    });
    return chat;
};

const joinNewChat = async (chatId, userId) => {
    const chat = await Chat.findByIdAndUpdate(chatId, { $push: { participants: userId } });
    return chat;
};

exports.createNewChat = createNewChat;
exports.findByEmail = findByEmail;
exports.findByUserId = findByUserId;
exports.findByUserIdAndUpdate = findByUserIdAndUpdate;
exports.findByChatName = findByChatName;
exports.createNewUser = createNewUser;
exports.joinNewChat = joinNewChat;
