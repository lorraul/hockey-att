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
    $rootScope.$on('$stateChangeError', function() {
        $rootScope.stateIsLoading = true;
        console.log('state change error ' + error);
    });
}]) 

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state({
        name: 'mol',
        url: '/mol',
        controller: 'MolCtrl',
        templateUrl: 'pages/mol.html',
        data: { pageTitle: 'MOL Liga - Ice Hockey Attendance Stats' },
        resolve: {
            AttendanceDataRes: function(AttendanceData) { return AttendanceData(1); }
        }
    })
    .state({
        name: 'lnh',
        url: '/lnh',
        controller: 'LnhCtrl',
        templateUrl: 'pages/lnh.html',
        data: { pageTitle: 'LNH - Ice Hockey Attendance Stats' },
        resolve: {
            AttendanceDataRes: function(AttendanceData) { return AttendanceData(3); }
        }
    })
    .state({
        name: 'ebel',
        url: '/ebel',
        controller: 'EbelCtrl',
        templateUrl: 'pages/ebel.html',
        data: { pageTitle: 'EBEL - Ice Hockey Attendance Stats' },
        resolve: {
            AttendanceDataRes: function(AttendanceData) { return AttendanceData(4); }
        }
    })
    

  $urlRouterProvider.otherwise('/mol');
})
;