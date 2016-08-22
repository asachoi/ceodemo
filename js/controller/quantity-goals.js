'use strict';

app.controller("quantity-goals-ctrl", ['$scope', '$controller', function ($scope, $controller) {
  
  // Tabs
  $controller('tab-ctrl', { $scope: $scope });

  $scope.tabs = [
    { name: "Save for retirement", page: "../components/_quantity-goals-save-for-retirement.html", stars: 2},
    { name: "Buy a home", page: "../components/_quantity-goals-buy-a-home.html", stars: 1}
  ];

  $scope.hasMoreStarThan = function(tab, count) {
    return (tab.stars > count);
  };

  // Chart
  $scope.chartColours = ['#eaeaea', '#8d449a'];
  $scope.chartMax = 2310000;
  $scope.targetAge = 55;
  $scope.neededPerYear = 100;
  $scope.chartDataCache = [];

  $scope.$on('goal-chart-update', function(evt, data){
    $scope.handleGoalChartUpdate(data);
  });

  $scope.handleGoalChartUpdate = function(data) {
    $scope.chartDataCache[data.index] = data;
    if (data.index == $scope.selectedTab) {
      $scope.targetAge = data.targetAge;
      $scope.neededPerYear = data.neededPerYear;
      $scope.chartMax = data.chartMax;
      $scope.series1Color = data.series1Color;
      $scope.setChartData();
    }
  }

  $scope.prevGoal = function() {
    $scope.prevTab();
    $scope.handleGoalChartUpdate($scope.chartDataCache[$scope.selectedTab]);
  }

  $scope.nextGoal = function() {
    $scope.nextTab();
    $scope.handleGoalChartUpdate($scope.chartDataCache[$scope.selectedTab]);
  }

  $scope.setGoal = function(newGoal) {
    $scope.setTab(newGoal);
    $scope.handleGoalChartUpdate($scope.chartDataCache[newGoal]);
  }

  $scope.initChart = function(renderTo) {
    if (!renderTo) renderTo = 'container';
    $scope.chart = new Highcharts.Chart({
      chart: {
          renderTo: renderTo,
          defaultSeriesType: 'line'
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      xAxis: {
        labels: {
          enabled: false,
          formatter: function() {
            return '<span style="font-size:1.5em;fill:#333;">' + this.value + '</span>';
          }
        },
        tickWidth: 0,
        lineWidth: 0
      },
      yAxis: {
        gridLineWidth: 0,
        min: 0,
        max: 100,
        title: {
            text: null
        },
        labels: {
          enabled: false
        }
      },
      legend: {
          layout: 'vertical',
          backgroundColor: '#FFFFFF',
          style: {
              left: '100px',
              top: '70px',
              bottom: 'auto'
          }
      },
      tooltip: {
          enabled: false,
          formatter: function() {
              return '<b>'+ this.series.name +'</b><br/>'+
                  this.x +': '+ this.y;
          }
      },
      plotOptions: {
          column:{stacking: true,},
          series: {
              dataLabels: {
                  enabled: false,
                  formatter: function(){
                      return ( this.series.hideDataLabels ) ? '' : this.y;
                  }
              },
              states: {
                hover: {
                  enabled: false
                }
              }
          }
      },
      series: [{
          showInLegend: false,
          color: $scope.chartColours[0],
          type: "column",
          data: [90]
      },{
          showInLegend: false,
          color: $scope.chartColours[1],
          type: "column",
          data: [10]
      }]
    });

  }

  $scope.setChartData = function() {
    // console.log($scope.neededPerYear + " / " + $scope.chartMax);
    if ($scope.chart.series[1].options.color != $scope.series1Color) {
      $scope.chart.series[1].options.color = $scope.series1Color;
      $scope.chart.series[1].update($scope.chart.series[1].options);
    }
    $scope.chart.yAxis[0].setExtremes(0, $scope.chartMax);
    $scope.chart.series[0].setData([$scope.chartMax - $scope.neededPerYear], true, null, true);
    $scope.chart.series[1].setData([$scope.neededPerYear], true, null, true);
    // $scope.chart.setTitle({text:"At Age " + $scope.targetAge + " You Will Need"});
    // $scope.chart.xAxis[0].update({categories:["HK$ " + Math.floor($scope.neededPerYear)]}, true);
  }

}]);
