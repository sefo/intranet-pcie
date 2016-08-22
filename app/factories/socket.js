function socketService(socketFactory) {
    var socket = socketFactory();
    socket.forward('broadcast');
    return socket;
};

angular
    .module('app')
    .factory('socketService', socketService);