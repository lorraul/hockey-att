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
        templateUrl: 'templates/mol.html',
        data: { pageTitle: 'MOL Liga - Ice Hockey Attendance Stats' },
        resolve: {
            AttendanceDataRes: function(AttendanceData) { return AttendanceData(1); }
        }
    })
    .state({
        name: 'lnh',
        url: '/lnh',
        controller: 'LnhCtrl',
        templateUrl: 'templates/lnh.html',
        data: { pageTitle: 'LNH - Ice Hockey Attendance Stats' },
        resolve: {
            AttendanceDataRes: function(AttendanceData) { return AttendanceData(3); }
        }
    })
    .state({
        name: 'ebel',
        url: '/ebel',
        controller: 'EbelCtrl',
        templateUrl: 'templates/ebel.html',
        data: { pageTitle: 'EBEL - Ice Hockey Attendance Stats' },
        resolve: {
            AttendanceDataRes: function(AttendanceData) { return AttendanceData(4); }
        }
    })
    

  $urlRouterProvider.otherwise('/mol');
})

.factory('AttendanceRawData', ['$resource', function ($resource) {
    var apiRequest = $resource("https://spreadsheets.google.com/feeds/list/1uGOxMEjO9baAImKO_Ax40NWjXHwwHUW_zkARVQC3ptw/:sheet/public/values?alt=json");
    return function(sheet){
        return apiRequest.get({sheet: sheet}).$promise.then(
            function(data){ return data.feed;},
            function(error){ return 'error'; }
        );
    }
}])

.factory('AttendanceData', ['AttendanceRawData', function (AttendanceRawData) {
    return function(sheet){
        return AttendanceRawData(sheet).then(
            function(data){ 
                if (data == 'error') return 'error';
                
                var dataArray = [];
                var dataObject = {};
                for (var i in data.entry){
                    dataObject = {}
                    dataObjectElements = data.entry[i].content.$t.split(", ");
                    for(var j in dataObjectElements){
                        dataObjectElements[j].split(": ");
                        dataObject[dataObjectElements[j].split(": ")[0]] = dataObjectElements[j].split(": ")[1];
                    }
                    dataArray.push(dataObject);
                }
                
                var metaData = {};
                metaData.updated = data.updated.$t;
                metaData.gamesLink = data.link[0].href;
                
                var returnObject = {};
                returnObject.dataArray = dataArray;
                returnObject.metaData = metaData;
                return returnObject;
            }
        );
    }
}])

;