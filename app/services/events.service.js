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
    this.getTypes = function(y) {
        return $http.get('/api/absences/types/lister').then(
            function(response) {
                return response.data;
            },
            function(response) {
                return response;
            });
    };
    this.enregistrerEvent = function(event) {
        return $http.post('/api/absences/enregistrer', event).then(
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