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

    .controller("CompCtrl", ['$scope', '$state', 'AttendanceDataRes', 'ligueStats', function ($scope, $state, AttendanceDataRes, ligueStats) {
        $scope.noData = !AttendanceDataRes || AttendanceDataRes === 'error' ? true : false;
        if (!$scope.noData) {
            $state.current.data.pageTitle = AttendanceDataRes.leagueData.title + ' - Ice Hockey Attendance Stats';
            $scope.ligueData = AttendanceDataRes.leagueData;
            if (AttendanceDataRes.leagueData.chartsby)
                $scope.ligueStats = ligueStats(AttendanceDataRes.attendanceData, $scope.ligueData, $scope.ligueData[AttendanceDataRes.leagueData.chartsby]);
            else
                $scope.ligueStats = ligueStats(AttendanceDataRes.attendanceData, $scope.ligueData);

            $scope.homeRecordSwitch = [];
            $scope.homeLowSwitch = [];
            $scope.awayRecordSwitch = [];
            $scope.awayLowSwitch = [];
        }
    }])

    .controller("NavbarCtrl", ['$scope', '$location', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return $location.path().indexOf(viewLocation) === 0;
        };
    }]);
