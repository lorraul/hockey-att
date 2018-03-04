angular.module('molApp').directive('teamLowestAway', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/team-lowest-away.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.dataArray = [];
            $scope.awayLowSwitch = [];
            for (var i in $scope.data.leagueData.teams) {
                $scope.dataArray.push({
                    team: $scope.data.leagueData.teams[i].long,
                    games: getMin($scope.data.attendanceData.dataArray, 'attendance', 'team2', $scope.data.leagueData.teams[i].long)
                });
            }
            }]
    };
});
