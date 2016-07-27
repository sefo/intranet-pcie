function eventService($http) {
    this.getEvents = function() {
        return $http.get('/api/absences/').then(
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