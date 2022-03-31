$(document).ready(function() {
    var checkIfElementIsVisibleForPieChart = function(baseElement, elem) {
        var startAnimation = elem.hasClass('go');
        if (startAnimation) {
            setTimeout(function() {
                animatePieChart(baseElement, elem);
            });
        } else {
            setTimeout(function() {
                checkIfElementIsVisibleForPieChart(baseElement, elem);
            });
        }
    };
  
    var animatePieChart = function(baseElement, elem) {
        let isAnimationDone = false;
        var barWidths = [], barColors = [], barLabels=[];
        var authoredBarWidths = elem.attr('data-bar-widths');
        var authoredBarLabels = [];
        var authoredBarColors = elem.attr('data-bar-colors');
  
        if(authoredBarWidths) {
          barWidths = authoredBarWidths.split(',');
        }
  
        if(authoredBarColors) {
          barColors = authoredBarColors.split(',');
        }
  
        elem.find('.bar-label').each(function() {
          authoredBarLabels.push($(this).val());
        });
  
        if (isAnimationDone === false) {
            Chart.pluginService.register({
  
                afterUpdate: function(chart) {
  
                    for (let i = 1; i < chart.config.data.labels.length; i++) {
  
                        var arc = chart.getDatasetMeta(0).data[i];
                        arc.round = {
                            x: (chart.chartArea.left + chart.chartArea.right) / 2,
                            y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
                            radius: (chart.outerRadius + chart.innerRadius) / 2,
                            thickness: (chart.outerRadius - chart.innerRadius) / 2-1,
                            backgroundColor: arc._model.backgroundColor
                        }
  
                    }
  
                    // Draw rounded corners for first item
                    var arc = chart.getDatasetMeta(0).data[0];
                    arc.round = {
                        x: (chart.chartArea.left + chart.chartArea.right) / 2,
                        y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
                        radius: (chart.outerRadius + chart.innerRadius) / 2,
                        thickness: (chart.outerRadius - chart.innerRadius) / 2 - 1,
                        backgroundColor: arc._model.backgroundColor
                    }
  
  
                },
  
                afterDatasetsDraw: function(chart) {
  
                    for (let i = 1; i < chart.config.data.labels.length; i++) {
  
                        var ctx = chart.chart.ctx;
                        var arc = chart.getDatasetMeta(0).data[i];
                        var startAngle = Math.PI / 2 - arc._view.startAngle;
                        var endAngle = Math.PI / 2 - arc._view.endAngle;
                        ctx.save();
                        ctx.translate(arc.round.x, arc.round.y);
                        ctx.fillStyle = arc.round.backgroundColor;
                        ctx.beginPath();
                        ctx.arc(arc.round.radius * Math.sin(endAngle), arc.round.radius * Math.cos(endAngle), arc.round.thickness, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
  
                    }
  
                    var ctx = chart.chart.ctx;
                    arc = chart.getDatasetMeta(0).data[0];
                    var startAngle = Math.PI / 2 - arc._view.startAngle;
                    var endAngle = Math.PI / 2 - arc._view.endAngle;
                    ctx.save();
                    ctx.translate(arc.round.x, arc.round.y);
                    ctx.fillStyle = arc.round.backgroundColor;
                    ctx.beginPath();
                    ctx.arc(arc.round.radius * Math.sin(endAngle), arc.round.radius * Math.cos(endAngle), arc.round.thickness, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                },
  
            });
            var config = {
                type: 'doughnut',
  
                data: {
  
                    labels: authoredBarLabels,
  
                    datasets: [{
                        data: barWidths,
  
                        backgroundColor: barColors,
                        borderWidth: 1,
                    }]
                },
                options: {
  
                    aspectRatio: 1,
                    responsive: true,
                    legend: false,
                    cutoutPercentage: 78,
                    tooltips: false,
                    hover: false,
                    elements: {
                        arc: {
                            roundedCornersFor: 0
                        }
  
                    }
                }
            };
            var ctx = elem.find("#doughnutChart");
  
            var myChart = new Chart(ctx, config);
  
  
            isAnimationDone = true;
        }
    }
  
    $('.pie-chart-component').each(function() {
        checkIfElementIsVisibleForPieChart($(this), $(this).find('.pie-chart-outer-wrapper'));
    });
  
  });