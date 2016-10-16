angular.module('molApp')

.controller("NavbarCtrl", ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) { 
        return $location.path().indexOf(viewLocation) == 0;
    };
}])

.controller("MolCtrl", ['$scope', 'AttendanceDataRes', 'ligueStats', function ($scope, AttendanceDataRes, ligueStats) {
    $scope.ligueData = {
        countries: [
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
        ],
        months: ['September','October','November','December','January','February','March'],
        stages: [
            {
                short: 'RS',
                long: 'Regular season'
            },
            {
                short: 'QF',
                long: 'Quarterfinals'
            },
            {
                short: 'SF',
                long: 'Semifinals'
            },
            {
                short: 'FIN',
                long: 'Final'
            }
        ],
        teams: [
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
        ],
        sources: [
            'Official game sheets: http://icehockey.hu/oldalak/mol_liga/menetrend'
        ]
    };
    $scope.ligueStats = ligueStats(AttendanceDataRes, $scope.ligueData);
}])

.controller("LnhCtrl", ['$scope', 'AttendanceDataRes', 'ligueStats', function ($scope, AttendanceDataRes, ligueStats) {
    $scope.ligueData = {
        countries: [],
        months: ['September','October','November','December','January','February','March'],
        stages: [
            {
                short: 'RS',
                long: 'Regular season'
            },
            {
                short: 'SF',
                long: 'Semifinals'
            },
            {
                short: 'FIN',
                long: 'Final'
            }
        ],
        teams: [
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
    ],
        sources: ['Official game sheets on Pointstreak']
    };
    $scope.ligueStats = ligueStats(AttendanceDataRes, $scope.ligueData);
}])

.controller("EbelCtrl", ['$scope', 'AttendanceDataRes', 'ligueStats', function ($scope, AttendanceDataRes, ligueStats) {
    $scope.ligueData = {
        countries: [
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
        ],
        months: ['September','October','November','December','January','February','March'],
        stages: [
            {
                short: 'RS',
                long: 'Regular season'
            },
            {
                short: 'QF',
                long: 'Quarterfinals'
            },
            {
                short: 'SF',
                long: 'Semifinals'
            },
            {
                short: 'FIN',
                long: 'Final'
            }
        ],
        teams: [
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
        ],
        sources: [
            'Official game sheets: http://erstebankliga.at/spielplan',
        ]
    };
    $scope.ligueStats = ligueStats(AttendanceDataRes, $scope.ligueData);
}])

