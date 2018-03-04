angular.module('molApp').directive('country', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/country.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', 'chartOptions', function ($scope, chartOptions) {
            if ($scope.data.leagueData.country && $scope.data.leagueData.country.length !== 0) {
                $scope.countries = $scope.data.leagueData.country;
                $scope.options = {
                    annotation: chartOptions.annotation($scope.commonData.totalAverage, 'dashed'),
                    scales: chartOptions.scales()
                };
                $scope.dataArray = [[]];
                $scope.colors = [{
                    backgroundColor: [],
                    borderColor: []
                    }];
                $scope.labels = [];
                for (var i in $scope.data.leagueData.country) {
                    var averageByCountry = getAverage(getColumnFiltered($scope.data.attendanceData.dataArray, $scope.data.leagueData, 'attendance', 'team1', 'country', $scope.data.leagueData.country[i].three));
                    $scope.countries[i].averageValue = averageByCountry;
                    $scope.dataArray[0].push(averageByCountry);
                    $scope.colors[0].backgroundColor.push($scope.data.leagueData.country[i].color);
                    $scope.colors[0].borderColor.push($scope.data.leagueData.country[i].color);
                    $scope.labels.push($scope.data.leagueData.country[i].three);
                }
            }
            }]
    };
});
