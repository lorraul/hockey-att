angular.module('molApp').directive('competitionRanking', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/competition-ranking.html',
        scope: {
            data: '='
        },
        controller: ['$scope', '$state', function ($scope, $state) {
            $scope.openDetails = function (competition) {
                if (competition.type && competition.abbr && competition.season) {
                    $state.go(competition.type, {
                        leagueabbr: competition.abbr,
                        season: competition.season
                    });
                }
            }
        }]
    };
});
