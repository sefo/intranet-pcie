module.exports = function(io) {
  //when a user connects to the server
  io.on('connection', function (socket) {
    //he joins a private room (event emit depuis le client angular page de login)
    socket.on('join', function(data) {
      socket.join(data.email);
    });
    //log out = leaving channel
    socket.on('leave', function(data) {
      socket.leave(data.email);
      socket.disconnect();
    });
    //and listens to messages (to = email personne concernée)
    socket.on('modification_event', function (from, to, msg, data) {
      io.sockets.in(to).emit('notification', {
        message: msg,
        source: from,
        destination: to,
        event: data
      });
    });
  });
};
