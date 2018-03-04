angular.module('molApp').directive('sources', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/sources.html',
        scope: {
            data: '=',
        },
        controller: ['$scope', function ($scope) {
            $scope.sources = $scope.data.leagueData.sources;
            }]
    };
});
