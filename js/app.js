angular.module('molApp', ['chart.js', 'ngResource', 'ui.router'])

.run(['$rootScope', '$state', '$stateParams', '$window', '$location', function ($rootScope, $state, $stateParams, $window, $location) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.stateIsLoading = false;
    $window.ga('create', 'UA-XXXXXXXX-X', 'auto');
    $window.ga('set', 'title', 'IHAS');
    $rootScope.$on('$stateChangeStart', function() {
        $rootScope.stateIsLoading = true;
    });
    $rootScope.$on('$stateChangeSuccess', function(event) {
        $rootScope.stateIsLoading = false;
        $window.ga('send', 'pageview', $location.path());
    });
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        $rootScope.stateIsLoading = true;
        console.log('state change error ' + JSON.stringify(error));
    });
}]) 

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
	.state({
        name: 'home',
        url: '/home',
        templateUrl: 'pages/home.html',
        data: { pageTitle: 'Home - Ice Hockey Attendance Stats' },
    })
    .state({
        name: 'league',
        url: '/league/:leagueabbr/:season',
        controller: 'LeagueCtrl',
        templateUrl: 'pages/league.html',
        data: {},
        resolve: {
            AttendanceDataRes: function(AttendanceData, $stateParams) { return AttendanceData($stateParams.leagueabbr, $stateParams.season); }
        }
    });
    $urlRouterProvider.otherwise('/home');
})
;