.controller("NhlCtrl", ['$scope', 'AttendanceDataRes', 'ligueStats', function ($scope, AttendanceDataRes, ligueStats) {
	$scope.ligueData = {
		countries: [
            {
                name: 'Canada',
                two: 'ca',
                three: 'CAN',
                color: '#db0404'
            },
            {
                name: 'United States',
                two: 'us',
                three: 'USA',
                color: '#093c8e'
            }
        ],
        months: ['October','November','December','January','February','March','April','May','June'],
        stages: [
			{
                short: 'RS',
                long: 'Regular Season'
            },
            {
                short: 'FR',
                long: 'PO First Round'
            },
            {
                short: 'SR',
                long: 'PO Second Round'
            },
			{
                short: 'CF',
                long: 'Conference Finals'
            },
            {
                short: 'FIN',
                long: 'Finals'
            }
        ],
		conference: [
			{
				short: 'Eastern',
				long: 'Eastern Conference'
			},
			{
				short: 'Western',
				long: 'Western Conference'
			}
		],
		division: [
			{
				short: 'Atlantic',
				long: 'Atlantic Division'
			},
			{
				short: 'Metropolitan',
				long: 'Metropolitan Division'
			},
			{
				short: 'Central',
				long: 'Central Division'
			},
			{
				short: 'Pacific',
				long: 'Pacific Division'
			}
		],
        teams: [
			{
                short: 'Ana',
                long: 'Anaheim Ducks',
                label: 'Anaheim',
				conference: 'Western',
				division: 'Pacific',
                color: '#093c8e'
            },
			{
                short: 'Ari',
                long: 'Arizona Coyotes',
                label: 'Arizona',
				conference: 'Western',
				division: 'Pacific',
                color: '#093c8e'
            },
			{
                short: 'Bos',
                long: 'Boston Bruins',
                label: 'Boston',
				conference: 'Eastern',
				division: 'Atlantic',
                color: '#093c8e'
            },
			{
                short: 'Buf',
                long: 'Buffalo Sabres',
                label: 'Buffalo',
				conference: 'Eastern',
				division: 'Atlantic',
                color: '#093c8e'
            },
			{
                short: 'Cal',
                long: 'Calgary Flames',
                label: 'Calgary',
				conference: 'Western',
				division: 'Pacific',
                color: '#db0404'
            },
			{
                short: 'Car',
                long: 'Carolina Hurricanes',
                label: 'Carolina',
				conference: 'Eastern',
				division: 'Metropolitan',
                color: '#093c8e'
            },
			{
                short: 'Chi',
                long: 'Chicago Blackhawks',
                label: 'Chicago',
				conference: 'Western',
				division: 'Central',
                color: '#093c8e'
            },
			{
                short: 'Col',
                long: 'Colorado Avalanche',
                label: 'Colorado',
				conference: 'Western',
				division: 'Central',
                color: '#093c8e'
            },
			{
                short: 'Clb',
                long: 'Columbus Blue Jackets',
                label: 'Columbus',
				conference: 'Eastern',
				division: 'Metropolitan',
                color: '#093c8e'
            },
			{
                short: 'Dal',
                long: 'Dallas Stars',
				conference: 'Western',
				division: 'Central',
                label: 'Dallas',
                color: '#093c8e'
            },
			{
                short: 'Det',
                long: 'Detroit Red Wings',
                label: 'Detroit',
				conference: 'Eastern',
				division: 'Atlantic',
                color: '#093c8e'
            },
			{
                short: 'Edm',
                long: 'Edmonton Oilers',
                label: 'Edmonton',
				conference: 'Western',
				division: 'Pacific',
                color: '#db0404'
            },
			{
                short: 'Flo',
                long: 'Florida Panthers',
                label: 'Florida',
				conference: 'Eastern',
				division: 'Atlantic',
                color: '#093c8e'
            },
			{
                short: 'Lan',
                long: 'Los Angeles Kings',
                label: 'Los Angeles',
				conference: 'Western',
				division: 'Pacific',
                color: '#093c8e'
            },
			{
                short: 'Min',
                long: 'Minnesota Wild',
                label: 'Minnesota',
				conference: 'Western',
				division: 'Central',
                color: '#093c8e'
            },
			{
                short: 'Mon',
                long: 'Montreal Canadiens',
                label: 'Montreal',
				conference: 'Eastern',
				division: 'Atlantic',
                color: '#db0404'
            },
			{
                short: 'Nas',
                long: 'Nashville Predators',
                label: 'Nashville',
				conference: 'Western',
				division: 'Central',
                color: '#093c8e'
            },
			{
                short: 'Njr',
                long: 'New Jersey Devils',
                label: 'New Jersey',
				conference: 'Eastern',
				division: 'Metropolitan',
                color: '#093c8e'
            },
			{
                short: 'Nyi',
                long: 'New York Islanders',
                label: 'Islanders',
				conference: 'Eastern',
				division: 'Metropolitan',
                color: '#093c8e'
            },
			{
                short: 'Nyr',
                long: 'New York Rangers',
                label: 'Rangers',
				conference: 'Eastern',
				division: 'Metropolitan',
                color: '#093c8e'
            },
			{
                short: 'Ott',
                long: 'Ottawa Senators',
                label: 'Ottawa',
				conference: 'Eastern',
				division: 'Atlantic',
                color: '#db0404'
            },
			{
                short: 'Phi',
                long: 'Philadelphia Flyers',
                label: 'Philadelphia',
				conference: 'Eastern',
				division: 'Metropolitan',
                color: '#093c8e'
            },
			{
                short: 'Pit',
                long: 'Pittsburgh Penguins',
                label: 'Pittsburgh',
				conference: 'Eastern',
				division: 'Metropolitan',
                color: '#093c8e'
            },
			{
                short: 'San',
                long: 'San Jose Sharks',
                label: 'San Jose',
				conference: 'Western',
				division: 'Pacific',
                color: '#093c8e'
            },
			{
                short: 'Stl',
                long: 'St Louis Blues',
                label: 'St Louis',
				conference: 'Western',
				division: 'Central',
                color: '#093c8e'
            },
			{
                short: 'Tam',
                long: 'Tampa Bay Lightning',
                label: 'Tampa Bay',
				conference: 'Eastern',
				division: 'Atlantic',
                color: '#093c8e'
            },
			{
                short: 'Tor',
                long: 'Toronto Maple Leafs',
                label: 'Toronto',
				conference: 'Eastern',
				division: 'Atlantic',
                color: '#db0404'
            },
			{
                short: 'Van',
                long: 'Vancouver Canucks',
                label: 'Vancouver',
				conference: 'Western',
				division: 'Pacific',
                color: '#db0404'
            },
			{
                short: 'Was',
                long: 'Washington Capitals',
                label: 'Washington',
				conference: 'Eastern',
				division: 'Metropolitan',
                color: '#093c8e'
            },
            {
                short: 'Win',
                long: 'Winnipeg Jets',
                label: 'Winnipeg',
				conference: 'Western',
				division: 'Central',
                color: '#db0404'
            }
        ],
        sources: [
            'Fox Sports: http://www.foxsports.com/nhl/scores'
        ]
    };
    $scope.ligueStats = ligueStats(AttendanceDataRes, $scope.ligueData, $scope.ligueData.division);
}])

