angular.module('molApp')

.controller("NavbarCtrl", ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) { 
        return $location.path().indexOf(viewLocation) == 0;
    };
}])

.controller("MolCtrl", ['$scope', 'AttendanceDataRes', 'globalChartOptions', function ($scope, AttendanceDataRes, globalChartOptions) {
    
    //hockey ligue season data
    $scope.countries = [
        {
            name: 'Hungary',
            two: 'hu',
            three: 'HUN',
            color: '#8db600'
        },
        {
            name: 'Romania',
            two: 'ro',
            three: 'ROM',
            color: '#fdb600'
        },
        {
            name: 'Serbia',
            two: 'rs',
            three: 'SRB',
            color: '#1aa3ff'
        }
    ];
    $scope.months = ['September','October','November','December','January','February','March'];
    $scope.teams = [
        {
            short: 'Bra',
            long: 'ASC Corona Brasov',
            label: 'Brasov',
            color: '#fdb600'
        },
        {
            short: 'Deb',
            long: 'Debreceni HK',
            label: 'Debrecen',
            color: '#8db600'
        },
        {
            short: 'Gal',
            long: 'Dunarea Galati',
            label: 'Galati',
            color: '#fdb600'
        },
        {
            short: 'Dab',
            long: 'Duna\xFAjv\xE1rosi Ac\xE9lbik\xE1k',
            label: 'Duna\xFAjv\xE1ros',
            color: '#8db600'
        },
        {
            short: 'Mis',
            long: 'DVTK Jegesmedv\xE9k',
            label: 'Miskolc',
            color: '#8db600'
        },
        {
            short: 'Feh',
            long: 'Feh\xE9rv\xE1ri Tit\xE1nok',
            label: 'Feh\xE9rv\xE1r',
            color: '#8db600'
        },
        {
            short: 'Fer',
            long: 'Ferencv\xE1rosi TC',
            label: 'Ferencv\xE1ros',
            color: '#8db600'
        },
        {
            short: 'Beo',
            long: 'HK Beograd',
            label: 'Beograd',
            color: '#1aa3ff'
        },
        {
            short: 'Mac',
            long: 'MAC Budapest',
            label: 'MAC',
            color: '#8db600'
        },
        {
            short: 'Csi',
            long: 'SC Cs\xEDkszereda',
            label: 'Cs\xEDkszereda',
            color: '#fdb600'
        },
        {
            short: 'Ute',
            long: '\xDAjpesti TE',
            label: '\xDAjpest',
            color: '#8db600'
        }
    ];
    $scope.sources = [
        'Official game sheets: http://icehockey.hu/oldalak/mol_liga/menetrend',
        'Game reports from http://hkb.rs/ and http://www.hockeyserbia.com/ for HK Beograd home games.'
    ];
    
    
    //meta
    var latestDate = getLatestDate(getColumn(AttendanceDataRes.dataArray, 'date'));
    $scope.updated = latestDate.getFullYear().toString() + '-' + (latestDate.getMonth()+1).toString() + '-' + latestDate.getDate().toString();
    $scope.gamesLink = AttendanceDataRes.metaData.gamesLink;
    
    //total average
    $scope.dataTotal= {
        total: getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance')),
        highest: getMax(AttendanceDataRes.dataArray, 'attendance'),
        lowest: getMin(AttendanceDataRes.dataArray, 'attendance')
    }
    
    $scope.optionsBarChart = globalChartOptions.barChart($scope.dataTotal.total);
    $scope.optionsLineChart = globalChartOptions.lineChart($scope.dataTotal.total);
    
    
    //country stats
    $scope.dataCountry = [[]];
    $scope.colorsCountry = [{backgroundColor: [], borderColor: []}];
    $scope.labelsCountry = [];
    for (var i in $scope.countries){
        $scope.dataCountry[0].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', $scope.countries[i].three)))
        $scope.colorsCountry[0].backgroundColor.push($scope.countries[i].color);
        $scope.colorsCountry[0].borderColor.push($scope.countries[i].color);
        $scope.labelsCountry.push($scope.countries[i].three);
    }

    //month stats
    $scope.colorsMonth = globalChartOptions.monthChartColors;

    $scope.labelsMonth = [];
    $scope.dataMonth = [[]];    
    for (var i in $scope.months){
        $scope.labelsMonth.push($scope.months[i]);
        $scope.dataMonth[0].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'date', $scope.months[i])));
    }
    
    //team stats    
    $scope.colorsTeams = [{backgroundColor: [], borderColor: []}];
    $scope.labelsTeams = [];
    for (var i in $scope.teams){
        $scope.colorsTeams[0].backgroundColor.push($scope.teams[i].color);
        $scope.colorsTeams[0].borderColor.push($scope.teams[i].color);
        $scope.labelsTeams.push($scope.teams[i].label);
    }

    $scope.dataHome = [[]];
    $scope.dataAway = [[]];
    
    for (var i in $scope.teams){
        $scope.dataHome[0][i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', $scope.teams[i].long));
        $scope.dataAway[0][i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', $scope.teams[i].long));
    }
}])

