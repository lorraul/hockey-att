angular.module('molApp')

.factory('LeagueData', ['$resource', function ($resource) {
    return function(leagueabbr, season){
        var datafile = 'data/'+leagueabbr+season+'.json';
        var apiRequest = $resource(datafile);
        return apiRequest.get().$promise.then(
            function(data){ return data;},
            function(error){ return 'error'; }
        );
    }
}])

.factory('AttendanceRawData', ['$resource', function ($resource) {
    var apiRequest = $resource("https://spreadsheets.google.com/feeds/list/:spreedsheatid/:sheetnr/public/values?alt=json");
    return function(spreedsheatid, sheetnr){
        return apiRequest.get({spreedsheatid: spreedsheatid, sheetnr: sheetnr}).$promise.then(
            function(data){ return data.feed;},
            function(error){ return 'error'; }
        );
    }
}])

.factory('AttendanceData', ['AttendanceRawData', 'LeagueData', function (AttendanceRawData, LeagueData) {
    return function(leagueabbr, season){
        return LeagueData(leagueabbr, season).then(
            function(leagueData){
                return AttendanceRawData(leagueData.spreadsheet, leagueData.sheetnr).then(
                    function(data){ 
                        if (data == 'error') return 'error';

                        var dataArray = [];
                        var dataObject = {};
                        for (var i in data.entry){
                            dataObject = {}
                            dataObjectElements = data.entry[i].content.$t.split(", ");
                            for(var j in dataObjectElements){
                                dataObjectElements[j].split(": ");
                                dataObject[dataObjectElements[j].split(": ")[0]] = dataObjectElements[j].split(": ")[1];
                            }
                            dataArray.push(dataObject);
                        }

                        var metaData = {};
                        metaData.updated = data.updated.$t;
                        metaData.gamesLink = data.link[0].href;

                        var returnObject = {
                            attendanceData: {},
                            leagueData: {}
                        };
                        returnObject.attendanceData.dataArray = dataArray;
                        returnObject.attendanceData.metaData = metaData;
                        returnObject.leagueData = leagueData;
                        return returnObject;
                    }
                );
            },
            function(error){ return 'error'; }
        );
    }
}])

