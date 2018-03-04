/* globals moment */

angular.module('molApp').directive('attendanceDate', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/attendance-date.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', 'chartOptions', function ($scope, chartOptions) {
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

            if ($scope.data.leagueData.chartsby) {
                seriesBy = $scope.data.leagueData.chartsby;
                series = _.map($scope.data.leagueData[$scope.data.leagueData.chartsby], function (propertyObject) {
                    return propertyObject.short;
                });
            } else if ($scope.data.leagueData.teamColors.by) {
                seriesBy = $scope.data.leagueData.teamColors.by;
                series = _.map($scope.data.leagueData[$scope.data.leagueData.teamColors.by], function (propertyObject) {
                    return propertyObject.three;
                });
                colors = _.map($scope.data.leagueData[$scope.data.leagueData.teamColors.by], function (propertyObject) {
                    return {
                        borderColor: propertyObject.color,
                        backgroundColor: propertyObject.color
                    };
                });
            } else {
                series = [];
            }
            options = {
                scales: chartOptions.scales(),
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
                annotation: chartOptions.annotation($scope.commonData.totalAverage, 'solid', true /*noText*/ , 'below' /*placement*/ ),
                animation: {
                    onProgress: function () { //add annotation label on the y axis
                        var ctx = this.chart.ctx;
                        var x = 10,
                            y = this.chart.controller.annotation.elements.lineAverage._model.y1 - 7;
                        ctx.fillStyle = '#d9d9d9';
                        ctx.fillText('Average', x, y);
                    }
                }
            };

            //additions to default options
            options.scales.yAxes[0].scaleLabel = {
                display: true,
                labelString: 'Attendance'
            };
            options.scales.xAxes[0].type = 'time';

            var dataSeries = [];
            //initialize datasets with keys in the same order as 'series' to match the colors
            if (series.length > 0) {
                for (var i in series) {
                    dataSeries[series[i]] = [];
                }
            } else {
                dataSeries[0] = [];
            }

            $scope.data.attendanceData.dataArray.map(function (dataRow) {
                var bubble = {
                    x: new Date(dataRow.date).getTime(),
                    y: dataRow.attendance,
                    r: 3,
                    team1: dataRow.team1,
                    team2: dataRow.team2,
                };

                if (series.length > 0) {
                    var seriesByPropertyValue = _.find($scope.data.leagueData.teams, {
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

            $scope.series = series;
            $scope.chartData = chartData;
            $scope.colors = colors;
            $scope.options = options;
            }]
    };
});
