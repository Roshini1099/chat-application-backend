const User = require('../models/user');
const Chat = require('../models/chat');

const findByEmail = async (email) => {
    const user = await User.findOne({ emailId: email }).populate('channels.chatId',{createdAt: 0, participants:0}).populate('directMessage.chatId',{createdAt: 0, participants:0}).populate('directMessage.receiverId',{password: 0, directMessage: 0, channels: 0}).exec();
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

const updateDirectMessage = async (chatId, userId, receiverId) => {
    const user = await User.findByIdAndUpdate(userId, { $push: { directMessage: { chatId, receiverId } } });
    const receiver = await User.findByIdAndUpdate(receiverId, { $push: { directMessage: { chatId, receiverId:userId } } });
    return user;
};

const updateChannel = async (chatId, userId) => {
    const user = await User.findByIdAndUpdate(userId, { $push: { channels: { chatId } } });
    return user;
};

const message = async (text, senderId, chatId, type, index, senderName) => {
    
    if (type === "Create") {
        const messageLength = await Chat.findOne({ _id: chatId });
        let chat = await Chat.findByIdAndUpdate(chatId,
            {
                $push:
                {
                    messages:
                    {
                        senderId,
                        senderName,
                        text,
                        index: messageLength.messages.length,
                        seen: false,
                        delete: false,
                        delivered: true,
                        timestamp: Date.now()
                    }
                }
                
            },{new: true},);
            return chat;
    }
    else if (type === "Edit") {
        let array = "messages." + index;
       let chat = await Chat.findOneAndUpdate(
            { _id: chatId },
            {
                $set: {
                    [`${array + ".text"}`]: text,
                    [`${array + ".seen"}`]: false,
                    [`${array + ".delete"}`]: false,
                    [`${array + ".delivered"}`]: true,
                    [`${array + ".timestamp"}`]: Date.now(),
                },
               
            },
            {new: true},
        );
        return chat;

    }
    else if (type === "Delete") {
        let array = "messages." + index;
        let chat = await Chat.findOneAndUpdate(
            { _id: chatId },
            {
                $set: {
                    [`${array + ".text"}`]: text,
                    [`${array + ".seen"}`]: false,
                    [`${array + ".delete"}`]: true,
                    [`${array + ".delivered"}`]: true,
                    [`${array + ".timestamp"}`]: Date.now(),
                },
            },
            {new: true},
        );
        return chat;
    }

}

const getNewChats = async (chatId, timestamp) => {
    let arr = [];
    const chat = await Chat.findOne({ _id: chatId });
    for (var k = 0; k < chat.messages.length; k++) {
        if (chat.messages[k].timestamp >= timestamp) {
            arr.push(chat.messages[k]);
        }
    }
    return arr;
};

const getCurrentChats = async (chatId) => {
    const chat = await Chat.findOne({ _id: chatId });
    return chat;
};

const updateDeliveredAndseen = async(type,chatId,index)=>{
    let array = "messages." + index+'.'+type;
    let chat = await Chat.findOneAndUpdate({_id:chatId},{$set:{
        [`${array}`]: true
    }})
}

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
exports.getCurrentChats = getCurrentChats;
exports.getNewChats = getNewChats;
exports.updateDeliveredAndseen= updateDeliveredAndseen;
