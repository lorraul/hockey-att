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

    .factory('EntityData', ['$resource', function ($resource) {
        return function (entity, fileName) {
            var datafile = 'data/' + entity + '/' + fileName + '.json';
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

    .factory('AttendanceRawDataFindBySheet', ['AttendanceRawDataBySheet', '$resource', '$q', function (AttendanceRawDataBySheet, $resource, $q) {
        var sheetNr = 1;
        return function(spreadsheetId, sheetTitle){
            var defer = $q.defer();
            recursiveAtt(defer, spreadsheetId, 1, sheetTitle);
            return defer.promise;
            
            function recursiveAtt(defer, spreadsheetId, sheetNr, sheetTitle){
                AttendanceRawDataBySheet(spreadsheetId, sheetNr).then(
                function(data){
                    if (data.title.$t === sheetTitle){
                        defer.resolve(data);
                    } else {
                        recursiveAtt(defer, spreadsheetId, sheetNr+1, sheetTitle);
                    }
                },
                function (error) {
                    return 'No data found fot' + sheetTitle;
                }
            ); 
            }
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
                                if (!dataObject.stage ||
                                    !dataObject.date || !dataObject.team1 || !dataObject.team2) {
                                    continue;
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

    .factory('AttendanceData2', ['AttendanceRawData', 'EntityData', function (AttendanceRawData, EntityData) {
        return function (entity, fileName) {
            return EntityData(entity, fileName).then(
                function (entityData) {
                    if (!entityData.spreadsheet) return null;
                    return AttendanceRawData(entityData.spreadsheet, entityData.sheetnr).then(
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
                            metaData.dataSourceLink = data.link[0].href;

                            var returnObject = {
                                attendanceData: {},
                                entityData: {}
                            };
                            returnObject.attendanceData.dataArray = dataArray;
                            returnObject.attendanceData.metaData = metaData;
                            returnObject.entityData = entityData;
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
                seasons: ['2015/16', '2016/17', '2017/18']
            },
            {
                img: 'img/ahl.png',
                text: 'American Hockey League',
                leagueabbr: 'ahl',
                seasons: ['2015/16', '2016/17', '2017/18']
            },
            {
                img: 'img/echl.png',
                text: 'East Coast Hockey League',
                leagueabbr: 'echl',
                seasons: ['2016/17', '2017/18']
            },
            {
                img: 'img/iihf.png',
                text: 'World Championship',
                leagueabbr: 'wc',
                competitionType: 'tournament',
                seasons: ['2016', '2017', '2018']
            },
            {
                img: 'img/khl.png',
                text: 'Kontinental Hockey League',
                leagueabbr: 'khl',
                seasons: ['2017/18']
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
                img: 'img/czel.jpg',
                text: 'Czech Extraliga',
                leagueabbr: 'czel',
                seasons: ['2017/18']
            },
            {
                img: 'img/skel.png',
                text: 'Slovenská Extraliga',
                leagueabbr: 'skel',
                seasons: ['2017/18']
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
                img: 'img/sml.png',
                text: 'SM-liiga',
                leagueabbr: 'sml',
                seasons: ['2015/16', '2016/17', '2017/18']
            },
            {
                img: 'img/nla.png',
                text: 'National League',
                leagueabbr: 'nla',
                seasons: ['2017/18']
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
                img: 'img/eihl.png',
                text: 'EIHL',
                leagueabbr: 'eihl',
                seasons: ['2017/18']
            },
            {
                img: 'img/phl.png',
                text: 'PHL',
                leagueabbr: 'phl',
                seasons: ['2015/16', '2016/17', '2017/18']
            },
            {
                img: 'img/mjsz.png',
                text: 'Magyar Kupa',
                leagueabbr: 'mk',
                seasons: ['2016/17', '2017/18']
            }
        ];
        returnObject.seasonGrid = ['2015/16', '2016/17', '2017/18'];
        returnObject.getSeasonParam = function (season) {
            if (season.indexOf('/') > -1) {
                return season.substring(2).replace('/', '');
            } else {
                return season;
            }
        };

        return returnObject;
    }]);
