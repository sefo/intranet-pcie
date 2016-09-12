function config($stateProvider, $urlRouterProvider, $windowProvider, $compileProvider, $httpProvider) {
		
	$httpProvider.interceptors.push('authInterceptor');

    $compileProvider.debugInfoEnabled(false);

    var $window = $windowProvider.$get();
    if ($window.sessionStorage.getItem('token') != undefined)
        $urlRouterProvider.otherwise("/home");
    else
        $urlRouterProvider.otherwise("/login");

    $stateProvider
    .state('login',
    {
        url : '/login',
        template : '<login></login>',
        //component: 'login', //ui-router beta 1.0
        resolve: {
            loggedin: loggedin
        }
    })
    .state('home',
    {
        url : '/home',
        template : '<home></home>',
        resolve: {
            authenticate: authenticate
        }
    })
    .state('admin',
    {
        url : '/admin',
        template: '<ui-view/>',
        abstract: true,
        resolve: {
            authenticate: authenticateAdmin
        }
    })    
    .state('admin.creation',
    {
        url : '/creation',
        template : '<creation></creation>'
    })
    .state('rh',
    {
        url : '/rh',
        template: '<ui-view/>',
        abstract: true,
        resolve: {
            authenticate: authenticateRH
        }
    })    
    .state('rh.absences',
    {
        url : '/absences',
        template : '<rh-absences></rh-absences>'
    });
}

function authenticate($timeout, $q, $location, loginService) {
    loginService.profile().then(function(data) {
        if(data.status == 401) {
            $timeout(function() { $location.path('/login'); });
            return $q.reject();
        } else {
            return $q.when();
        }
    });
}
function authenticateAdmin($timeout, $q, $location, loginService) {
    loginService.profile().then(function(data) {
        if(data.status == 401) {
            $timeout(function() { $location.path('/login'); });
            return $q.reject();
        } else if(data.role == 'admin') {
            return $q.when();
        } else {
            $timeout(function() { $location.path('/home'); });
            return $q.reject();
        }
    });
}
function authenticateRH($timeout, $q, $location, loginService) {
    loginService.profile().then(function(data) {
        if(data.status == 401) {
            $timeout(function() { $location.path('/login'); });
            return $q.reject();
        } else if(data.role == 'RH') {
            return $q.when();
        } else {
            $timeout(function() { $location.path('/home'); });
            return $q.reject();
        }
    });
}
function loggedin($timeout, $q, $location, loginService) {
    loginService.profile().then(function(data) {
        if(data.status == 401) {
            return $q.when();
        } else {
            $timeout(function() { $location.path('/home'); });
            return $q.reject();
        }
    });
}

angular
    .module('app')
    .config(config);