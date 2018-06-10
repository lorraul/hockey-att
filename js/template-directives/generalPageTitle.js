angular.module('molApp').directive('generalPageTitle', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/general-page-title.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.title = $scope.data.entityData.title;
            $scope.dataSourceLink = $scope.data.attendanceData.metaData.dataSourceLink;
        }]
    };
});