.controller("LnhCtrl", ['$scope', 'AttendanceDataRes', 'globalChartOptions', function ($scope, AttendanceDataRes, globalChartOptions) {
    //hockey ligue season data
    $scope.countries = [];
    $scope.months = ['September','October','November','December','January','February','March'];
    $scope.teams =[
        {
            short: 'Bra',
            long: 'ASC Corona Brasov',
            label: 'Brasov',
            color: '#fdb600'
        },
        {
            short: 'Gal',
            long: 'Dunarea Galati',
            label: 'Galati',
            color: '#fdb600'
        },
        {
            short: 'Pro',
            long: 'Progym Gyergy\xF3',
            label: 'Progym',
            color: '#fdb600'
        },
        {
            short: 'Csi',
            long: 'SC Cs\xEDkszereda',
            label: 'Cs\xEDkszereda',
            color: '#fdb600'
        },
        {
            short: 'Spo',
            long: 'Sportul Studentesc',
            label: 'Sportul',
            color: '#fdb600'
        },
        {
            short: 'Ste',
            long: 'Steaua Bucuresti',
            label: 'Steaua',
            color: '#fdb600'
        }
    ];
    $scope.sources = [
        'Official game sheets on Pointstreak',
    ];    
    
    //meta
    var latestDate = getLatestDate(getColumn(AttendanceDataRes.dataArray, 'date'));
    $scope.updated = latestDate.getFullYear().toString() + '-' + (latestDate.getMonth()+1).toString() + '-' + latestDate.getDate().toString();
    $scope.gamesLink = AttendanceDataRes.metaData.gamesLink;
    
    //total average
    $scope.dataTotal= {
        total: getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance')),
        highest: getMax(AttendanceDataRes.dataArray, 'attendance'),
        lowest: getMin(AttendanceDataRes.dataArray, 'attendance')
    }
    
    $scope.optionsBarChart = globalChartOptions.barChart($scope.dataTotal.total);
    $scope.optionsLineChart = globalChartOptions.lineChart($scope.dataTotal.total);
    
    //country stats
    if($scope.countries.length != 0){
        //country stats
        $scope.dataCountry = [[]];
        $scope.colorsCountry = [{backgroundColor: [], borderColor: []}];
        $scope.labelsCountry = [];
        for (var i in $scope.countries){
            $scope.dataCountry[0].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', $scope.countries[i].three)))
            $scope.colorsCountry[0].backgroundColor.push($scope.countries[i].color);
            $scope.colorsCountry[0].borderColor.push($scope.countries[i].color);
            $scope.labelsCountry.push($scope.countries[i].three);
        }
    }

    //month stats
    $scope.colorsMonth = globalChartOptions.monthChartColors;

    $scope.labelsMonth = [];
    $scope.dataMonth = [[]];    
    for (var i in $scope.months){
        $scope.labelsMonth.push($scope.months[i]);
        $scope.dataMonth[0].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'date', $scope.months[i])));
    }
    
    //team stats    
    $scope.colorsTeams = [{backgroundColor: [], borderColor: []}];
    $scope.labelsTeams = [];
    for (var i in $scope.teams){
        $scope.colorsTeams[0].backgroundColor.push($scope.teams[i].color);
        $scope.colorsTeams[0].borderColor.push($scope.teams[i].color);
        $scope.labelsTeams.push($scope.teams[i].label);
    }

    $scope.dataHome = [[]];
    $scope.dataAway = [[]];
    
    for (var i in $scope.teams){
        $scope.dataHome[0][i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', $scope.teams[i].long));
        $scope.dataAway[0][i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', $scope.teams[i].long));
    }
}])

