const {userStatus,typing,getNewChat,delivered,seen,newMessage} = require('./events');


const userSocketIdMap = new Map();

function addClientToMap(userName, socketId){
    if (!userSocketIdMap.has(userName)) {
        userSocketIdMap.set(userName, new Set([socketId]));
    } 
    else{
        //user had already joined from one client and now joining using another client
        userSocketIdMap.get(userName).add(socketId);
    }
}

function removeClientFromMap(userName, socketId){
    if (userSocketIdMap.has(userName)) {
        let userSocketIdSet = userSocketIdMap.get(userName);
        userSocketIdSet.delete(socketId);
        //if there are no clients for a user, remove that user from online
        // list (map)
        if (userSocketIdSet.size ==0 ) {
            userSocketIdMap.delete(userName);
        }
    }
}
    
module.exports = io=>{

    io.use((socket, next) => {
        console.log('new connection')
        const isValid = socket.handshake.auth.token;
        const userId = socket.handshake.auth.userId;
        if(isValid)
        {
            addClientToMap(userId,socket.id);
            next();
        }
        
        let err = new Error('token not verified');
        next(err);
    });
    
    io.on("connection", (socket) => {
        userStatus(socket,io,true);




        socket.on('disconnect', () => {
            //remove this client from online list
            removeClientFromMap(socket.handshake.auth.userId, socket.id);

            userStatus(socket,io,false);
            typing(socket,io,userSocketIdMap);
            getNewChat(socket,io,userSocketIdMap);
            delivered(socket,io,userSocketIdMap);
            seen(socket,io,userSocketIdMap);
            newMessage(socket,io,userSocketIdMap);

            socket.disconnect();
            
            });

    });


}