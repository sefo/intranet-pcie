function socketService(socketFactory) {
    var socket = socketFactory();
    socket.forward('notification');
    return socket;
};

angular
    .module('app')
    .factory('socketService', socketService);