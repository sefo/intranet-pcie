(function() {
    'use strict'

    function adminService($http) {
        this.enregistrerUtilisateur = function(utilisateur) {
            return $http.post('/api/admin/utilisateur/enregistrer', utilisateur).then(
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
        .service('adminService', adminService);

}) ();