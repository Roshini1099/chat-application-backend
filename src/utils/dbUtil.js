const User = require('../models/user');
const Chat = require('../models/chat');
var io = require('../../socket/listener')

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
        console.log('*********************',messageLength.participants[0].receiverId);
        let recieverId;
        if(messageLength.participants[0].receiverId == senderId)
        {
            recieverId= messageLength.participants[0].senderId;
        }
        else{
            recieverId= messageLength.participants[0].receiverId;
        }
        console.log(senderId,recieverId);
        let online = false;
        online = io.checkOnline(recieverId);

        // console.log('isonline status',isOnline);
        // if(isOnline)
        //     online=true;
        // else online=false;
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
                        delivered: online,
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
                    [`${array + ".seen"}`]: true,
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
                    [`${array + ".seen"}`]: true,
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

const getCurrentChats = async (chatId) => {
    const chat = await Chat.findOne({ _id: chatId });
    return chat;
};

const updateDeliveredAndseen = async(chatId, type,userId)=>{
    console.log('inside delivered and seen update')
    let deliveredAndSeen;
    let chat = await Chat.findById(chatId);
    var msg = chat.messages
    if(type == "delivered"){
    for(var i=msg.length-1;i>0;i--){
        if(msg[i].delivered == false && msg[i].senderId!== userId){
            let array = "messages." + [i];
            deliveredAndSeen = await Chat.findOneAndUpdate(
         { _id: chatId },
         {
             $set: {
                 [`${array + ".delivered"}`]: true,
             },
         },
         {new: true},
     );
    }
    else{
        return chat;
        }
    }
    }
    else{
for(var i=msg.length-1;i>0;i--){
    if(msg[i].seen == false && msg[i].senderId!== userId){
        let array = "messages." + [i];
        deliveredAndSeen = await Chat.findOneAndUpdate(
     { _id: chatId },
     {
         $set: {
               [`${array + ".delivered"}`]: true,
             [`${array + ".seen"}`]: true,
         },
     },
     {new: true},
        );
    }
    else{
        return chat; 
        }
    }
    }
return deliveredAndSeen;
}
const findByUserIdAndChats = async (userId) => {
    const user = await User.findOne({ _id: userId }).populate('channels.chatId',{createdAt: 0, participants:0}).populate('directMessage.chatId',{createdAt: 0, participants:0}).populate('directMessage.receiverId',{password: 0, directMessage: 0, channels: 0}).exec();
    return user;
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
exports.findByUserIdAndChats = findByUserIdAndChats;
exports.getCurrentChats = getCurrentChats;
exports.updateDeliveredAndseen= updateDeliveredAndseen;