.factory('globalChartOptions', function () {
    var gridLines = {color: '#262626', lineWidth: 1};
    var scaleLabelColor = '#d9d9d9';
    var horizontalLineStyle = 'rgba(255,102,102,0.9)',
        horizontalLineText = 'Average';
    var annotationStyle = function(averageValue){
        return {
            annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: averageValue,
                borderColor: horizontalLineStyle,
                borderWidth: 1,
                borderDash: [8, 10],
                label: {
                    backgroundColor: 'transparent',
                    fontFamily: "sans-serif",
                    fontSize: 12,
                    fontStyle: 'bold',
                    fontColor: '#d9d9d9',
                    xPadding: 6,
                    yPadding: 6,
                    cornerRadius: 6,
                    position: 'left',
                    xAdjust: 30,
                    yAdjust: 0,
                    enabled: true,
                    content: horizontalLineText
                }
            }],
            drawTime: 'afterDraw'
        }
    };
    return {
        barChart: function(averageValue){
            return {
                annotation: annotationStyle(averageValue),
                scales: {
                    xAxes: [{
                        gridLines: gridLines,
                        barPercentage: 0.5,
                        ticks: {
                            fontColor: scaleLabelColor,
                        }
                    }],
                    yAxes: [{
                        gridLines: gridLines,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            };
        },
        lineChart: function(averageValue){
            return {
                annotation: annotationStyle(averageValue),
                scales: {
                    xAxes: [{
                        gridLines: gridLines,
                        ticks: {
                            fontColor: scaleLabelColor
                        }
                    }],
                    yAxes: [{
                        gridLines: gridLines,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            };
        },
        lineChartColors: [{
            borderColor: '#1aa3ff',
            borderWidth: 3,
            pointRadius: 3,
            pointBackgroundColor: '#8db600',
            pointBorderColor: '#8db600',
        }]
    }
})

.factory('ligueStats', ['globalChartOptions', function (globalChartOptions) {
    return function (AttendanceDataRes, ligueData, teamChartsBy){
        var returnObject = {};
        //meta
        var latestDate = getLatestDate(getColumnFiltered(AttendanceDataRes.dataArray, null, 'date'));
        returnObject.updated = latestDate.getFullYear().toString() + '-' + (latestDate.getMonth()+1).toString() + '-' + latestDate.getDate().toString();
        returnObject.gamesLink = AttendanceDataRes.metaData.gamesLink;

        //total average
        returnObject.dataTotal= {
            total: getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance')),
            highest: getMax(AttendanceDataRes.dataArray, 'attendance')[0],
            lowest: getMin(AttendanceDataRes.dataArray, 'attendance')[0]
        }

        returnObject.optionsBarChart = globalChartOptions.barChart(returnObject.dataTotal.total);
        returnObject.optionsLineChart = globalChartOptions.lineChart(returnObject.dataTotal.total);

        //country stats
        if(ligueData.country && ligueData.country.length != 0){
            returnObject.dataCountry = [[]];
            returnObject.colorsCountry = [{backgroundColor: [], borderColor: []}];
            returnObject.labelsCountry = [];
            for (var i in ligueData.country){
                returnObject.dataCountry[0].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray,ligueData,'attendance','team1','country',ligueData.country[i].three)));
                returnObject.colorsCountry[0].backgroundColor.push(ligueData.country[i].color);
                returnObject.colorsCountry[0].borderColor.push(ligueData.country[i].color);
                returnObject.labelsCountry.push(ligueData.country[i].three);
            }
        }

        //month stats
        returnObject.colorsMonth = globalChartOptions.lineChartColors;
        returnObject.labelsMonth = [];
        returnObject.dataMonth = [[]];    
        for (var i in ligueData.months){
            returnObject.labelsMonth.push(ligueData.months[i]);
            returnObject.dataMonth[0].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'date', null, ligueData.months[i])));
        }
        
        //stage stats
        returnObject.colorsStage = globalChartOptions.lineChartColors;
        returnObject.labelsStage = [];
        returnObject.dataStage = [[]]; 
        for (var i in ligueData.stages){
            returnObject.labelsStage.push(ligueData.stages[i].short);
            returnObject.dataStage[0].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'stage', null, ligueData.stages[i].short)));
        }
        
        //create team color array
        var teamColors = [];
        if (!ligueData.teamColors.by){ //set default color for each team
            for (var i=0; i< ligueData.teams.length; i++){
                teamColors.push(ligueData.teamColors.default);
            }
        } else {
            angular.forEach(ligueData.teams, function(team, key){
                var colorSourceObject = _.find(ligueData[ligueData.teamColors.by], function(o) { 
                    return o.three == team[ligueData.teamColors.by]; 
                });
                if(colorSourceObject.color){
                    teamColors.push(colorSourceObject.color);
                } else {
                    teamColors.push(ligueData.teamColors.default);
                }
            });
        }

        //team chart stats   
		if (typeof teamChartsBy == 'undefined'){
			returnObject.colorsTeams = [{backgroundColor: [], borderColor: []}];
			returnObject.labelsTeams = [[]];
			for (var i in ligueData.teams){
				returnObject.colorsTeams[0].backgroundColor.push(teamColors[i]);
				returnObject.colorsTeams[0].borderColor.push(teamColors[i]);
				returnObject.labelsTeams[0].push(ligueData.teams[i].label);
			}

			returnObject.dataHome = [[]];
			returnObject.dataAway = [[]];
			returnObject.dataHomeAway = [[]];

			for (var i in ligueData.teams){
				returnObject.dataHome[0][i] = getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team1', null, ligueData.teams[i].long));
				returnObject.dataAway[0][i] = getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team2', null, ligueData.teams[i].long));
				returnObject.dataHomeAway[0][i] = getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team1', null, ligueData.teams[i].long).concat(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team2', null, ligueData.teams[i].long)));
			}
			returnObject.dataHomeAll = returnObject.dataHome[0];
			returnObject.dataAwayAll = returnObject.dataAway[0];
			returnObject.dataHomeAwayAll = returnObject.dataHomeAway[0];
			returnObject.teamChartsBy = [''];
		} else {
			returnObject.colorsTeams = [];
			returnObject.labelsTeams = [];
			
			returnObject.dataHome = [];
			returnObject.dataAway = [];
			returnObject.dataHomeAway = [];
			
			returnObject.dataHomeAll = [];
			returnObject.dataAwayAll = [];
			returnObject.dataHomeAwayAll = [];
			
			returnObject.teamChartsBy = [];
			for (var h in teamChartsBy) {
				returnObject.colorsTeams.push({backgroundColor:[], borderColor:[]});
				returnObject.labelsTeams.push([]);
				returnObject.dataHome.push([]);
				returnObject.dataAway.push([]);
				returnObject.dataHomeAway.push([]);
				returnObject.teamChartsBy.push(teamChartsBy[h].long);
			}
			
			for (var j in teamChartsBy){
				for (var i in ligueData.teams){
					if (ligueData.teams[i].division == teamChartsBy[j].short){
						returnObject.colorsTeams[j].backgroundColor.push(teamColors[i]);
						returnObject.colorsTeams[j].borderColor.push(teamColors[i]);
						returnObject.labelsTeams[j].push(ligueData.teams[i].label);
						returnObject.dataHomeAway[j].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team1', null, ligueData.teams[i].long).concat(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team2', null, ligueData.teams[i].long))));
						returnObject.dataHome[j].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team1', null, ligueData.teams[i].long)));
						returnObject.dataAway[j].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team2', null, ligueData.teams[i].long)));
					}
				}
			}
			
			for (var i in ligueData.teams){
				returnObject.dataHomeAll[i] = getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team1', null, ligueData.teams[i].long));
				returnObject.dataAwayAll[i] = getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team2', null, ligueData.teams[i].long));
				returnObject.dataHomeAwayAll[i] = getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team1', null, ligueData.teams[i].long).concat(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team2', null, ligueData.teams[i].long)));
			}
		}
		
		//top and bottom teams
		returnObject.dataHomeAwayAllSorted = [];
		returnObject.dataHomeAllSorted = [];
		returnObject.dataAwayAllSorted = [];
		
		for (var i in ligueData.teams){
			returnObject.dataHomeAwayAllSorted.push({team: ligueData.teams[i].long, attendance: returnObject.dataHomeAwayAll[i]});
			returnObject.dataHomeAllSorted.push({team: ligueData.teams[i].long, attendance: returnObject.dataHomeAll[i]});	
			returnObject.dataAwayAllSorted.push({team: ligueData.teams[i].long, attendance: returnObject.dataAwayAll[i]});	
		}
			
		returnObject.dataHomeAwayAllSorted.sort(compareAttendance);
		returnObject.dataHomeAllSorted.sort(compareAttendance);
		returnObject.dataAwayAllSorted.sort(compareAttendance);
		
		//team record and low stats
		returnObject.dataHomeRecord = [];
		returnObject.dataAwayRecord = [];
        returnObject.dataHomeLow = [];
        returnObject.dataAwayLow = [];
		for (var i in ligueData.teams){
			returnObject.dataHomeRecord.push({team:ligueData.teams[i].long, games:getMax(AttendanceDataRes.dataArray, 'attendance', 'team1', ligueData.teams[i].long)});
			returnObject.dataAwayRecord.push({team:ligueData.teams[i].long, games:getMax(AttendanceDataRes.dataArray, 'attendance', 'team2', ligueData.teams[i].long)});
            returnObject.dataHomeLow.push({team: ligueData.teams[i].long, games: getMin(AttendanceDataRes.dataArray, 'attendance', 'team1', ligueData.teams[i].long)});
            returnObject.dataAwayLow.push({team: ligueData.teams[i].long, games: getMin(AttendanceDataRes.dataArray, 'attendance', 'team2', ligueData.teams[i].long)});
		}

        return returnObject;
    }
}])
;