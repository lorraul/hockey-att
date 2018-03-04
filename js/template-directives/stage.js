angular.module('molApp').directive('stage', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/stage.html',
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
            $scope.labels = [];
            $scope.dataArray = [[]];
            $scope.stages = $scope.data.leagueData.stages;
            $scope.labels = $scope.commonData.averageByStage.labels;
            $scope.dataArray[0] = $scope.commonData.averageByStage.values;
            }]
    };
});
