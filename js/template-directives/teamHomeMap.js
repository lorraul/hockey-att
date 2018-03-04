angular.module('molApp').directive('teamHomeMap', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/team-home-map.html',
        scope: {
            data: '=',
            commonData: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.competitionType = $scope.data.leagueData.competitionType ? $scope.data.leagueData.competitionType : 'league';
            $scope.teams = $scope.data.leagueData.teams;
            $scope.averageatt = $scope.commonData.totalAverage;
            $scope.map = $scope.data.leagueData.map;
            $scope.stages = $scope.data.leagueData.stages;

            if ($scope.competitionType == 'league') {
                $scope.attendance = $scope.commonData.teamSeries.homeAverage;
            } else if ($scope.competitionType == 'tournament') {
                $scope.attendance = $scope.commonData.averageByStage.values;
            }

            var attendances = $scope.attendance;
            var labels, latitudes, longitudes,
                bubbleSizes = [],
                hoverText = [],
                scale = $scope.averageatt / 250;

            if ($scope.competitionType == 'tournament') {
                labels = $scope.stages.map(function (stage) {
                    return stage.location.label + ' (' + $scope.long + ')';
                });
                latitudes = $scope.stages.map(function (stage) {
                    return stage.location.location.lat;
                });
                longitudes = $scope.stages.map(function (stage) {
                    return stage.location.location.lon;
                });
            } else {
                labels = $scope.teams.map(function (team) {
                    return team.label;
                });
                latitudes = $scope.teams.map(function (team) {
                    return team.location.lat;
                });
                longitudes = $scope.teams.map(function (team) {
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
            var latOffset = _.has($scope, 'map.offset') ? $scope.map.offset[0] : (_.max(_.map(latitudes, Number)) - _.min(_.map(latitudes, Number))) / 10,
                lonOffset = _.has($scope, 'map.offset') ? $scope.map.offset[1] : (_.max(_.map(longitudes, Number)) - _.min(_.map(longitudes, Number))) / 10;

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
                    scope: _.has($scope, 'map.region') ? $scope.map.region : 'world',
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
            }]
    };
});
