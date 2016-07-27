function loginService($http) {
    this.login = function(user) {
        return $http.post('/auth', user).then(
            function(response) {
                return response.data;
            },
            function(response) {
                return response;
            });
    };
    this.profile = function() {
        return $http.get('/me').then(
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
    .service('loginService', loginService);