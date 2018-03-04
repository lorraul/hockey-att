angular.module('molApp').directive('totalAverage', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/total-average.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.total = $scope.commonData.totalAverage;
            $scope.highest = getMax($scope.data.attendanceData.dataArray, 'attendance')[0];
            $scope.lowest = getMin($scope.data.attendanceData.dataArray, 'attendance')[0];
            }]
    };
});
