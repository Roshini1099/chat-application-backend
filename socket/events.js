const {updateDeliveredAndseen} = require('../src/utils/dbUtil');

exports.userStatus = (socket,io,online)=>{
    console.log(socket.handshake.auth.token);
    console.log(socket.id)
    io.emit('user-status',{userName:socket.handshake.auth.userName, timestamp: Date.now(), isOnline:online});
}

exports.typing = (socket,io,userSocketIdMap)=>{

    socket.on('typing',payload=>{  //type,recieverId,userName
        if(payload.type==='channel')
        {
            socket.to(payload.channelId).emit('typing',{userId:payload.recieverId,userName:payload.userName});
        }
        else{
            userSocketIdMap.get(payload.recieverId).forEach(receiverId=>{
                io.to(receiverId).emit('typing',{userId:payload.recieverId,userName:payload.userName});     
            })
        }
    })
}

exports.getNewChat = (socket,io,userSocketIdMap)=>{
    socket.on('getnewchat',(payload)=>{ // chatId, index
        if(payload.type==='channel')
        {
            io.to(payload.channelId).emit('getnewchat',{chatId:payload.chatId,index:payload.index});
        }
        else{
            userSocketIdMap.get(payload.userId).forEach(receiverId=>{
                io.to(receiverId).emit('getnewchat',{chatId:payload.chatId,index:payload.index});     
            })
        }
    })
}

exports.delivered = (socket,io,userSocketIdMap)=>{
    socket.on('delivered',async (payload)=>{
        // change the delivered status in the DB.
        try{
            await updateDeliveredAndseen('delivered',payload.chatId,payload.index);
            if(payload.type==='channel')
            {
                io.to(payload.channelId).emit('delivered',{chatId:payload.chatId,index:payload.index});
            }
            else{
                userSocketIdMap.get(payload.userId).forEach(receiverId=>{
                    io.to(receiverId).emit('delivered',{chatId:payload.chatId,index:payload.index});     
                })
            }
        }
        catch(err){
            //report the error
            console.log('error updating the delivered status')
        }

    })
}


exports.seen = (socket,io,userSocketIdMap)=>{
    socket.on('seen',async (payload)=>{
        try{
            await updateDeliveredAndseen('seen',payload.chatId,payload.index);
            if(payload.type==='channel')
            {
                io.to(payload.channelId).emit('seen',{chatId:payload.chatId,messageId:payload.messageId});
            }
            else{
                userSocketIdMap.get(payload.userId).forEach(receiverId=>{
                    io.to(receiverId).emit('seen',{chatId:payload.chatId,messageId:payload.messageId});     
                })
            }
        }
        catch(err){
            console.log('error updating the delivered status')
        }
    })
}

//newMessage is called when a new direct message chat is initiated between two users.
exports.newDM= (socket,io,userSocketIdMap)=>{
    socket.on('newDM',payload=>{
        userSocketIdMap.get(payload.receiverId).forEach(receiverId=>{
            io.to(receiverId).emit('newDM',{chatId:payload.chatId});     
        })
    })
}