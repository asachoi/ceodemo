'use strict';

app.controller("simple-illustration-detail-ctrl", ['$scope', function ($scope) {
    $scope.activeItem = 0;
    $scope.isActive = function(index) {
        return $scope.activeItem == index;
    }
    $scope.toggleTab = function(index) {
        $scope.activeItem = index;
    }
    $scope.toggleDisplay = function(index) {
        if ($scope.chart.series[index].visible) {
            $scope.chart.series[index].hide();
            $scope.seriesChecked[index] = false;
        } else {
            $scope.chart.series[index].show();
            $scope.seriesChecked[index] = true;
        }

    };
    $scope.seriesChecked = [true,true,true,true,true,true];
    $scope.isSeriesVisible = function(index) {
        return $scope.seriesChecked[index];
    };
    var valScale1 = [1.1, 1.15, 1.22, 1.25];
    var valScale2 = [1.1, 1.15, 1.22, 1.35];
    $scope.series = [{
        name: 'Guaranteed cash dividends',
        showInLegend: false,
        data: [0, 175387, 874584, 2451009, 4385644, 5817218,
        5817218 * valScale1[0], 5817218 * valScale1[1], 5817218 * valScale1[2], 5817218 * valScale1[3], 
        7382779],
        marker: { symbol: 'square'},
        color: '#00693c'

    }, {
        name: 'Accumulated dividends',
        showInLegend: false,
        data: [0, 21415, 226265, 713335, 1600075, 2991610, 
        2991610 * valScale2[0], 2991610 * valScale2[1], 2991610 * valScale2[2], 2991610 * valScale2[3], 
        4972770],
        marker: { symbol: 'square'},
        color: '#b94700'

    }, {
        name: 'Total surrender value',
        showInLegend: false,
        data: [0, 196802, 1100849, 3164343, 5985720, 8808828,
        8808828 * valScale2[0], 8808828 * valScale2[1], 8808828 * valScale2[2], 8808828 * valScale2[3], 
        12355548],
        marker: { symbol: 'square'},
        color: '#006ba6'
    }, {
        name: 'Total death benefit',
        showInLegend: false,
        data: [211365, 1103911, 2457784, 4164493, 6345829, 9111520,
        9111520 * valScale2[0], 9111520 * valScale2[1], 9111520 * valScale2[2], 9111520 * valScale2[3], 
        12551289],
        marker: { symbol: 'square'},
        color: '#002d62'

    }, {
        name: 'Accumulated annual premium',
        showInLegend: false,
        data: [208859, 1044294, 2088589, 3132883, 4177177, 5221471, 6265766, 6265766, 6265766, 6265766, 6265766],
        marker: { symbol: 'square'},
        color: '#8c4799'
    }, {
        name: 'Cash dividends',
        showInLegend: false,
        data: [0, 12625, 54319, 104821, 167165, 227944,
        227944 * valScale1[0], 227944 * valScale1[1], 227944 * valScale1[2], 227944 * valScale1[3], 
        291463],
        marker: { symbol: 'square'},
        color: '#da291c'
    }];
    $scope.init = function (renderTo) {
        if (!renderTo) renderTo = 'container';

        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });
        $scope.chart = new Highcharts.Chart({

            chart: {
                renderTo: renderTo,
                type: 'spline'
            },
            
            credits: {
                enabled: false
            },

            title: {
                text: '',
            },

            xAxis: {
                title: { text: 'Age', align: "middle" },
                categories: ['30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80']
            },

            yAxis: {
                title: { text: 'HK$', align: "middle"}
            },

            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                }
            },

            tooltip: {
                enabled: true,
                crosshairs: [{color: '#fdf7e7'}],
                formatter: function() {
                    var getSymbol = function(symbolName) {
                        var symbol;
                        switch ( symbolName ) {
                            case 'circle':
                                symbol = '●';
                                break;
                            case 'diamond':
                                symbol = '♦';
                                break;
                            case 'square':
                                symbol = '■';
                                break;
                            case 'triangle':
                                symbol = '▲';
                                break;
                            case 'triangle-down':
                                symbol = '▼';
                                break;
                        }
                        return symbol;
                    }
                    var s = '<strong style="font-family: Frutiger, Arial, Helvetica, sans-serif;">Age: ' + this.x + '</strong>';

                    $.each(this.points, function () {
                        s += '<br/>' + '<span style="color:' + this.series.color + '"> ' + getSymbol(this.series.symbol) + ' </span>' 
                        + ' <span style="font-family: Frutiger, Arial, Helvetica, sans-serif;">' + this.series.name + ': ' + Highcharts.numberFormat(this.y, 0) + '</span>';
                    });

                    return s;
                },
                shared: true
            },

            series: $scope.series

        });
    };

}]);
