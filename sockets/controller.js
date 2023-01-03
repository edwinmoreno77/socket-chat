const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");
const { ChatMessages } = require("../models");


const chatMessages = new ChatMessages();


const socketController = async (socket = new Socket(), io) => {
    const token = socket.handshake.headers['x-auth-token'];
    const user = await checkJWT(token);

    if (!user) {
        return socket.disconnect();
    }
    //add user connect
    chatMessages.connectUser(user);
    io.emit('active-users', chatMessages.usersArr);
    socket.emit('receive-messages', chatMessages.last10);

    //join user to a specific room
    socket.join(user.id); //global, socket.id, user.id

    //clear user disconnect
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.id);
        io.emit('active-users', chatMessages.usersArr);
    });

    //receive messages
    socket.on('send-message', ({ message, uid }) => {

        if (uid) {
            //private message
            socket.to(uid).emit('private-message', { from: user.name, message });
        } else {
            chatMessages.sendMessage(user.id, user.name, message);
            io.emit('receive-messages', chatMessages.last10);
        }
    });
}

module.exports = {
    socketController
}