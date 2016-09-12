(function() {
    'use strict'
    
    var navigation = {
        bindings: {
            role: '@',
            email: '@'
        },
        controller: navigationController,
        templateUrl: 'components/navigation/navigation.template.html'
    };

    function navigationController($state, $window, socketService) {
        var vm = this;
        // Sert à savoir si on est sur la page de login
        // $states est async, la valeur n'est pas à jour ici.
        // On crée une réference qu'on utilise dans la vue où elle sera à jour
        this.state = $state;

        this.logout = function() {
            socketService.emit('leave', {email: vm.email});
            delete $window.sessionStorage.token;
            $state.go('login');
        };
    };

    angular
        .module('app')
        .component('navigation', navigation)
        .controller('navigationController', navigationController);

}) ();