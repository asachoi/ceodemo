'use strict';

app.controller("test1-ctrl", ['$scope', function ($scope) {
    $scope.init = function (renderTo) {
        if (!renderTo) renderTo = 'container';
        var data1 = [106.4, 129.2, 144.0];
        var data2 = [276.0, 235.6, 248.5];
        var chart = new Highcharts.Chart({

            chart: {
                renderTo: renderTo,
                animation: false
            },
            
            credits: {
                enabled: false
            },

            title: {
                text: 'Weath Forecasting'
            },

            xAxis: {
                title: { text: 'Age' },
                categories: ['Now (25)', '35', '45']
            },

            yAxis: {
                title: {
                    text: 'Values (M HKD)'
                }
            },

            plotOptions: {
                series: {
                    point: {
                        events: {

                            drag: function (e) {
                                // Returning false stops the drag and drops. Example:
                                /*
                                if (e.newY > 300) {
                                    this.y = 300;
                                    return false;
                                }
                                */

                                // $('#drag').html(
                                    // 'Dragging <b>' + this.series.name + '</b>, <b>' + this.category + '</b> to <b>' + Highcharts.numberFormat(e.y, 2) + '</b>');
                            },
                            drop: function () {
                                // $('#drop').html(
                                    // 'In <b>' + this.series.name + '</b>, <b>' + this.category + '</b> was set to <b>' + Highcharts.numberFormat(this.y, 2) + '</b>');
                            }
                        }
                    },
                    stickyTracking: false
                },
                column: {
//                    stacking: 'normal'
                },
                line: {
                    cursor: 'ns-resize'
                }
            },

            tooltip: {
                enabled: false,
                yDecimals: 2
            },

            series: [{
                id: 'series1',
                name: 'Forex',
                data: data1,//[106.4, 129.2, 144.0],
                draggableX: true,
                draggableY: true,
                dragMinY: 0,
                type: 'column',
                minPointLength: 2,
            }, {
                id: 'series2',
                name: 'Bullion',
                data: data2,//[176.0, 135.6, 148.5],
                draggableX: true,
                draggableY: true,
                dragMinY: 0,
                type: 'column',
                minPointLength: 2
            }, {
                linkedTo: 'series1',
                enableMouseTracking: false,
                // data: [129.2, 148.5, 216.4],
                data: data1,
                draggableX: false,
                draggableY: false,
                dragMinY: 0
            }, {
                linkedTo: 'series2',
                enableMouseTracking: false,
                // data: [129.2, 148.5, 216.4],
                data: data2,
                draggableX: false,
                draggableY: false,
                dragMinY: 0
            }]

        });
    };

}]);
