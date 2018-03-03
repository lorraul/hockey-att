/* globals moment */

//directives
angular.module('molApp')

    .directive('leaguePageTitle', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/league-page-title.html',
            scope: {
                image: '=',
                title: '=titleString',
                gameslink: '=',
                updated: '=',
                notStarted: '='
            }
        };
    })

    .directive('totalAverage', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/total-average.html',
            scope: {
                data: '=',
            }
        };
    })

    .directive('attendanceDate', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/attendance-date.html',
            scope: {
                data: '='
            },
            link: function (scope, element, attrs) {

                var series, chartData = [],
                    colors, options, seriesBy;

                colors = [
                    {
                        borderColor: '#1aa3ff',
                        backgroundColor: '#1aa3ff'
                    },
                    {
                        borderColor: '#8db600',
                        backgroundColor: '#8db600'
                    },
                    {
                        borderColor: '#ff6c0a',
                        backgroundColor: '#ff6c0a'
                    },
                    {
                        borderColor: '#db0404',
                        backgroundColor: '#db0404'
                    }
                ];

                if (scope.data.leagueData.chartsby) {
                    seriesBy = scope.data.leagueData.chartsby;
                    series = _.map(scope.data.leagueData[scope.data.leagueData.chartsby], function (propertyObject) {
                        return propertyObject.short;
                    });
                } else if (scope.data.leagueData.teamColors.by) {
                    seriesBy = scope.data.leagueData.teamColors.by;
                    series = _.map(scope.data.leagueData[scope.data.leagueData.teamColors.by], function (propertyObject) {
                        return propertyObject.three;
                    });
                    colors = _.map(scope.data.leagueData[scope.data.leagueData.teamColors.by], function (propertyObject) {
                        return {
                            borderColor: propertyObject.color,
                            backgroundColor: propertyObject.color
                        };
                    });
                } else {
                    series = [];
                }
                options = {
                    scales: {
                        xAxes: [{
                            type: 'time',
                            gridLines: {
                                color: '#262626',
                                lineWidth: 1
                            },
                            ticks: {
                                fontColor: '#d9d9d9'
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                color: '#262626',
                                lineWidth: 1
                            },
                            ticks: {
                                beginAtZero: true
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Attendance'
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            label: function (t, d) {
                                var dateString = moment(t.xLabel).format("MMM DD, YYYY");
                                return [dateString + ': ', d.datasets[t.datasetIndex].data[t.index].team1 + '-' + d.datasets[t.datasetIndex].data[t.index].team2, 'Att: ' + t.yLabel];
                            }
                        },
                        mode: 'single'
                    },
                    legend: {
                        display: (series.length > 0) ? true : false
                    },
                    annotation: {
                        annotations: [{
                            type: 'line',
                            mode: 'horizontal',
                            scaleID: 'y-axis-0',
                            value: getAverage(getColumnFiltered(scope.data.attendanceData.dataArray, null, 'attendance')),
                            borderColor: 'red',
                            borderWidth: 1,
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
                                content: 'Average'
                            }
                        }],
                        drawTime: 'beforeDatasetsDraw'
                    }
                };

                var dataSeries = [];
                //initialize datasets with keys in the same order as 'series' to match the colors
                if (series.length > 0) {
                    for (var i in series) {
                        dataSeries[series[i]] = [];
                    }
                } else {
                    dataSeries[0] = [];
                }

                scope.data.attendanceData.dataArray.map(function (dataRow) {
                    var bubble = {
                        x: new Date(dataRow.date).getTime(),
                        y: dataRow.attendance,
                        r: 3,
                        team1: dataRow.team1,
                        team2: dataRow.team2,
                    };

                    if (series.length > 0) {
                        var seriesByPropertyValue = _.find(scope.data.leagueData.teams, {
                            'long': dataRow.team1
                        })[seriesBy];
                        dataSeries[seriesByPropertyValue].push(bubble);
                    } else {
                        dataSeries[0].push(bubble);
                    }
                });

                Object.keys(dataSeries).forEach(function (key) {
                    chartData.push(dataSeries[key]);
                });

                scope.series = series;
                scope.chartData = chartData;
                scope.colors = colors;
                scope.options = options;
            }
        };
    })

    .directive('country', function () {
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

    .directive('month', function () {
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

    .directive('stage', function () {
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

    .directive('teamHome', function () {
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

    .directive('teamHomeMap', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/team-home-map.html',
            scope: {
                map: '=',
                attendance: '=',
                teams: '=',
                averageatt: '=',
                competitionType: '=?',
                stages: '=?'
            },
            link: function (scope) {
                var attendances = scope.attendance;
                var labels, latitudes, longitudes,
                    bubbleSizes = [],
                    hoverText = [],
                    scale = scope.averageatt / 250;

                if (scope.competitionType == 'tournament') {
                    labels = scope.stages.map(function (stage) {
                        return stage.location.label + ' (' + stage.long + ')';
                    });
                    latitudes = scope.stages.map(function (stage) {
                        return stage.location.location.lat;
                    });
                    longitudes = scope.stages.map(function (stage) {
                        return stage.location.location.lon;
                    });
                } else {
                    labels = scope.teams.map(function (team) {
                        return team.label;
                    });
                    latitudes = scope.teams.map(function (team) {
                        return team.location.lat;
                    });
                    longitudes = scope.teams.map(function (team) {
                        return team.location.lon;
                    });
                }

                for (var i = 0; i < attendances.length; i++) {
                    //size of bubbles
                    bubbleSizes.push(((attendances[i] / scale) - 10) * 2);
                    //popup text
                    hoverText.push(labels[i] + "<br>Att: " + attendances[i]);
                }

                var data = [{
                    type: 'scattergeo',
                    mode: 'markers',
                    lat: latitudes,
                    lon: longitudes,
                    text: hoverText,
                    hoverinfo: 'text',
                    marker: {
                        size: bubbleSizes,
                        sizemin: 10,
                        sizemode: 'area',
                        line: {
                            color: 'black',
                            width: 2
                        },
                        color: bubbleSizes,
                        colorscale: 'Bluered'
                    }
                }];

                //map limits
                var latOffset = _.has(scope, 'map.offset') ? scope.map.offset[0] : (_.max(_.map(latitudes, Number)) - _.min(_.map(latitudes, Number))) / 10,
                    lonOffset = _.has(scope, 'map.offset') ? scope.map.offset[1] : (_.max(_.map(longitudes, Number)) - _.min(_.map(longitudes, Number))) / 10;

                var layout = {
                    /*title: 'Attendances in ' + scope.league,
                    titlefont: {
                        family: 'Archivo Narrow',
                        size: 30
                    },*/
                    showlegend: false,
                    width: angular.element('#map-container').width(),
                    margin: {
                        l: 0,
                        r: 0,
                        t: 0,
                        b: 0
                    },
                    paper_bgcolor: '#1a1a1a',
                    geo: {
                        scope: _.has(scope, 'map.region') ? scope.map.region : 'world',
                        resolution: 50,
                        showcoastlines: true,
                        coastlinecolor: '#606060',
                        coastlinewidth: 1,
                        showland: true,
                        landcolor: 'rgb(217, 217, 217)',
                        showocean: true,
                        oceancolor: '#93a9d6',
                        showlakes: true,
                        lakecolor: '#93a9d6',
                        showrivers: true,
                        riverscolor: '#5f83cc',
                        showcountries: true,
                        countrycolor: '#ffffff',
                        showsubunits: true,
                        subunitcolor: '#ffffff',
                        bgcolor: '#606060',
                        lonaxis: {
                            'range': [_.min(_.map(longitudes, Number)) - lonOffset, _.max(_.map(longitudes, Number)) + lonOffset]
                        },
                        lataxis: {
                            'range': [_.min(_.map(latitudes, Number)) - latOffset, _.max(_.map(latitudes, Number)) + latOffset]
                        }
                    },
                };

                Plotly.plot('map-container', data, layout);
            }
        };
    })

    .directive('teamAway', function () {
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

    .directive('teamHomeAway', function () {
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

    .directive('teamRecordHome', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/team-record-home.html'
        };
    })

    .directive('teamRecordAway', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/team-record-away.html'
        };
    })

    .directive('teamLowestHome', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/team-lowest-home.html'
        };
    })

    .directive('teamLowestAway', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/team-lowest-away.html'
        };
    })

    .directive('sources', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/sources.html',
            scope: {
                sources: '=data',
            }
        };
    });
