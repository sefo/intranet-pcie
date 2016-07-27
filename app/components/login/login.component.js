var login = {
    bindings: {},
    require: {
        intranet: '^^intranet'
    },
    controller: loginController,
    templateUrl: 'components/login/login.template.html'
};

function loginController($window, $state, loginService) {
    var vm = this;
    // model du formulaire de login
    this.user = {};

    this.login = function(user) {
        loginService.login(user).then(function(data) {
            if(data.user) {
                $window.sessionStorage.token = data.user.token;
                vm.intranet.updateUser(data.user);
                $state.go('home');
            }
        });
    };

    this.profile = function() {
        loginService.profile().then(function(data) {
            console.log(data);
        });
    };
}

angular
    .module('app')
    .component('login', login)
    .controller('loginController', loginController);