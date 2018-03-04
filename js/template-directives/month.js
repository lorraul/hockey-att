angular.module('molApp').directive('month', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/month.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', 'chartOptions', function ($scope, chartOptions) {
            $scope.colors = [{
                borderColor: '#1aa3ff',
                borderWidth: 3,
                pointRadius: 3,
                pointBackgroundColor: '#8db600',
                pointBorderColor: '#8db600',
                }];
            $scope.options = {
                annotation: chartOptions.annotation($scope.commonData.totalAverage, 'dashed'),
                scales: chartOptions.scales()
            };
            $scope.months = $scope.data.leagueData.months;
            $scope.labels = [];
            $scope.dataArray = [[]];
            for (var i in $scope.data.leagueData.months) {
                var averageByMonth = getAverage(getColumnFiltered($scope.data.attendanceData.dataArray, null, 'attendance', 'date', null, $scope.data.leagueData.months[i]));
                $scope.labels.push($scope.data.leagueData.months[i]);
                $scope.dataArray[0].push(averageByMonth);
            }
            }]
    };
});