.controller("EbelCtrl", ['$scope', 'AttendanceDataRes', 'globalChartOptions', function ($scope, AttendanceDataRes, globalChartOptions) {
    //hockey ligue season data
    $scope.countries = [
        {
            name: 'Austria',
            two: 'at',
            three: 'AUT',
            color: '#cc0000'
        },
        {
            name: 'Czech Republic',
            two: 'cz',
            three: 'CZE',
            color: '#0086b3'
        },
        {
            name: 'Hungary',
            two: 'hu',
            three: 'HUN',
            color: '#8db600'
        },
        {
            name: 'Italy',
            two: 'it',
            three: 'ITA',
            color: '#ff9900'
        },
        {
            name: 'Slovenia',
            two: 'si',
            three: 'SLO',
            color: '#0066ff'
        }
    ];
    $scope.months = ['September','October','November','December','January','February','March'];
    $scope.teams =[
        {
            short: 'Bla',
            long: 'Black Wings Linz',
            label: 'Black Wings',
            color: '#cc0000'
        },
        {
            short: 'Dor',
            long: 'Dornbirner EC',
            label: 'Dornbirner EC',
            color: '#cc0000'
        },
        {
            short: 'Feh',
            long: 'Feh\xE9rv\xE1r AV19',
            label: 'Feh\xE9rv\xE1r AV19',
            color: '#8db600'
        },
        {
            short: 'Gra',
            long: 'Graz 99ers',
            label: 'Graz 99ers',
            color: '#cc0000'
        },
        {
            short: 'Bol',
            long: 'HC Bolzano',
            label: 'HC Bolzano',
            color: '#ff9900'
        },
        {
            short: 'Kac',
            long: 'KAC',
            label: 'EC KAC',
            color: '#cc0000'
        },
        {
            short: 'Lju',
            long: 'Olimpija Ljubljana',
            label: 'Olimpija Ljubljana',
            color: '#0066ff'
        },
        {
            short: 'Zno',
            long: 'Orli Znojmo',
            label: 'Orli Znojmo',
            color: '#0086b3'
        },
        {
            short: 'Red',
            long: 'Red Bull Salzburg',
            label: 'Red Bull Salzburg',
            color: '#cc0000'
        },
        {
            short: 'Ins',
            long: 'TWK Innsbruck',
            label: 'TWK Innsbruck',
            color: '#cc0000'
        },
        {
            short: 'Vie',
            long: 'Vienna Capitals',
            label: 'Vienna Capitals',
            color: '#cc0000'
        },
        {
            short: 'Vsv',
            long: 'VSV',
            label: 'EC VSV',
            color: '#cc0000'
        },
    ];
    $scope.sources = [
        'Official game sheets: http://erstebankliga.at/spielplan',
    ];
    
    
    //meta
    var latestDate = getLatestDate(getColumn(AttendanceDataRes.dataArray, 'date'));
    $scope.updated = latestDate.getFullYear().toString() + '-' + (latestDate.getMonth()+1).toString() + '-' + latestDate.getDate().toString();
    $scope.gamesLink = AttendanceDataRes.metaData.gamesLink;
    
    //total average
    $scope.dataTotal= {
        total: getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance')),
        highest: getMax(AttendanceDataRes.dataArray, 'attendance'),
        lowest: getMin(AttendanceDataRes.dataArray, 'attendance')
    }
    
    $scope.optionsBarChart = globalChartOptions.barChart($scope.dataTotal.total);
    $scope.optionsLineChart = globalChartOptions.lineChart($scope.dataTotal.total);
    
    
    //country stats
    $scope.dataCountry = [[]];
    $scope.colorsCountry = [{backgroundColor: [], borderColor: []}];
    $scope.labelsCountry = [];
    for (var i in $scope.countries){
        $scope.dataCountry[0].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'country', $scope.countries[i].three)))
        $scope.colorsCountry[0].backgroundColor.push($scope.countries[i].color);
        $scope.colorsCountry[0].borderColor.push($scope.countries[i].color);
        $scope.labelsCountry.push($scope.countries[i].three);
    }

    //month stats
    $scope.colorsMonth = globalChartOptions.monthChartColors;

    $scope.labelsMonth = [];
    $scope.dataMonth = [[]];    
    for (var i in $scope.months){
        $scope.labelsMonth.push($scope.months[i]);
        $scope.dataMonth[0].push(getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'date', $scope.months[i])));
    }
    
    //team stats    
    $scope.colorsTeams = [{backgroundColor: [], borderColor: []}];
    $scope.labelsTeams = [];
    for (var i in $scope.teams){
        $scope.colorsTeams[0].backgroundColor.push($scope.teams[i].color);
        $scope.colorsTeams[0].borderColor.push($scope.teams[i].color);
        $scope.labelsTeams.push($scope.teams[i].label);
    }

    $scope.dataHome = [[]];
    $scope.dataAway = [[]];
    
    for (var i in $scope.teams){
        $scope.dataHome[0][i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team1', $scope.teams[i].long));
        $scope.dataAway[0][i] = getAverage(getColumn(AttendanceDataRes.dataArray, 'attendance', 'team2', $scope.teams[i].long));
    }
}])

;