(function() {
    'use strict'

    var creation = {
        bindings: {},
        controller: creationController,
        templateUrl: 'components/admin/creation/creation.template.html'
    };

    function creationController($state, $window, roleService, adminService) {
        var vm = this;

        this.listeRoles = [];
        this.utilisateur = {};

        roleService.getListeRoles().then(function(data) {
            vm.listeRoles = data.data;
        });

        this.enregistrerUtilisateur = function(utilisateur) {
            adminService.enregistrerUtilisateur(utilisateur).then(function(data) {
                console.log(data); //data.name = 'error' //data.detail
            });
        };
    };

    angular
        .module('app')
        .component('creation', creation)
        .controller('creationController', creationController);

}) ();