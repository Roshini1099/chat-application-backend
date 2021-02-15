const errors = require("../utils/errorUtil");
const { createNewChat, findByChatName, joinNewChat } = require('../utils/dbUtil');
const errorCodes = require('../utils/errorCodes');

exports.newChannel = async (req, res, next) => {
    const { chatName, userId, type } = req.body;
    let createdChannel, existingChatName;
    existingChatName = await findByChatName(chatName);
    if (existingChatName) {
        next(errors.conflict("Channel already exists!!"));
    } else {
        try {
            createdChannel = await createNewChat(chatName, userId, type);
            await createdChannel.save();
            res.status(errorCodes.ok).send(createdChannel);
        } catch (err) {
            next(errors.internal_server_error("Internal server error"));
        }
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

// exports.message = async (req, res, next) => {
//     const { text, senderId, messageType, receiverId } = req.body;
//     let existingChatName;
//     try {
//         existingChatName = await findByChatName(searchKeys);
//         if (existingChatName) {
//             res.status(errorCodes.ok).send(existingChatName);
//         } else {
//             next(errors.not_found("Channel not found!!"));
//         }
//     } catch (err) {
//         next(errors.internal_server_error("Internal server error"));
//     }
// };