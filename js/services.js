angular.module('molApp')
.factory('AttendanceRawData', ['$resource', function ($resource) {
    var apiRequest = $resource("https://spreadsheets.google.com/feeds/list/1uGOxMEjO9baAImKO_Ax40NWjXHwwHUW_zkARVQC3ptw/:sheet/public/values?alt=json");
    return function(sheet){
        return apiRequest.get({sheet: sheet}).$promise.then(
            function(data){ return data.feed;},
            function(error){ return 'error'; }
        );
    }
}])

.factory('AttendanceData', ['AttendanceRawData', function (AttendanceRawData) {
    return function(sheet){
        return AttendanceRawData(sheet).then(
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
                
                var returnObject = {};
                returnObject.dataArray = dataArray;
                returnObject.metaData = metaData;
                return returnObject;
            }
        );
    }
}])

.factory('globalChartOptions', function () {
    var gridLines = {color: '#262626', lineWidth: 1};
    var scaleLabelColor = '#d9d9d9';
    var horizontalLineStyle = 'rgba(255,102,102,0.4)',
        horizontalLineText = 'Average'; 
    return {
        barChart: function(averageValue){
            return {
                horizontalLine: [{
                  "y": averageValue,
                  "style": horizontalLineStyle,
                  "text": horizontalLineText
                }],
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
                horizontalLine: [{
                  "y": averageValue,
                  "style": horizontalLineStyle,
                  "text": horizontalLineText
                }],
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
        var latestDate = getLatestDate(getColumn(AttendanceDataRes.dataArray, 'date'));
        returnObject.updated = latestDate.getFullYear().toString() + '-' + (latestDate.getMonth()+1).toString() + '-' + latestDate.getDate().toString();
        returnObject.gamesLink = AttendanceDataRes.metaData.gamesLink;

        //total average
        returnObject.dataTotal= {
            total: getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance')),
            highest: getMax(AttendanceDataRes.dataArray, 'attendance'),
            lowest: getMin(AttendanceDataRes.dataArray, 'attendance')
        }

        returnObject.optionsBarChart = globalChartOptions.barChart(returnObject.dataTotal.total);
        returnObject.optionsLineChart = globalChartOptions.lineChart(returnObject.dataTotal.total);

        //country stats
        if(ligueData.countries && ligueData.countries.length != 0){
            returnObject.dataCountry = [[]];
            returnObject.colorsCountry = [{backgroundColor: [], borderColor: []}];
            returnObject.labelsCountry = [];
            for (var i in ligueData.countries){
                returnObject.dataCountry[0].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', ligueData.countries[i].three)))
                returnObject.colorsCountry[0].backgroundColor.push(ligueData.countries[i].color);
                returnObject.colorsCountry[0].borderColor.push(ligueData.countries[i].color);
                returnObject.labelsCountry.push(ligueData.countries[i].three);
            }
        }

        //month stats
        returnObject.colorsMonth = globalChartOptions.lineChartColors;
        returnObject.labelsMonth = [];
        returnObject.dataMonth = [[]];    
        for (var i in ligueData.months){
            returnObject.labelsMonth.push(ligueData.months[i]);
            returnObject.dataMonth[0].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'date', ligueData.months[i])));
        }
        
        //stage stats
        returnObject.colorsStage = globalChartOptions.lineChartColors;
        returnObject.labelsStage = [];
        returnObject.dataStage = [[]]; 
        for (var i in ligueData.stages){
            returnObject.labelsStage.push(ligueData.stages[i].short);
            returnObject.dataStage[0].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'stage', ligueData.stages[i].short)));
        }

        //team stats   
		if (typeof teamChartsBy == 'undefined'){
			returnObject.colorsTeams = [{backgroundColor: [], borderColor: []}];
			returnObject.labelsTeams = [[]];
			for (var i in ligueData.teams){
				returnObject.colorsTeams[0].backgroundColor.push(ligueData.teams[i].color);
				returnObject.colorsTeams[0].borderColor.push(ligueData.teams[i].color);
				returnObject.labelsTeams[0].push(ligueData.teams[i].label);
			}

			returnObject.dataHome = [[]];
			returnObject.dataAway = [[]];
			returnObject.dataHomeAway = [[]];

			for (var i in ligueData.teams){
				returnObject.dataHome[0][i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', ligueData.teams[i].long));
				returnObject.dataAway[0][i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', ligueData.teams[i].long));
				returnObject.dataHomeAway[0][i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', ligueData.teams[i].long).concat(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', ligueData.teams[i].long)));
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
				returnObject.colorsTeams.push({backgroundColor: [], borderColor: []});
				returnObject.labelsTeams.push([]);
				returnObject.dataHome.push([]);
				returnObject.dataAway.push([]);
				returnObject.dataHomeAway.push([]);
				returnObject.teamChartsBy.push(teamChartsBy[h].long);
			}
			
			for (var j in teamChartsBy){
				for (var i in ligueData.teams){
					if (ligueData.teams[i].division == teamChartsBy[j].short){
						returnObject.colorsTeams[j].backgroundColor.push(ligueData.teams[i].color);
						returnObject.colorsTeams[j].borderColor.push(ligueData.teams[i].color);
						returnObject.labelsTeams[j].push(ligueData.teams[i].label);
						returnObject.dataHomeAway[j].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', ligueData.teams[i].long).concat(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', ligueData.teams[i].long))));
						returnObject.dataHome[j].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', ligueData.teams[i].long)));
						returnObject.dataAway[j].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', ligueData.teams[i].long)));
					}
				}
			}
			
			for (var i in ligueData.teams){
				returnObject.dataHomeAll[i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', ligueData.teams[i].long));
				returnObject.dataAwayAll[i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', ligueData.teams[i].long));
				returnObject.dataHomeAwayAll[i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', ligueData.teams[i].long).concat(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', ligueData.teams[i].long)));
			}
		}
		
        return returnObject;
    }
}])
;