(function() {
    'use strict'

    var intranet = {
        bindings: {},
        controller: intranetController,
        templateUrl: 'components/intranet/intranet.template.html'
    };

    function intranetController(loginService, $rootScope, Notification) {

        var vm = this;
        this.loggedUser = {};

        // écoute les évènements serveur
        $rootScope.$on('socket:notification', function(event, data) {
            Notification({message: 'De: ' + data.source + ' : ' + data.message, delay: 'infinite'});
            // console.log(data.message);
            // console.log(data.source);
            // console.log(data.destination);
            // console.log(data.event);
        });

        // Permet de garder l'utilisateur à jour quand la page est refreshed
        loginService.profile().then(function(data) {
            vm.loggedUser = data;
        });
        
        this.updateUser = function(user) {
            this.loggedUser = user;
        };

        this.getUser = function() {
            return this.loggedUser;
        };
    }

    angular
        .module('app')
        .component('intranet', intranet)
        .controller('intranetController', intranetController);

}) ();