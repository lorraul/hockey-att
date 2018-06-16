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

    .controller('HomeCtrl', ['$scope', '$state', 'homeFactory', function ($scope, $state, homeFactory) {
        $scope.homeGrid = homeFactory.homeGrid;
        $scope.seasonGrid = homeFactory.seasonGrid;
        $scope.getSeasonParam = homeFactory.getSeasonParam;
        $scope.goTo = function (state, params) {
            $state.go(state, params);
        };
    }])

    .controller("CompCtrl", ['$scope', '$state', 'AttendanceDataRes', 'commonDataService', function ($scope, $state, AttendanceDataRes, commonDataService) {
        $scope.leagueData = AttendanceDataRes; // aggregate data for the new directive format
        $scope.noData = !AttendanceDataRes || AttendanceDataRes === 'error' ? true : false;
        if (!$scope.noData) {
            $scope.commonData = commonDataService(AttendanceDataRes);
            $state.current.data.pageTitle = AttendanceDataRes.leagueData.title + ' - Ice Hockey Attendance Stats';
        }
    }])

    .controller("NavbarCtrl", ['$scope', '$location', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return $location.path().indexOf(viewLocation) === 0;
        };
    }])

    .controller("SeasonCtrl", ['$scope', '$state', 'AttendanceDataRes', function ($scope, $state, AttendanceDataRes) {
        $scope.noData = !AttendanceDataRes || AttendanceDataRes === 'error' ? true : false;
        if (!$scope.noData) {
            angular.forEach(AttendanceDataRes.attendanceData.dataArray, function (data) {
                data.average = parseInt(data.average);
            });
            $scope.allData = angular.copy(AttendanceDataRes);
            $state.current.data.pageTitle = AttendanceDataRes.entityData.title + ' - Ice Hockey Attendance Stats';
            $scope.compSwitch = {
                value: false
            };
            $scope.switchChange = function () {
                if ($scope.compSwitch.value) {
                    $scope.allData.attendanceData.dataArray = _.filter($scope.allData.attendanceData.dataArray, {
                        type: 'league'
                    });
                } else {
                    $scope.allData = angular.copy(AttendanceDataRes);
                }
            };
        }
    }]);
