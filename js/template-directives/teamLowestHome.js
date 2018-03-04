angular.module('molApp').directive('teamLowestHome', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/team-lowest-home.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.dataArray = [];
            $scope.homeLowSwitch = [];
            for (var i in $scope.data.leagueData.teams) {
                $scope.dataArray.push({
                    team: $scope.data.leagueData.teams[i].long,
                    games: getMin($scope.data.attendanceData.dataArray, 'attendance', 'team1', $scope.data.leagueData.teams[i].long)
                });
            }
            }]
    };
});
