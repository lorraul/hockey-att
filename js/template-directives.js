//directives
angular.module('molApp')

.directive('leaguePageTitle', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/league-page-title.html',
        scope: {
            image: '=',
            title: '=',
            gameslink: '=',
            updated: '=',
        }
    };
})

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

.directive('teamHomeMap', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/team-home-map.html',
        scope: {
            map: '=',
            attendance: '=',
            teams: '=',
            averageatt: '='
        },
        link: function(scope){
            var cityAtt = scope.attendance,
                cityName = scope.teams.map(function(team) { return team.label; }),
                cityLat = scope.teams.map(function(team) { return team.location.lat; }),
                cityLon = scope.teams.map(function(team) { return team.location.lon; }),
                citySize = [],
                hoverText = [],
                scale = scope.averageatt/250;

            for ( var i = 0 ; i < cityAtt.length; i++) {
                //size of bubbles
                citySize.push(((cityAtt[i] / scale)-10)*2);
                //popup text
                hoverText.push(cityName[i] + "<br>Att: " + cityAtt[i]);
            }

            var data = [{
                type: 'scattergeo',
                mode: 'markers',
                lat: cityLat,
                lon: cityLon,
                text: hoverText,
                hoverinfo: 'text',
                marker: {
                    size: citySize,
                    sizemin: 10,
                    sizemode: 'area',
                    line: {
                        color: 'black',
                        width: 2
                    },
                    color: citySize,
                    colorscale: 'Bluered'
                }
            }];
            
            //map limits
            latOffset = _.has(scope, 'map.offset')? scope.map.offset[0]:(_.max(_.map(cityLat, Number)) - _.min(_.map(cityLat, Number)))/10;
            lonOffset = _.has(scope, 'map.offset')? scope.map.offset[1]:(_.max(_.map(cityLon, Number)) - _.min(_.map(cityLon, Number)))/10;
            
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
                    scope: _.has(scope, 'map.region')? scope.map.region:'world',
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
                        'range': [_.min(_.map(cityLon, Number)) - lonOffset, _.max(_.map(cityLon, Number)) + lonOffset]
                    },
                    lataxis: {
                        'range': [_.min(_.map(cityLat, Number)) - latOffset, _.max(_.map(cityLat, Number)) + latOffset]
                    }
                },
            };
            
            Plotly.plot('map-container', data, layout);
        }
    };
})

.directive('teamAway', function(){
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

.directive('teamHomeAway', function(){
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

.directive('teamRecordHome', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/team-record-home.html'
    };
})

.directive('teamRecordAway', function(){
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