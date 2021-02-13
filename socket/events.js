exports.userStatus = (socket,io,online)=>{
    console.log(socket.handshake.auth.userName);
    io.emit('user-status',{userName:socket.handshake.auth.userName, timestamp: Date.now(), isOnline:online});
}

exports.typing = (socket,io,userSocketIdMap)=>{

    socket.on('typing',payload=>{
        if(payload.type==='channel')
        {
            socket.to(payload.channelId).emit('typing',{userId:payload.userId,userName:payload.userName});
        }
        else{
            userSocketIdMap.get(payload.userId).forEach(receiverId=>{
                io.to(receiverId).emit('typing',{userId:payload.userId,userName:payload.userName});     
            })
        }
    })
}

exports.getNewChat = (socket,io,userSocketIdMap)=>{
    socket.on('getnewchat',(payload)=>{
        if(payload.type==='channel')
        {
            io.to(payload.channelId).emit('getnewchat',{chatId:payload.chatId,messageId:payload.messageId});
        }
        else{
            userSocketIdMap.get(payload.userId).forEach(receiverId=>{
                io.to(receiverId).emit('getnewchat',{chatId:payload.chatId,messageId:payload.messageId});     
            })
        }
    })
}

exports.delivered = (socket,io,userSocketIdMap)=>{
    socket.on('delivered',payload=>{
        // change the delivered status in the DB.
        if(payload.type==='channel')
        {
            io.to(payload.channelId).emit('delivered',{chatId:payload.chatId,messageId:payload.messageId});
        }
        else{
            userSocketIdMap.get(payload.userId).forEach(receiverId=>{
                io.to(receiverId).emit('delivered',{chatId:payload.chatId,messageId:payload.messageId});     
            })
        }

    })
}

exports.seen = (socket,io,userSocketIdMap)=>{
    socket.on('seen',payload=>{
        // change the seen status in the DB.
        if(payload.type==='channel')
        {
            io.to(payload.channelId).emit('seen',{chatId:payload.chatId,messageId:payload.messageId});
        }
        else{
            userSocketIdMap.get(payload.userId).forEach(receiverId=>{
                io.to(receiverId).emit('seen',{chatId:payload.chatId,messageId:payload.messageId});     
            })
        }

    })
}
//newMessage is called when a new direct message chat is initiated between two users.
exports.newMessage = (socket,io,userSocketIdMap)=>{
    socket.on('newchat',payload=>{
        userSocketIdMap.get(payload.receiverId).forEach(receiverId=>{
            io.to(receiverId).emit('newchat',{chatId:payload.chatId});     
        })
    })
}

