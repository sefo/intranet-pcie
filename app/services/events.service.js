function eventService($http) {
    this.getEvents = function(y) {
        return $http.get('/api/absences/' + y).then(
            function(response) {
                return response.data;
            },
            function(response) {
                return response;
            });
    };
}

angular
    .module('app')
    .service('eventService', eventService);