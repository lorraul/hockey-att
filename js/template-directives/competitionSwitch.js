angular.module('molApp').directive('competitionSwitch', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/competition-switch.html',
        scope: {
            compSwitch: '=',
            switchChange: '&'
        },
        controller: function ($scope) {}
    };
});
