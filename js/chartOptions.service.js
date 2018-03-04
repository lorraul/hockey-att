angular.module('molApp').factory('chartOptions', ['$stateParams', 'AttendanceData', function ($stateParams, AttendanceData) {
    var returnObject = {};
    returnObject.annotation = function (average, lineStyle, noText, placement) {
        return {
            annotations: [{
                id: 'lineAverage',
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: average,
                borderColor: 'rgba(255,102,102,0.9)',
                borderWidth: 1,
                borderDash: (lineStyle == 'dashed') ? [8, 10] : null,
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
                    enabled: noText ? false : true,
                    content: 'Average'
                }
                }],
            drawTime: (placement == 'below') ? 'beforeDatasetsDraw' : 'afterDraw'
        };
    };
    returnObject.scales = function () {
        return {
            xAxes: [{
                gridLines: {
                    color: '#262626',
                    lineWidth: 1
                },
                barPercentage: 0.5, //only for barcharts
                ticks: {
                    fontColor: '#d9d9d9',
                }
            }],
            yAxes: [{
                gridLines: {
                    color: '#262626',
                    lineWidth: 1
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        };
    };
    return returnObject;
}]);
