function roleService($http) {
    this.getListeRoles = function() {
        return $http.get('/api/roles/lister').then(
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
    .service('roleService', roleService);