module.exports.respond = (socket, endpoint) => {

  socket.on('join-room', (roomId, peerId) => {
    console.log(roomId + " " + peerId)
    socket.join(roomId);
      console.log("VIDEO CONTROLLER " + peerId)

    socket.to(roomId).emit('user-connected', peerId);
    // endpoint.to(roomId).emit('user-connected', peerId);

    // socket.on('disconnect', (peerId) => {
    //   endpoint.to(roomId).emit('user-disconnected', peerId);
    //   // endpoint.to(roomId).emit('user-disconnected', peerId);
    // })
    // })
  });

}