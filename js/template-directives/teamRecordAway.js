angular.module('molApp').directive('teamRecordAway', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/team-record-away.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.dataArray = [];
            $scope.awayRecordSwitch = [];
            for (var i in $scope.data.leagueData.teams) {
                $scope.dataArray.push({
                    team: $scope.data.leagueData.teams[i].long,
                    games: getMax($scope.data.attendanceData.dataArray, 'attendance', 'team2', $scope.data.leagueData.teams[i].long)
                });
            }
            }]
    };
});
