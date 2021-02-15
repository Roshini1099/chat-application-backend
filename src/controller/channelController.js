const errors = require("../utils/errorUtil");
const { createNewChat, findByChatName, joinNewChat, findByUserId, updateDirectMessage, message, updateChannel, getNewChats } = require('../utils/dbUtil');
const errorCodes = require('../utils/errorCodes');
const User = require('../models/user');
const Chat = require('../models/chat');

exports.newChannel = async (req, res, next) => {
    const { chatName, userId, type, receiverId } = req.body;
    let createdChannel, existingChatName, directMessage, channel;
    try {
        if (type === "directMessage") {
            senderDetails = await findByUserId(userId);
            receiverDetails = await findByUserId(receiverId);
            let chatName = senderDetails.emailId.concat(receiverDetails.emailId);
            existingChatName = await findByChatName(chatName);
            if (existingChatName) {
                next(errors.conflict("Direct Message already exists!!"));
            } else {
                createdChannel = await createNewChat(chatName, userId, type, receiverId);
                await createdChannel.save();
                directMessage = await updateDirectMessage(chatName, userId, receiverId);
                res.status(errorCodes.ok).send(createdChannel);
            }
        }
        else {
            existingChatName = await findByChatName(chatName);
            if (existingChatName) {
                next(errors.conflict("Channel already exists!!"));
            } else {
                createdChannel = await createNewChat(chatName, userId, type, receiverId);
                await createdChannel.save();
                channel = await updateChannel(chatName, userId);
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
    const { text, senderId, chatName, type, index } = req.body;
    let messages;
    try {
        messages = await message(text, senderId, chatName, type, index);
        if (messages) {
            res.status(errorCodes.ok).send({ "message": "message posted sucesfully" });
        } else {
            next(errors.not_found("Messages cannot be updated!!"));
        }
    } catch (err) {
        next(errors.internal_server_error("Internal server error"));
    }
}

exports.getChat = async (req, res, next) => {
    const { chatName, timestamp } = req.body;
    let chats;
    try {
        chats = await getNewChats(chatName, timestamp);
        if (chats) {
            res.status(errorCodes.ok).send(chats);
        } else {
            next(errors.not_found("Messages cannot be fetched!!"));
        }
    } catch (err) {
        next(errors.internal_server_error("Internal server error"));
    }
}