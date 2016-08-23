function rhService($http) {
    this.getRH = function() {
        return $http.get('/api/rh/profile').then(
            function(response) {
                return response.data;
            },
            function(response) {
                return response;
            });
    }
    this.getEvents = function(y) {
        return $http.get('/api/rh/absences/' + y).then(
            function(response) {
                return response.data;
            },
            function(response) {
                return response;
            });
    }
    this.validerAbsence = function(event) {
        return $http.post('/api/rh/absences/valider', event).then(
            function(response) {
                return response.data;
            },
            function(response) {
                return response;
            });
    }
    this.refuserAbsence = function(event) {
        return $http.post('/api/rh/absences/refuser', event).then(
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