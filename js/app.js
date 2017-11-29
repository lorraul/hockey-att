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
    }])

    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $stateProvider
            .state({
                name: 'home',
                url: '/home',
                controller: 'HomeCtrl',
                templateUrl: 'pages/home.html',
                data: {
                    pageTitle: 'Home - Ice Hockey Attendance Stats'
                },
            })
            .state({
                name: 'league',
                url: '/league/:leagueabbr/:season',
                controller: 'LeagueCtrl',
                templateUrl: 'pages/league.html',
                data: {},
                resolve: {
                    AttendanceDataRes: ['AttendanceData', '$stateParams', function (AttendanceData, $stateParams) {
                        return AttendanceData($stateParams.leagueabbr, $stateParams.season);
                    }]
                }
            })
            .state({
                name: 'check',
                url: '/league/:leagueabbr/:season/check',
                controller: 'DataCheckCtrl',
                templateUrl: 'pages/check.html',
                data: {},
                resolve: {
                    AttendanceDataRes: ['AttendanceData', '$stateParams', function (AttendanceData, $stateParams) {
                        return AttendanceData($stateParams.leagueabbr, $stateParams.season);
                    }]
                }
            });
        $urlRouterProvider.otherwise('/home');
    }]);
