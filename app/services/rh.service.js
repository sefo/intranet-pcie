function rhService($http) {
    this.getEvents = function(y) {
        return $http.get('/api/rh/absences/' + y).then(
            function(response) {
                return response.data;
            },
            function(response) {
                return response;
            });
    }
}

angular
    .module('app')
    .service('rhService', rhService);