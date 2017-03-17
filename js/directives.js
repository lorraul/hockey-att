//directives
angular.module('molApp')

.directive('leaguePageTitle', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/league-page-title.html',
        scope: {
            image: '=',
            title: '=',
            gameslink: '=',
            updated: '=',
        }
    };
})

.directive('totalAverage', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/total-average.html',
        scope: {
            data: '=',
        }
    };
})

.directive('country', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/country.html',
        scope: {
            countries: '=',
            data: '=',
            labels: '=',
            options: '=',
            colors: '='
        }
    };
})

.directive('month', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/month.html',
        scope: {
            months: '=',
            data: '=',
            labels: '=',
            options: '=',
            colors: '='
        }
    };
})

.directive('stage', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/stage.html',
        scope: {
            stages: '=',
            data: '=',
            labels: '=',
            options: '=',
            colors: '='
        }
    };
})

.directive('teamHome', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/team-home.html',
        scope: {
            data: '=',
			dataAll: '=dataall',
			dataSorted: '=datasorted',
            teams: '=',
            labels: '=',
            options: '=',
            colors: '=',
			chartLabels: '=chartlabels'
        }
    };
})

.directive('teamAway', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/team-away.html',
        scope: {
            data: '=',
			dataAll: '=dataall',
			dataSorted: '=datasorted',
            teams: '=',
            labels: '=',
            options: '=',
            colors: '=',
			chartLabels: '=chartlabels'
        }
    };
})

.directive('teamHomeAway', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/team-home-away.html',
        scope: {
            data: '=',
			dataAll: '=dataall',
			dataSorted: '=datasorted',
            teams: '=',
            labels: '=',
            options: '=',
            colors: '=',
			chartLabels: '=chartlabels'
        }
    };
})

.directive('teamRecordHome', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/team-record-home.html',
        scope: {
            data: '='
        }
    };
})

.directive('teamRecordAway', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/team-record-away.html',
        scope: {
            data: '='
        }
    };
})

.directive('teamLowestHome', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/team-lowest-home.html',
        scope: {
            data: '='
        }
    };
})

.directive('teamLowestAway', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/team-lowest-away.html',
        scope: {
            data: '='
        }
    };
})

.directive('sources', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/sources.html',
        scope: {
            sources: '=data',
        }
    };
})

;