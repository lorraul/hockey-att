//directives
angular.module('molApp')

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
            teams: '=',
            labels: '=',
            options: '=',
            colors: '='
        }
    };
})

.directive('teamAway', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/team-away.html',
        scope: {
            data: '=',
            teams: '=',
            labels: '=',
            options: '=',
            colors: '='
        }
    };
})

.directive('teamHomeAway', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/team-home-away.html',
        scope: {
            data: '=',
            teams: '=',
            labels: '=',
            options: '=',
            colors: '='
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