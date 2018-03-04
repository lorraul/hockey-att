angular.module('molApp').directive('leaguePageTitle', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/league-page-title.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', function ($scope) {
            var latestDate = getLatestDate(getColumnFiltered($scope.data.attendanceData.dataArray, null, 'date'));
            $scope.image = $scope.data.leagueData.image;
            $scope.title = $scope.data.leagueData.title;
            $scope.updated = (latestDate) ? latestDate.getFullYear().toString() + '-' + (latestDate.getMonth() + 1).toString() + '-' + latestDate.getDate().toString() : 'no dates yet';
            $scope.gameslink = $scope.data.attendanceData.metaData.gamesLink;
            $scope.notStarted = (latestDate) ? false : true;
        }]
    };
});
