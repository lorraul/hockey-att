angular.module('molApp').directive('teamRecordHome', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/team-record-home.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.dataArray = [];
            $scope.homeRecordSwitch = [];
            for (var i in $scope.data.leagueData.teams) {
                $scope.dataArray.push({
                    team: $scope.data.leagueData.teams[i].long,
                    games: getMax($scope.data.attendanceData.dataArray, 'attendance', 'team1', $scope.data.leagueData.teams[i].long)
                });
            }
            }]
    };
});
