angular.module('molApp')

    .controller("DataCheckCtrl", ['$scope', '$state', 'AttendanceDataRes', 'dataCheckService', function ($scope, $state, AttendanceDataRes, dataCheckService) {
        $scope.noData = !AttendanceDataRes ? true : false;

        if (AttendanceDataRes) {
            $state.current.data.pageTitle = AttendanceDataRes.leagueData.title + ' - Data Check';
            $scope.ligueData = AttendanceDataRes.leagueData;
            $scope.attData = AttendanceDataRes.attendanceData;
            $scope.dataCheck = dataCheckService(AttendanceDataRes.attendanceData, AttendanceDataRes.leagueData);
        }
    }])

    .controller('HomeCtrl', ['$scope', 'homeFactory', function ($scope, homeFactory) {
        $scope.homeGrid = homeFactory.homeGrid;
        $scope.getSeasonParam = homeFactory.getSeasonParam;
    }])

    .controller("CompCtrl", ['$scope', '$state', 'AttendanceDataRes', 'commonDataService', function ($scope, $state, AttendanceDataRes, commonDataService) {
        $scope.leagueData = AttendanceDataRes; // aggregate data for the new directive format
        $scope.commonData = commonDataService(AttendanceDataRes);
        $scope.noData = !AttendanceDataRes || AttendanceDataRes === 'error' ? true : false;
        if (!$scope.noData) {
            $state.current.data.pageTitle = AttendanceDataRes.leagueData.title + ' - Ice Hockey Attendance Stats';
        }
    }])

    .controller("NavbarCtrl", ['$scope', '$location', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return $location.path().indexOf(viewLocation) === 0;
        };
    }]);
