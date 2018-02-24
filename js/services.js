angular.module('molApp')

    .factory('LeagueData', ['$resource', function ($resource) {
        return function (leagueabbr, season) {
            var datafile = 'data/' + leagueabbr + season + '.json';
            var apiRequest = $resource(datafile);
            return apiRequest.get().$promise.then(
                function (data) {
                    return data;
                },
                function (error) {
                    return 'error';
                }
            );
        };
    }])

    .factory('AttendanceRawData', ['$resource', function ($resource) {
        var apiRequest = $resource("https://spreadsheets.google.com/feeds/list/:spreedsheatid/:sheetnr/public/values?alt=json");
        return function (spreedsheatid, sheetnr) {
            return apiRequest.get({
                spreedsheatid: spreedsheatid,
                sheetnr: sheetnr
            }).$promise.then(
                function (data) {
                    return data.feed;
                }
            );
        };
    }])

    .factory('AttendanceData', ['AttendanceRawData', 'LeagueData', function (AttendanceRawData, LeagueData) {
        return function (leagueabbr, season) {
            return LeagueData(leagueabbr, season).then(
                function (leagueData) {
                    if (!leagueData.spreadsheet) return null;
                    return AttendanceRawData(leagueData.spreadsheet, leagueData.sheetnr).then(
                        function (data) {
                            if (data == 'error') return 'error';
                            var i, j;
                            var dataArray = [];
                            var dataObject = {};
                            var dataObjectElements;
                            for (i in data.entry) {
                                dataObject = {};
                                dataObjectElements = [];
                                dataObjectElements = data.entry[i].content.$t.split(", ");
                                for (j in dataObjectElements) {
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
                        },
                        function (error) {
                            return 'error';
                        }
                    );
                },
                function (error) {
                    return 'error';
                }
            );
        };
    }])

    .factory('globalChartOptions', function () {
        var gridLines = {
            color: '#262626',
            lineWidth: 1
        };
        var scaleLabelColor = '#d9d9d9';
        var horizontalLineStyle = 'rgba(255,102,102,0.9)',
            horizontalLineText = 'Average';
        var annotationStyle = function (averageValue) {
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
            };
        };
        return {
            barChart: function (averageValue) {
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
            lineChart: function (averageValue) {
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
        };
    })

    .factory('ligueStats', ['globalChartOptions', function (globalChartOptions) {
        return function (AttendanceDataRes, ligueData, teamChartsBy) {
            var i, j, returnObject = {};
            //meta
            var latestDate = getLatestDate(getColumnFiltered(AttendanceDataRes.dataArray, null, 'date'));
            returnObject.updated = (latestDate) ? latestDate.getFullYear().toString() + '-' + (latestDate.getMonth() + 1).toString() + '-' + latestDate.getDate().toString() : 'no dates yet';
            returnObject.gamesLink = AttendanceDataRes.metaData.gamesLink;
            returnObject.notStarted = (latestDate) ? false : true;

            //total average
            returnObject.dataTotal = {
                total: getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance')),
                highest: getMax(AttendanceDataRes.dataArray, 'attendance')[0],
                lowest: getMin(AttendanceDataRes.dataArray, 'attendance')[0]
            };

            returnObject.optionsBarChart = globalChartOptions.barChart(returnObject.dataTotal.total);
            returnObject.optionsLineChart = globalChartOptions.lineChart(returnObject.dataTotal.total);

            //country stats
            if (ligueData.country && ligueData.country.length !== 0) {
                returnObject.dataCountry = [[]];
                returnObject.colorsCountry = [{
                    backgroundColor: [],
                    borderColor: []
                }];
                returnObject.labelsCountry = [];
                for (i in ligueData.country) {
                    returnObject.dataCountry[0].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray, ligueData, 'attendance', 'team1', 'country', ligueData.country[i].three)));
                    returnObject.colorsCountry[0].backgroundColor.push(ligueData.country[i].color);
                    returnObject.colorsCountry[0].borderColor.push(ligueData.country[i].color);
                    returnObject.labelsCountry.push(ligueData.country[i].three);
                }
            }

            //month stats
            returnObject.colorsMonth = globalChartOptions.lineChartColors;
            returnObject.labelsMonth = [];
            returnObject.dataMonth = [[]];
            for (i in ligueData.months) {
                returnObject.labelsMonth.push(ligueData.months[i]);
                returnObject.dataMonth[0].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'date', null, ligueData.months[i])));
            }

            //stage stats
            returnObject.colorsStage = globalChartOptions.lineChartColors;
            returnObject.labelsStage = [];
            returnObject.dataStage = [[]];
            for (i in ligueData.stages) {
                returnObject.labelsStage.push(ligueData.stages[i].short);
                returnObject.dataStage[0].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'stage', null, ligueData.stages[i].short)));
            }

            //create team color array
            var teamColors = [];
            if (!ligueData.teamColors.by) { //set default color for each team
                for (i = 0; i < ligueData.teams.length; i++) {
                    teamColors.push(ligueData.teamColors.default);
                }
            } else {
                angular.forEach(ligueData.teams, function (team, key) {
                    var colorSourceObject = _.find(ligueData[ligueData.teamColors.by], function (o) {
                        return o.three == team[ligueData.teamColors.by];
                    });
                    if (colorSourceObject.color) {
                        teamColors.push(colorSourceObject.color);
                    } else {
                        teamColors.push(ligueData.teamColors.default);
                    }
                });
            }

            //team chart stats   
            if (typeof teamChartsBy == 'undefined') {
                returnObject.colorsTeams = [{
                    backgroundColor: [],
                    borderColor: []
                }];
                returnObject.labelsTeams = [[]];
                for (i in ligueData.teams) {
                    returnObject.colorsTeams[0].backgroundColor.push(teamColors[i]);
                    returnObject.colorsTeams[0].borderColor.push(teamColors[i]);
                    returnObject.labelsTeams[0].push(ligueData.teams[i].label);
                }

                returnObject.dataHome = [[]];
                returnObject.dataAway = [[]];
                returnObject.dataHomeAway = [[]];

                for (i in ligueData.teams) {
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
                    returnObject.colorsTeams.push({
                        backgroundColor: [],
                        borderColor: []
                    });
                    returnObject.labelsTeams.push([]);
                    returnObject.dataHome.push([]);
                    returnObject.dataAway.push([]);
                    returnObject.dataHomeAway.push([]);
                    returnObject.teamChartsBy.push(teamChartsBy[h].long);
                }

                for (j in teamChartsBy) {
                    for (i in ligueData.teams) {
                        if (ligueData.teams[i].division == teamChartsBy[j].short) {
                            returnObject.colorsTeams[j].backgroundColor.push(teamColors[i]);
                            returnObject.colorsTeams[j].borderColor.push(teamColors[i]);
                            returnObject.labelsTeams[j].push(ligueData.teams[i].label);
                            returnObject.dataHomeAway[j].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team1', null, ligueData.teams[i].long).concat(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team2', null, ligueData.teams[i].long))));
                            returnObject.dataHome[j].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team1', null, ligueData.teams[i].long)));
                            returnObject.dataAway[j].push(getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team2', null, ligueData.teams[i].long)));
                        }
                    }
                }

                for (i in ligueData.teams) {
                    returnObject.dataHomeAll[i] = getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team1', null, ligueData.teams[i].long));
                    returnObject.dataAwayAll[i] = getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team2', null, ligueData.teams[i].long));
                    returnObject.dataHomeAwayAll[i] = getAverage(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team1', null, ligueData.teams[i].long).concat(getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team2', null, ligueData.teams[i].long)));
                }
            }

            //top and bottom teams
            returnObject.dataHomeAwayAllSorted = [];
            returnObject.dataHomeAllSorted = [];
            returnObject.dataAwayAllSorted = [];

            for (i in ligueData.teams) {
                returnObject.dataHomeAwayAllSorted.push({
                    team: ligueData.teams[i].long,
                    attendance: returnObject.dataHomeAwayAll[i]
                });
                returnObject.dataHomeAllSorted.push({
                    team: ligueData.teams[i].long,
                    attendance: returnObject.dataHomeAll[i]
                });
                returnObject.dataAwayAllSorted.push({
                    team: ligueData.teams[i].long,
                    attendance: returnObject.dataAwayAll[i]
                });
            }

            returnObject.dataHomeAwayAllSorted.sort(compareAttendance);
            returnObject.dataHomeAllSorted.sort(compareAttendance);
            returnObject.dataAwayAllSorted.sort(compareAttendance);

            //team record and low stats
            returnObject.dataHomeRecord = [];
            returnObject.dataAwayRecord = [];
            returnObject.dataHomeLow = [];
            returnObject.dataAwayLow = [];
            for (i in ligueData.teams) {
                returnObject.dataHomeRecord.push({
                    team: ligueData.teams[i].long,
                    games: getMax(AttendanceDataRes.dataArray, 'attendance', 'team1', ligueData.teams[i].long)
                });
                returnObject.dataAwayRecord.push({
                    team: ligueData.teams[i].long,
                    games: getMax(AttendanceDataRes.dataArray, 'attendance', 'team2', ligueData.teams[i].long)
                });
                returnObject.dataHomeLow.push({
                    team: ligueData.teams[i].long,
                    games: getMin(AttendanceDataRes.dataArray, 'attendance', 'team1', ligueData.teams[i].long)
                });
                returnObject.dataAwayLow.push({
                    team: ligueData.teams[i].long,
                    games: getMin(AttendanceDataRes.dataArray, 'attendance', 'team2', ligueData.teams[i].long)
                });
            }

            return returnObject;
        };
    }])

    .factory('dataCheckService', function () {
        return function (AttendanceData, LeagueData) {
            var returnObject = {};
            //search for unrecognized stage, teams in data source
            returnObject.unrecognizedTeams = [];
            returnObject.unrecognizedStage = [];
            angular.forEach(AttendanceData.dataArray, function (row, key) {
                if (checkSourceStage(row.stage) == -1) {
                    returnObject.unrecognizedStage.push({
                        row: key,
                        data: row.stage
                    });
                }
                if (checkSourceTeams(row.team1) == -1) {
                    returnObject.unrecognizedTeams.push({
                        row: key,
                        data: row.team1
                    });
                }
                if (checkSourceTeams(row.team2) == -1) {
                    returnObject.unrecognizedTeams.push({
                        row: key,
                        data: row.team2
                    });
                }
            });


            //check if every team has the same number of fixed stage (RS/GS) games, overall, home and away
            //this check can be ignored for seasons not completed yet
            returnObject.fixedStageInconsistency = [];
            var fixedStage = _.find(LeagueData.stages, {
                fixed: true
            });
            var gameNrArray = [];
            angular.forEach(LeagueData.teams, function (team) {
                var rows = _.filter(AttendanceData.dataArray, function (row) {
                    return (row.team1 == team.long || row.team2 == team.long) && row.stage == (fixedStage ? fixedStage.short : null);
                });
                gameNrArray.push({
                    team: team.long,
                    gameNr: rows.length
                });
            });
            //get the number of RS games a team should have
            //assume that the the correct number the rounded average
            var sum = _.map(gameNrArray, 'gameNr').reduce(function (a, b) {
                return a + b;
            });
            var avg = Math.round(sum / _.map(gameNrArray, 'gameNr').length);
            angular.forEach(gameNrArray, function (gamesByTeam) {
                if (gamesByTeam.gameNr != avg)
                    returnObject.fixedStageInconsistency.push(gamesByTeam);
            });

            return returnObject;

            //private functions

            //check if the team in the data source is in the leage team list, return -1 if not
            function checkSourceTeams(rowTeam) {
                return _.findIndex(LeagueData.teams, {
                    long: rowTeam
                });
            }

            //check if the competition stage in the data source is in the leage json, return -1 if not
            function checkSourceStage(rowStage) {
                return _.findIndex(LeagueData.stages, {
                    short: rowStage
                });
            }
        };
    })

    .factory('homeFactory', ['$state', function ($state) {
        var returnObject = {};
        returnObject.homeGrid = [
            {
                img: 'img/nhl.png',
                text: 'National Hockey League',
                leagueabbr: 'nhl',
                seasons: ['2016/17', '2017/18']
            },
            {
                img: 'img/ahl.png',
                text: 'American Hockey League',
                leagueabbr: 'ahl',
                seasons: ['2016/17', '2017/18']
            },
            {
                img: 'img/echl.png',
                text: 'East Coast Hockey League',
                leagueabbr: 'echl',
                seasons: ['2016/17', '2017/18']
            },
            {
                img: 'img/chl.png',
                text: 'Champions Hockey League',
                leagueabbr: 'chl',
                seasons: ['2016/17', '2017/18']
            },
            {
                img: 'img/cc.png',
                text: 'Continental Cup',
                leagueabbr: 'cc',
                competitionType: 'tournament',
                seasons: ['2016/17', '2017/18']
            },
            {
                img: 'img/del.png',
                text: 'Deutsche Eishockey Liga',
                leagueabbr: 'del',
                seasons: ['2016/17', '2017/18']
            },
            {
                img: 'img/el.png',
                text: 'Erste Liga',
                leagueabbr: 'el',
                seasons: ['2017/18']
            },
            {
                img: 'img/shl.png',
                text: 'Svenska hockeyligan',
                leagueabbr: 'shl',
                seasons: ['2015/16', '2016/17', '2017/18']
            },
            {
                img: 'img/mol.png',
                text: 'MOL Liga',
                leagueabbr: 'mol',
                seasons: ['2016/17']
            },
            {
                img: 'img/ebel.png',
                text: 'Erste Bank Eishockey Liga',
                leagueabbr: 'ebel',
                seasons: ['2016/17', '2017/18']
            },
            {
                img: 'img/lnh.png',
                text: 'Liga Nationala de Hochei',
                leagueabbr: 'lnh',
                seasons: ['2016/17']
            },
            {
                img: 'img/vc.png',
                text: 'Visegrád Cup',
                leagueabbr: 'vc',
                seasons: ['2017/18']
            },
            {
                img: 'img/mjsz.png',
                text: 'Magyar Kupa',
                leagueabbr: 'mk',
                seasons: ['2016/17', '2017/18']
            }
        ];
        returnObject.getSeasonParam = function (season) {
            return season.substring(2).replace('/', '');
        };

        return returnObject;
    }]);
