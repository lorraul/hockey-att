/*
Chart.js horizontal line plugin 
Source: http://stackoverflow.com/questions/38324238/draw-horizontal-lines-in-chart-js-2-0
*/
var horizonalLinePlugin = {
  afterDraw: function(chartInstance) {
      
    var yScale = chartInstance.scales["y-axis-0"];
    var canvas = chartInstance.chart;
    var ctx = canvas.ctx;
    var index;
    var line;
    var style;
    var labelSize;

    if (chartInstance.options.horizontalLine) {
      for (index = 0; index < chartInstance.options.horizontalLine.length; index++) {
        line = chartInstance.options.horizontalLine[index];

        if (!line.style) {
          style = "rgba(169,169,169, .6)";
        } else {
          style = line.style;
        }

        if (line.y) {
          yValue = yScale.getPixelForValue(line.y);
        } else {
          yValue = 0;
        }

        ctx.lineWidth = 3;

        if (yValue) {
          ctx.beginPath();
          ctx.moveTo(yScale.width, yValue);
          ctx.lineTo(canvas.width, yValue);
          ctx.strokeStyle = style;
          ctx.stroke();
        }
          
          if (chartInstance.options.scales.yAxes[0].ticks.fontSize != undefined){
              labelSize = parseInt(chartInstance.options.scales.yAxes[0].ticks.fontSize);
          } else {
              labelSize = parseInt(chartInstance.config.options.defaultFontSize);
          }

        if (line.text) {
          ctx.fillStyle = style;
          ctx.fillText(line.text, yScale.width, yValue-labelSize-4);
        }
      }
      return;
    };
  }
};
Chart.pluginService.register(horizonalLinePlugin);
