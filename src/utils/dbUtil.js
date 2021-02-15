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

const createNewChat = async (chatName, senderId, type, receiverId) => {
    let chat;
    if (type === "channel") {
        chat = await new Chat({
            chatName,
            participants: senderId,
            type
        });
    }
    else {
        chat = await new Chat({
            chatName,
            type,
            participants: { senderId, receiverId },
        });
    }
    return chat;

};

const joinNewChat = async (chatId, userId) => {
    const chat = await Chat.findByIdAndUpdate(chatId, { $push: { participants: userId } });
    return chat;
};

const updateDirectMessage = async (chatName, userId, receiverId) => {
    const user = await User.findByIdAndUpdate(userId, { $push: { directMessage: { chatName, receiverId } } });
    return user;
};

const updateChannel = async (chatName, userId) => {
    const user = await User.findByIdAndUpdate(userId, { $push: { channels: { chatName } } });
    return user;
};

const message = async (text, senderId, chatName, type, index) => {
    let chat;
    if (type === "Create") {
        const messageLength = await Chat.findOne({ chatName: chatName });
        chat = await Chat.findOneAndUpdate(chatName,
            {
                $push:
                {
                    messages:
                    {
                        senderId,
                        text,
                        index: messageLength.messages.length,
                        seen: false,
                        delete: false,
                        delivered: true,
                        timestamp: Date.now()
                    }
                }
            });
    }
    else if (type === "Edit") {
        let array = "messages." + index;
        chat = await Chat.findOneAndUpdate(
            { chatName: chatName },
            {
                $set: {
                    [`${array + ".text"}`]: text,
                    [`${array + ".seen"}`]: false,
                    [`${array + ".delete"}`]: false,
                    [`${array + ".delivered"}`]: true,
                    [`${array + ".timestamp"}`]: Date.now(),
                },
            }
        );

    }
    else if (type === "Delete") {
        let array = "messages." + index;
        chat = await Chat.findOneAndUpdate(
            { chatName: chatName },
            {
                $set: {
                    [`${array + ".text"}`]: text,
                    [`${array + ".seen"}`]: false,
                    [`${array + ".delete"}`]: true,
                    [`${array + ".delivered"}`]: true,
                    [`${array + ".timestamp"}`]: Date.now(),
                },
            }
        );
    }
    return chat;
}

const getNewChats = async (chatName, timestamp) => {
    let arr = [];
    const chat = await Chat.findOne({ chatName: chatName });
    for (var k = 0; k < chat.messages.length; k++) {
        if (chat.messages[k].timestamp >= timestamp) {
            arr.push(chat.messages[k]);
        }
    }


    return arr;
};

exports.createNewChat = createNewChat;
exports.findByEmail = findByEmail;
exports.findByUserId = findByUserId;
exports.findByUserIdAndUpdate = findByUserIdAndUpdate;
exports.findByChatName = findByChatName;
exports.createNewUser = createNewUser;
exports.joinNewChat = joinNewChat;
exports.updateDirectMessage = updateDirectMessage;
exports.updateChannel = updateChannel;
exports.message = message;
exports.getNewChats = getNewChats;
