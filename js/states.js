angular.module('molApp')

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
                controller: 'CompCtrl',
                templateUrl: 'pages/league.html',
                data: {},
                resolve: {
                    AttendanceDataRes: ['AttendanceData', '$stateParams', function (AttendanceData, $stateParams) {
                        return AttendanceData($stateParams.leagueabbr, $stateParams.season);
                    }]
                }
            })
            .state({
                name: 'tournament',
                url: '/tournament/:leagueabbr/:season',
                controller: 'CompCtrl',
                templateUrl: 'pages/tournament.html',
                data: {},
                resolve: {
                    AttendanceDataRes: ['AttendanceData', '$stateParams', function (AttendanceData, $stateParams) {
                        return AttendanceData($stateParams.leagueabbr, $stateParams.season);
                    }]
                }
            })
            .state({
                name: 'season',
                url: '/season/:season',
                controller: 'SeasonCtrl',
                templateUrl: 'pages/season.html',
                data: {},
                resolve: {
                    AttendanceDataRes: ['AttendanceData2', '$stateParams', function (AttendanceData2, $stateParams) {
                        return AttendanceData2('season', $stateParams.season);
                    }]
                }
            })
            .state({
                name: 'check',
                url: '/:comp/:leagueabbr/:season/check',
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
