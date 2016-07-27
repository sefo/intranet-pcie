var intranet = {
    bindings: {},
    controller: intranetController,
    templateUrl: 'components/intranet/intranet.template.html'
};

function intranetController(loginService) {

    var vm = this;
    this.loggedUser = {};

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