angular.module('molApp').directive('teamHome', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/team-home.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', 'chartOptions', function ($scope, chartOptions) {
            $scope.teams = $scope.data.leagueData.teams;
            $scope.options = {
                annotation: chartOptions.annotation($scope.commonData.totalAverage, 'dashed'),
                scales: chartOptions.scales()
            };

            //create team color array
            var teamColors = [];
            if (!$scope.data.leagueData.teamColors.by) { //set default color for each team
                for (var x = 0; x < $scope.teams.length; x++) {
                    teamColors.push($scope.data.leagueData.teamColors.default);
                }
            } else {
                angular.forEach($scope.teams, function (team) {
                    var colorSourceObject = _.find($scope.data.leagueData[$scope.data.leagueData.teamColors.by], function (o) {
                        return o.three == team[$scope.data.leagueData.teamColors.by];
                    });
                    if (colorSourceObject.color) {
                        teamColors.push(colorSourceObject.color);
                    } else {
                        teamColors.push($scope.data.leagueData.teamColors.default);
                    }
                });
            }

            var teamChartsBy = $scope.data.leagueData[$scope.data.leagueData.chartsby];
            if (!$scope.data.leagueData.chartsby || typeof teamChartsBy == 'undefined') {
                $scope.colors = [{
                    backgroundColor: [],
                    borderColor: []
                    }];
                $scope.labels = [$scope.commonData.teamSeries.labels];
                for (var k in $scope.teams) {
                    $scope.colors[0].backgroundColor.push(teamColors[k]);
                    $scope.colors[0].borderColor.push(teamColors[k]);
                }
                $scope.dataArray = [$scope.commonData.teamSeries.homeAverage];
                $scope.dataAll = $scope.dataArray[0];
                $scope.chartLabels = [''];
            } else {
                $scope.colors = [];
                $scope.labels = [];
                $scope.dataArray = [];
                $scope.chartLabels = [];
                for (var h in teamChartsBy) {
                    $scope.colors.push({
                        backgroundColor: [],
                        borderColor: []
                    });
                    $scope.labels.push([]);
                    $scope.dataArray.push([]);
                    $scope.chartLabels.push(teamChartsBy[h].long);
                }

                for (var j in teamChartsBy) {
                    for (var i in $scope.teams) {
                        if ($scope.teams[i][$scope.data.leagueData.chartsby] == teamChartsBy[j].short) {
                            $scope.colors[j].backgroundColor.push(teamColors[i]);
                            $scope.colors[j].borderColor.push(teamColors[i]);
                            $scope.labels[j].push($scope.teams[i].label);
                            $scope.dataArray[j].push($scope.commonData.teamSeries.homeAverage[i]);
                        }
                    }
                }

                $scope.dataAll = $scope.commonData.teamSeries.homeAverage;
            }

            $scope.dataSorted = [];
            for (var n in $scope.teams) {
                $scope.dataSorted.push({
                    team: $scope.teams[n].long,
                    attendance: $scope.dataAll[n]
                });
            }
            $scope.dataSorted.sort(compareAttendance);
            }]
    };
});
