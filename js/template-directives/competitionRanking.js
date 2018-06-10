angular.module('molApp').directive('competitionRanking', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/competition-ranking.html',
        scope: {
            data: '='
        },
        controller: ['$scope', function ($scope) {
            angular.forEach($scope.data.attendanceData.dataArray, function (data) {
                data.average = parseInt(data.average);
            });
        }]
    };
});
