'use strict';

app.controller("collect-asset-info-ctrl", ['$scope', function ($scope) {

  // Chart
  $scope.labels = ["Save for retirement", "Buy a home"];
  $scope.assets = [700000, 100000];
  $scope.totalAssets = 800000;
  $scope.legend = true;
  $scope.colours = ['#8d449a', '#006aa9'];
  $scope.options = { animationEasing: 'none'};

  $scope.annualReturnRate = 5;
  $scope.monthlyIncome = 50000;
  $scope.monthlyMPF = 1500;

  // Slider
  $scope.monthlySavingSlider = {
    monthlySaving: 20000,
    options: {
      floor: 0,
      ceil: 50000,
      showSelectionBar: true
    }
  };
  // $scope.monthlySaving = 20000;
  // $scope.monthlySavingMin = 0;
  // $scope.monthlySavingMax = 50000;

  $scope.$watch('assets[0]', function(newVal, oldVal) {
    $scope.setChartData();
  });

  $scope.$watch('assets[1]', function(newVal, oldVal) {
    $scope.setChartData();
  });

  $scope.initChart = function(renderTo) {
    if (!renderTo) renderTo = 'container';
    $scope.chart = new Highcharts.Chart({
      chart: {
          renderTo: renderTo,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      tooltip: {
        enabled: false,
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
          }
      },
      legend: {
        enabled:false
        // itemStyle: {
        //   fontSize: '15px',
        //   fontFamily: 'Frutiger,​Arial,​Helvetica,​sans-serif'
        // },
        // symbolHeight: 25,
        // symbolWidth: 25
      },
      series: [{
        // name: 'Brands',
        // colorByPoint: true,
        data: [{
          name: $scope.labels[0],
          color: $scope.colours[0],
          y: $scope.assets[0]
        }, {
          name: $scope.labels[1],
          color: $scope.colours[1],
          y: $scope.assets[1],
          sliced: false,
          selected: false
        }]
      }]
    });

  }

  $scope.setChartData = function() {
    $scope.chart.series[0].setData($scope.assets, true, null, true);
  }

}]);
