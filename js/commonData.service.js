angular.module('molApp').factory('commonDataService', ['$stateParams', 'AttendanceData', function ($stateParams, AttendanceData) {
    return function (data) {
        var returnObject = {};

        returnObject.totalAverage = getAverage(getColumnFiltered(data.attendanceData.dataArray, null, 'attendance'));

        returnObject.averageByStage = {
            labels: [],
            values: []
        };
        for (var i in data.leagueData.stages) {
            returnObject.averageByStage.labels.push(data.leagueData.stages[i].short);
            returnObject.averageByStage.values.push(getAverage(getColumnFiltered(data.attendanceData.dataArray, null, 'attendance', 'stage', null, data.leagueData.stages[i].short)));
        }

        returnObject.teamSeries = {
            labels: [],
            homeAwayAverage: [],
            homeAverage: [],
            awayAverage: []
        };
        for (i in data.leagueData.teams) {
            returnObject.teamSeries.labels.push(data.leagueData.teams[i].label);
            returnObject.teamSeries.homeAwayAverage.push(getAverage(getColumnFiltered(data.attendanceData.dataArray, null, 'attendance', 'team1', null, data.leagueData.teams[i].long).concat(getColumnFiltered(data.attendanceData.dataArray, null, 'attendance', 'team2', null, data.leagueData.teams[i].long))));
            returnObject.teamSeries.homeAverage.push(getAverage(getColumnFiltered(data.attendanceData.dataArray, null, 'attendance', 'team1', null, data.leagueData.teams[i].long)));
            returnObject.teamSeries.awayAverage.push(getAverage(getColumnFiltered(data.attendanceData.dataArray, null, 'attendance', 'team2', null, data.leagueData.teams[i].long)));
        }

        return returnObject;
    };
}]);
