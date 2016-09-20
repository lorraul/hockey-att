angular.module('molApp')

.controller("NavbarCtrl", ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) { 
        return $location.path().indexOf(viewLocation) == 0;
    };
}])

.controller("MolCtrl", ['$scope', 'AttendanceDataRes', function ($scope, AttendanceDataRes) {
    var latestDate = getLatestDate(getColumn(AttendanceDataRes.dataArray, 'date'));
    $scope.updated = latestDate.getFullYear().toString() + '-' + (latestDate.getMonth()+1).toString() + '-' + latestDate.getDate().toString();
    $scope.gamesLink = AttendanceDataRes.metaData.gamesLink;
    
    var gridLines = {
        color: '#262626',
        lineWidth: 1
    };
    var scaleLabelColor = '#d9d9d9';
    var horizontalLineStyle = 'rgba(255,102,102,0.4)',
        horizontalLineText = 'Average';
    
    $scope.totalAverage = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance'));
    
    $scope.highestAtt = getMax(AttendanceDataRes.dataArray, 'attendance');
    $scope.lowestAtt = getMin(AttendanceDataRes.dataArray, 'attendance');
    
    //country stats
    $scope.avgHun = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', 'HUN'));
    $scope.avgRom = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', 'ROM'));
    $scope.avgSrb = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', 'SRB'));
    
    var colors = ['#8db600','#fdb600','#1aa3ff'];
    $scope.colorsCountry = [{
        backgroundColor: colors,
        borderColor: colors
    }];
    $scope.labelsCountry = ['HUN', 'ROM', 'SRB'];
    $scope.dataCountry = [[
        $scope.avgHun,
        $scope.avgRom,
        $scope.avgSrb
    ]];
    $scope.optionsCountry = {
        horizontalLine: [{
          "y": $scope.totalAverage,
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
    
    //month stats
    $scope.colorsMonth = [{
        borderColor: '#1aa3ff',
        borderWidth: 3,
        pointRadius: 3,
        pointBackgroundColor: '#8db600',
        pointBorderColor: '#8db600',
    }];
    $scope.optionsMonth = {
        horizontalLine: [{
          "y": $scope.totalAverage,
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
    
    var months = [
        ['september','avgSep'],
        ['october','avgOct'],
        ['november','avgNov'],
        ['december','avgDec'],
        ['january','avgJan'],
        ['february','avgFeb'],
        ['march','avgMar'],
    ];
    
    $scope.labelsMonth = [];
    $scope.dataMonth = [[]];
    
    for (var i in months){
        $scope[months[i][1]] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'date', months[i][0]));
        $scope.labelsMonth.push(capitalize(months[i][0]));
        $scope.dataMonth[0].push($scope[months[i][1]]);
    }
    
    //team list: scope name, chart bar color, name at source, name on chart scale label
    var teams =[
        ['avgBra','#fdb600','ASC Corona Brasov','Brasov'],
        ['avgDeb','#8db600','Debreceni HK','Debrecen'],
        ['avgGal','#fdb600','Dunarea Galati','Galati'],
        ['avgDab','#8db600','Duna\xFAjv\xE1rosi Ac\xE9lbik\xE1k','Duna\xFAjv\xE1ros'],
        ['avgMis','#8db600','DVTK Jegesmedv\xE9k','Miskolc'],
        ['avgFeh','#8db600','Feh\xE9rv\xE1ri Tit\xE1nok','Feh\xE9rv\xE1r'],
        ['avgFer','#8db600','Ferencv\xE1rosi TC','Ferencv\xE1ros'],
        ['avgBeo','#1aa3ff','HK Beograd','Beograd'],
        ['avgMac','#8db600','MAC Budapest','MAC'],
        ['avgCsi','#fdb600','SC Cs\xEDkszereda','Cs\xEDkszereda'],
        ['avgUte','#8db600','\xDAjpesti TE','\xDAjpest']
    ];
    
    //team charts colors, options
    var colors=[];
    for (var i in teams){
        colors.push(teams[i][1])
    }
    $scope.colorsTeams = [{
        backgroundColor: colors,
        borderColor: colors
    }];  
    var options = {
        horizontalLine: [{
          "y": $scope.totalAverage,
          "style": horizontalLineStyle,
          "text": horizontalLineText
        }],
        scales: {
            xAxes: [{
                barPercentage: 0.5,
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
    
    //home team stats
    $scope.labelsHome = [];
    $scope.dataHome = [[]];
    for (var i in teams){
        $scope[teams[i][0]+'Home'] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', teams[i][2]));
        $scope.labelsHome[i] = capitalize(teams[i][3]);
        $scope.dataHome[0][i] = $scope[teams[i][0]+'Home'];
    }
    
    $scope.optionsHome = options;
    
    //away team stats
    $scope.labelsAway = [];
    $scope.dataAway = [[]];
    
    for (var i in teams){
        $scope[teams[i][0]+'Away'] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', teams[i][2]));
        $scope.labelsAway[i] = capitalize(teams[i][3]);
        $scope.dataAway[0][i] = $scope[teams[i][0]+'Away'];
    }
    $scope.optionsAway = options;
}])

.controller("LnhCtrl", ['$scope', 'AttendanceDataRes', function ($scope, AttendanceDataRes) {
    if (AttendanceDataRes=='error'){ $scope.error = 'Error: data source!'}
    var latestDate = getLatestDate(getColumn(AttendanceDataRes.dataArray, 'date'));
    $scope.updated = latestDate.getFullYear().toString() + '-' + (latestDate.getMonth()+1).toString() + '-' + latestDate.getDate().toString();
    $scope.gamesLink = AttendanceDataRes.metaData.gamesLink;
    
    var gridLines = {
        color: '#262626',
        lineWidth: 1
    };
    var scaleLabelColor = '#d9d9d9';
    var horizontalLineStyle = 'rgba(255,102,102,0.4)',
        horizontalLineText = 'Average';
    
    $scope.totalAverage = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance'));
    
    $scope.highestAtt = getMax(AttendanceDataRes.dataArray, 'attendance');
    $scope.lowestAtt = getMin(AttendanceDataRes.dataArray, 'attendance');
    
    //month stats
    $scope.colorsMonth = [{
        borderColor: '#1aa3ff',
        borderWidth: 3,
        pointRadius: 3,
        pointBackgroundColor: '#8db600',
        pointBorderColor: '#8db600',
    }];
    $scope.optionsMonth = {
        horizontalLine: [{
          "y": $scope.totalAverage,
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
    var months = [
        ['september','avgSep'],
        ['october','avgOct'],
        ['november','avgNov'],
        ['december','avgDec'],
        ['january','avgJan'],
        ['february','avgFeb'],
        ['march','avgMar'],
    ];
    
    $scope.labelsMonth = [];
    $scope.dataMonth = [[]];
    
    for (var i in months){
        $scope[months[i][1]] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'date', months[i][0]));
        $scope.labelsMonth.push(capitalize(months[i][0]));
        $scope.dataMonth[0].push($scope[months[i][1]]);
    }
    
    
    //teams list: scope name, color, source name, label
    var teams =[
        ['avgBra','#fdb600','ASC Corona Brasov','Brasov'],
        ['avgGal','#fdb600','Dunarea Galati','Galati'],
        ['avgPro','#fdb600','Progym Gyergy\xF3szentmikl\xF3s','Progym'],
        ['avgCsi','#fdb600','SC Cs\xEDkszereda','SC Cs\xEDkszereda'],
        ['avgSpo','#fdb600','Sportul Studentesc','Sportul'],
        ['avgSte','#fdb600','Steaua Bucuresti','Steaua']
    ];
    
    //team charts colors,options
    var colors=[];
    for (var i in teams){
        colors.push(teams[i][1])
    }
    $scope.colorsTeams = [{
        backgroundColor: colors,
        borderColor: colors
    }];  
    var options = {
        horizontalLine: [{
          "y": $scope.totalAverage,
          "style": horizontalLineStyle,
          "text": horizontalLineText
        }],
        scales: {
            xAxes: [{
                barPercentage: 0.5,
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
    
    //home team stats
    $scope.labelsHome = [];
    $scope.dataHome = [[]];
    for (var i in teams){
        $scope[teams[i][0]+'Home'] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', teams[i][2]));
        $scope.labelsHome[i] = capitalize(teams[i][3]);
        $scope.dataHome[0][i] = $scope[teams[i][0]+'Home'];
    }
    
    $scope.optionsHome = options;
    
    //away team stats
    
    $scope.labelsAway = [];
    $scope.dataAway = [[]];
    
    for (var i in teams){
        $scope[teams[i][0]+'Away'] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', teams[i][2]));
        $scope.labelsAway[i] = capitalize(teams[i][3]);
        $scope.dataAway[0][i] = $scope[teams[i][0]+'Away'];
    }
    
    $scope.optionsAway = options;
    
}])

.controller("EbelCtrl", ['$scope', 'AttendanceDataRes', function ($scope, AttendanceDataRes) {
    if (AttendanceDataRes=='error'){ $scope.error = 'Error: data source!'}
    var latestDate = getLatestDate(getColumn(AttendanceDataRes.dataArray, 'date'));
    $scope.updated = latestDate.getFullYear().toString() + '-' + (latestDate.getMonth()+1).toString() + '-' + latestDate.getDate().toString();
    $scope.gamesLink = AttendanceDataRes.metaData.gamesLink;
    
    $scope.totalAverage = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance'));    
    $scope.highestAtt = getMax(AttendanceDataRes.dataArray, 'attendance');
    $scope.lowestAtt = getMin(AttendanceDataRes.dataArray, 'attendance');
    
    //chart options and styles
    var gridLines = {
        color: '#262626',
        lineWidth: 1
    };
    var scaleLabelColor = '#d9d9d9';
    var horizontalLineStyle = 'rgba(255,102,102,0.4)',
        horizontalLineText = 'Average';
    var barChartOptions = {
        horizontalLine: [{
          "y": $scope.totalAverage,
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
    
    //country stats
    $scope.avgAut = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', 'AUT'));
    $scope.avgCze = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', 'CZE'));
    $scope.avgHun = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', 'HUN'));
    $scope.avgIta = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', 'ITA'));
    $scope.avgSlo = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', 'SLO'));
    
    var colors = ['#cc0000','#0086b3','#8db600','#ff9900','#0066ff'];
    $scope.colorsCountry = [{
        backgroundColor: colors,
        borderColor: colors
    }];
    $scope.labelsCountry = ['AUT','CZE','HUN','ITA','SLO'];
    $scope.dataCountry = [[$scope.avgAut,$scope.avgCze,$scope.avgHun,$scope.avgIta,$scope.avgSlo]];
    $scope.optionsCountry = barChartOptions;
    
    //month stats
    $scope.colorsMonth = [{
        borderColor: '#1aa3ff',
        borderWidth: 3,
        pointRadius: 3,
        pointBackgroundColor: '#8db600',
        pointBorderColor: '#8db600',
    }];
    $scope.optionsMonth = {
        horizontalLine: [{
          "y": $scope.totalAverage,
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
    
    var months = [
        ['september','avgSep'],
        ['october','avgOct'],
        ['november','avgNov'],
        ['december','avgDec'],
        ['january','avgJan'],
        ['february','avgFeb'],
        ['march','avgMar'],
    ];
    
    $scope.labelsMonth = [];
    $scope.dataMonth = [[]];
    
    for (var i in months){
        $scope[months[i][1]] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'date', months[i][0]));
        $scope.labelsMonth.push(capitalize(months[i][0]));
        $scope.dataMonth[0].push($scope[months[i][1]]);
    }
    
    //team list: scope name, chart bar color, name at source, name on chart scale label
    var teams =[
        ['avgBla','#cc0000','Black Wings Linz','Black Wings'],
        ['avgDor','#cc0000','Dornbirner EC','Dornbirner EC'],
        ['avgFeh','#8db600','Feh\xE9rv\xE1r AV19','Feh\xE9rv\xE1r AV19'],
        ['avgGra','#cc0000','Graz 99ers','Graz 99ers'],
        ['avgBol','#ff9900','HC Bolzano','HC Bolzano'],
        ['avgKac','#cc0000','KAC','EC KAC'],
        ['avgLju','#0066ff','Olimpija Ljubljana','Olimpija Ljubljana'],
        ['avgZno','#0086b3','Orli Znojmo','Orli Znojmo'],
        ['avgRed','#cc0000','Red Bull Salzburg','Red Bull Salzburg'],
        ['avgIns','#cc0000','TWK Innsbruck','TWK Innsbruck'],
        ['avgVie','#cc0000','Vienna Capitals','Vienna Capitals'],
        ['avgVsv','#cc0000','VSV','EC VSV'],
    ];
    
    //team charts colors, options
    var colors=[];
    for (var i in teams){
        colors.push(teams[i][1])
    }
    $scope.colorsTeams = [{
        backgroundColor: colors,
        borderColor: colors
    }];  
    var options = {
        horizontalLine: [{
          "y": $scope.totalAverage,
          "style": horizontalLineStyle,
          "text": horizontalLineText
        }],
        scales: {
            xAxes: [{
                barPercentage: 0.5,
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
    
    //home team stats
    $scope.labelsHome = [];
    $scope.dataHome = [[]];
    for (var i in teams){
        $scope[teams[i][0]+'Home'] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', teams[i][2]));
        $scope.labelsHome[i] = capitalize(teams[i][3]);
        $scope.dataHome[0][i] = $scope[teams[i][0]+'Home'];
    }

    $scope.optionsHome = options;
    
    //away team stats
    $scope.labelsAway = [];
    $scope.dataAway = [[]];
    
    for (var i in teams){
        $scope[teams[i][0]+'Away'] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', teams[i][2]));
        $scope.labelsAway[i] = capitalize(teams[i][3]);
        $scope.dataAway[0][i] = $scope[teams[i][0]+'Away'];
    }
    $scope.optionsAway = options;
}])
;