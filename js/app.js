angular.module('molApp', ['chart.js', 'ngResource', 'ui.router', 'angularGrid'])

    .run(['$rootScope', '$state', '$stateParams', '$window', '$location', function ($rootScope, $state, $stateParams, $window, $location) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.stateIsLoading = false;
        $window.ga('create', 'UA-XXXXXXXX-X', 'auto');
        $window.ga('set', 'title', 'IHAS');
        $rootScope.$on('$stateChangeStart', function () {
            $rootScope.stateIsLoading = true;
        });
        $rootScope.$on('$stateChangeSuccess', function (event) {
            $rootScope.stateIsLoading = false;
            $window.ga('send', 'pageview', $location.path());
        });
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $rootScope.stateIsLoading = true;
            console.log('state change error ' + JSON.stringify(error));
        });
    }]);