.controller("MkCtrl", ['$scope', 'AttendanceDataRes', 'ligueStats', function ($scope, AttendanceDataRes, ligueStats) {
    $scope.ligueData = {
        months: ['October','November','December','January'],
        stages: [
            {
                short: 'QF',
                long: 'Qualifications'
            },
            {
                short: 'SF',
                long: 'Semifinals'
            },
            {
                short: 'FIN',
                long: 'Final'
            }
        ],
        teams: [
            {
                short: 'Deb',
                long: 'Debreceni HK',
                label: 'Debrecen',
                color: '#8db600'
            },
            {
                short: 'Dab',
                long: 'Duna\xFAjv\xE1rosi Ac\xE9lbik\xE1k',
                label: 'Duna\xFAjv\xE1ros',
                color: '#8db600'
            },
            {
                short: 'Hkb',
                long: 'Hokiklub Budapest',
                label: 'Hokiklub',
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
                long: 'Feh\xE9rv\xE1r AV19',
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
                short: 'Mac',
                long: 'MAC Budapest',
                label: 'MAC',
                color: '#8db600'
            },
            {
                short: 'Ute',
                long: '\xDAjpesti TE',
                label: '\xDAjpest',
                color: '#8db600'
            }
        ],
        sources: [
            'Official game sheets: http://icehockey.hu/oldalak/felnott_bajnoksagok/ewhl'
        ]
    };
    $scope.ligueStats = ligueStats(AttendanceDataRes, $scope.ligueData);
}])

.controller("DelCtrl", ['$scope', 'AttendanceDataRes', 'ligueStats', function ($scope, AttendanceDataRes, ligueStats) {
    $scope.ligueData = {
        months: ['September','October','November','December','January','February','March'],
        stages: [
			{
                short: 'RS',
                long: 'Regular Season'
            },
            {
                short: 'R16',
                long: 'Round 16'
            },
			{
                short: 'QF',
                long: 'Quarterfinals'
            },
            {
                short: 'SF',
                long: 'Semifinals'
            },
            {
                short: 'FIN',
                long: 'Finals'
            }
        ],
		teams: [
            {
                short: 'Man',
                long: 'Adler Mannheim',
                label: 'Mannheim',
                color: '#004c97'
            },
			{
                short: 'Aug',
                long: 'Augsburger Panther',
                label: 'Augsburg',
                color: '#004c97'
            },
			{
                short: 'Deg',
                long: 'Düsseldorfer EG',
                label: 'Düsseldor',
                color: '#004c97'
            },
			{
                short: 'Muc',
                long: 'EHC München',
                label: 'München',
                color: '#004c97'
            },
			{
                short: 'Ebb',
                long: 'Eisbären Berlin',
                label: 'Berlin',
                color: '#004c97'
            },
			{
                short: 'Ing',
                long: 'ERC Ingolstadt',
                label: 'Ingolstadt',
                color: '#004c97'
            },
			{
                short: 'Bhv',
                long: 'Fischtown Pinguins',
                label: 'Bremerhaven',
                color: '#004c97'
            },
			{
                short: 'Wob',
                long: 'Grizzlys Wolfsburg',
                label: 'Wolfsburg',
                color: '#004c97'
            },
			{
                short: 'Iec',
                long: 'Iserlohn Roosters',
                label: 'Iserlohn',
                color: '#004c97'
            },
			{
                short: 'Kev',
                long: 'Krefeld Pinguine',
                label: 'Krefeld',
                color: '#004c97'
            },
			{
                short: 'Kec',
                long: 'Kölner Haie',
                label: 'Köln',
                color: '#004c97'
            },
			{
                short: 'Nit',
                long: 'Nürnberg Ice Tigers',
                label: 'Nürnberg',
                color: '#004c97'
            },
			{
                short: 'Sww',
                long: 'Schwenninger WW',
                label: 'Schwenninger',
                color: '#004c97'
            },
			{
                short: 'Str',
                long: 'Straubing Tigers',
                label: 'Straubing',
                color: '#004c97'
            },
        ],
        sources: [
            'Official game sheets: https://www.telekomeishockey.de/del/spielplan'
        ]
    };
    $scope.ligueStats = ligueStats(AttendanceDataRes, $scope.ligueData);
}])
;