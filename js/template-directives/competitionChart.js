angular.module('molApp').directive('competitionChart', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/competition-chart.html',
        scope: {
            data: '='
        },
        controller: ['$scope', 'chartOptions', function ($scope, chartOptions) {
            var leagueAverages = _.orderBy($scope.data.attendanceData.dataArray, ['average'], ['desc']);
            $scope.dataArray = [[]];
            $scope.labels = [];
            $scope.options = {
                scales: chartOptions.scales()
            };

            $scope.colors = [{
                backgroundColor: [],
                borderColor: []
            }];

            for (var i in leagueAverages) {
                $scope.dataArray[0].push(leagueAverages[i].average);
                $scope.labels.push(leagueAverages[i].competition);
                if ($scope.data.entityData.color) {
                    $scope.colors[0].backgroundColor.push($scope.data.entityData.color);
                    $scope.colors[0].borderColor.push($scope.data.entityData.color);
                } else {
                    $scope.colors[0].backgroundColor.push('#a9d80d');
                    $scope.colors[0].borderColor.push('#a9d80d');
                }
            }
        }]
    };
});
