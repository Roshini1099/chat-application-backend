const errors = require("../utils/errorUtil");
const { createNewChat, findByChatName, joinNewChat,findByUserEmail, findByUserId, updateDirectMessage, message, updateChannel, getNewChats, getCurrentChats, updateDeliveredAndseen } = require('../utils/dbUtil');
const errorCodes = require('../utils/errorCodes');
const User = require('../models/user');
const Chat = require('../models/chat');
const multer = require('multer');
const path= require('path')



exports.newChannel = async (req, res, next) => {
    const { chatName, userId, type, receiverId, receiverEmail } = req.body;
    let createdChannel, existingChatName, directMessage, channel;
    try {
        if (type === "directMessage") {
            receiverDetails = await findByUserEmail(receiverEmail);
            let chatName = receiverDetails.userName;
            let  receiverId = receiverDetails._id;
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

exports.findEmail = async (req, res, next) => {
    const { emailId } = req.body;
    let receiverDetails;
    try {
        receiverDetails = await findByUserEmail(emailId);
        res.status(errorCodes.ok).send(receiverDetails);
    }
    catch (err) {
        next(errors.internal_server_error("Internal server error"));
    }
};


exports.joinChannel = async (req, res, next) => {
    const { chatName, userId } = req.body;
    let joinedChannel, channel;
    try {
        joinedChannel = await joinNewChat(chatName, userId);
        await joinedChannel.save();
        channel = await updateChannel(joinedChannel._id, userId);
        res.status(errorCodes.ok).send(joinedChannel);
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

exports.message = async (req,res, next) => {
    req.body=JSON.parse(req.body.data)
    let { text, senderId, chatId, type, index, senderName,isFile } = req.body;
    let messages, senderDetails;

        
        console.log('req body files----',req.body);
        if(isFile){
            console.log(req.file)
            if(!req.file)
            {
                next(errors.internal_server_error("Internal server error"));
            }
            console.log('file uploadded successfully',req.file)
            text = 'http://localhost:3333/public/'+req.file.filename;
        }
        try {
            messages = await message(text, senderId, chatId, type, index,senderName,isFile);
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
