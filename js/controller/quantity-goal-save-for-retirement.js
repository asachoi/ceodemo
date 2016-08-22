'use strict';

app.controller("quantity-goal-save-for-retirement-ctrl", ['$scope', '$rootScope', '$controller', function ($scope, $rootScope, $controller) {

  // Tabs
  // $controller('tab-ctrl', { $scope: $scope });

  $scope.data = {
    // Age Slider
    // targetAge : 55,
    // currentAge : 40,
    // minAge : 18,
    // maxAge : 65,

    // Liftstyle
    // monthlySpendingMin : 20000,
    // monthlySpendingMax : 70000,
    // monthlySpending : 30000,
    // monthlySpendingStep : 1000,
    // yearOfEnjoymentMin : 1,
    // yearOfEnjoymentMax : 30,
    // yearOfEnjoyment : 20,
    inflation : 5,

    //Chart
    chartMax : 25200000
  };

  $scope.ageSlider = {
    currentAge: 20,  //currentAge
    targetAge: 55,  //targetAge
    options: {
      floor: 18, //minAge
      ceil: 65  //max
    }
  };

  $scope.monthlySpendingSlider = {
    monthlySpending: 30000,
    options: {
      floor: 20000,
      ceil: 70000,
      step: 1000,
      showSelectionBar: true
    }
  };

  $scope.yearOfEnjoymentSlider = {
    yearOfEnjoyment: 20,
    options: {
      floor: 1,
      ceil: 30,
      step: 1,
      showSelectionBar: true
    }
  };

  $scope.setMonthlySpending = function(newVal) {
    $scope.monthlySpendingSlider.monthlySpending = newVal;
  };
  $scope.inflationUp = function() {
    if ($scope.data.inflation < 10) $scope.data.inflation++;    
  };
  $scope.inflationDown = function() {
    if ($scope.data.inflation > 0) $scope.data.inflation--;
  };

  // Logic
  $scope.setCalculateNeed = function() {
    var totalNeeded = 12 * $scope.yearOfEnjoymentSlider.yearOfEnjoyment * $scope.monthlySpendingSlider.monthlySpending;//* (1 + $scope.data.inflation / 100);
    // var yearForSaving = $scope.ageSlider.targetAge - $scope.ageSlider.currentAge + 1;
    // var neededPerYear = Math.floor(totalNeeded / yearForSaving);
    var neededPerYear = totalNeeded;
    // neededPerYear = (neededPerYear > $scope.chartMax) ? $scope.chartMax : neededPerYear;
    $rootScope.$broadcast('goal-chart-update', {
      index: 0,
      targetAge: $scope.ageSlider.targetAge,
      neededPerYear: neededPerYear,
      chartMax: $scope.data.chartMax,
      series1Color: "#8d449a"
    });
  };

  $scope.$watch('monthlySpendingSlider.monthlySpending', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('yearOfEnjoymentSlider.yearOfEnjoyment', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('data.inflation', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('ageSlider.currentAge', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('ageSlider.targetAge', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });

}]);
