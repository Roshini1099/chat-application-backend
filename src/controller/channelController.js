const errors = require("../utils/errorUtil");
const { createNewChat, findByChatName, joinNewChat, findByUserId, updateDirectMessage, message, updateChannel, getNewChats, getCurrentChats, updateDeliveredAndseen } = require('../utils/dbUtil');
const errorCodes = require('../utils/errorCodes');
const User = require('../models/user');
const Chat = require('../models/chat');

exports.newChannel = async (req, res, next) => {
    const { chatName, userId, type, receiverId } = req.body;
    let createdChannel, existingChatName, directMessage, channel;
    try {
        if (type === "directMessage") {
            receiverDetails = await findByUserId(receiverId);
            let chatName = receiverDetails.userName;
                createdChannel = await createNewChat(chatName, userId, type, receiverId);
                directMessage = await updateDirectMessage(createdChannel._id, userId, receiverId);
                await createdChannel.save();
                res.status(errorCodes.ok).send(createdChannel);
        }
        else {
            existingChatName = await findByChatName(chatName);
            if (existingChatName) {
                next(errors.conflict("Channel already exists!!"));
            } else {
                createdChannel = await createNewChat(chatName, userId, type, receiverId);
                await createdChannel.save();
                channel = await updateChannel(createdChannel._id, userId);
                res.status(errorCodes.ok).send(createdChannel);
            }
        }
    } catch (err) {
        next(errors.internal_server_error("Internal server error"));
    }
};

exports.joinChannel = async (req, res, next) => {
    const { chatId, userId } = req.body;
    let joinedChannel;
    try {
        joinedChannel = await joinNewChat(chatId, userId);
        res.status(errorCodes.ok).send({ "message": "Joined chat successfully" });
    }
    catch (err) {
        next(errors.internal_server_error("Internal server error"));
    }
};

exports.searchChannel = async (req, res, next) => {
    const { searchKeys } = req.body;
    let existingChatName;
    try {
        existingChatName = await findByChatName(searchKeys);
        if (existingChatName) {
            res.status(errorCodes.ok).send(existingChatName);
        } else {
            next(errors.not_found("Channel not found!!"));
        }
    } catch (err) {
        next(errors.internal_server_error("Internal server error"));
    }
};

exports.message = async (req, res, next) => {
    const { text, senderId, chatId, type, index, senderName } = req.body;
    let messages, senderDetails;
    try {
        messages = await message(text, senderId, chatId, type, index,senderName);
        if (messages) {
            res.status(errorCodes.ok).send(messages);
        } else {
            next(errors.not_found("Messages cannot be updated!!"));
        }
    } catch (err) {
        next(errors.internal_server_error("Internal server error"));
    }
}



exports.getChat = async (req, res, next) => {
    const { chatId} = req.body;
    let chats;
    try {
        chats = await getCurrentChats(chatId);
        if (chats) {
            res.status(errorCodes.ok).send(chats);
        } else {
            next(errors.not_found("Messages cannot be fetched!!"));
        }
    } catch (err) {
        next(errors.internal_server_error("Internal server error"));
    }
}

exports.getCurrentChat = async (req, res, next) => {
    const { chatId } = req.body;
    let chats;
    try {
        chats = await getCurrentChats(chatId);
        if (chats) {
            res.status(errorCodes.ok).send(chats);
        } else {
            next(errors.not_found("Messages cannot be fetched!!"));
        }
    } catch (err) {
        next(errors.internal_server_error("Internal server error"));
    }
}

exports.chats = async (req, res, next) => {
    const { chatId, type, userId } = req.body;
    let chats;
    // try {
        console.log('inside update status controller')
        chats = await updateDeliveredAndseen(chatId, type, userId);
        if (chats) {
            res.status(errorCodes.ok).send(chats);
        } 
        // else {
        //     next(errors.not_found("Messages cannot be fetched!!"));
        // }
    // } catch (err) {
    //     next(errors.internal_server_error("Internal server error"));
    // }
}
exports.addFile =()=>{
    
}
// exports.getCurrentChat = async (req, res, next) => {
//     const { chatId } = req.body;
//     let chats;
//     try {
//         chats = await getCurrentChats(chatId);
//         if (chats) {
//             res.status(errorCodes.ok).send(chats);
//         } else {
//             next(errors.not_found("Messages cannot be fetched!!"));
//         }
//     } catch (err) {
//         next(errors.internal_server_error("Internal server error"));
//     }
// }
