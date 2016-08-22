'use strict';

app.controller("quantity-goal-buy-a-home-ctrl", ['$scope', '$rootScope', '$controller', function ($scope, $rootScope, $controller) {

  // Tabs
  $controller('tab-ctrl', { $scope: $scope });

  $scope.tabs = [
    { name: "Amount", id: "optionAmount", page: "../components/_buy-a-home-amount.html"},
    { name: "Property Type", id: "optionPropertyType", page: "../components/_buy-a-home-property-type.html"},
//    { name: "Affordability", id: "optionAffordability", page: ""}
  ];

  $scope.homeTypes = [
    {name: "Flat", id: "propertyTypeFlat", rate: 1},
    {name: "House / Villa", id: "propertyTypeVilla", rate: 4},
    {name: "Village House", id: "propertyTypeHouse", rate: 3},
  ];

  $scope.districts = [
    {name: "HK Island", id: "locationHKIsland", rate: 6},
    {name: "Kowloon", id: "locationKowloon", rate: 3},
    {name: "NT", id: "locationNT", rate: 2},
    {name: "Island", id: "locationIslands", rate: 1.5}
  ];

  $scope.data = {

    calcType : $scope.tabs[0].id,
    downPayment: 3000000,
    homeType: $scope.homeTypes[0],
    homeSize: 1000,
    bedRooms: 2,
    district: $scope.districts[0],
    inflation : 5,


    // Age Slider
    // targetAge : 60,
    // currentAge : 40,
    // minAge : 18,
    // maxAge : 65,

    //Chart
    chartMax : [10000000, 435600000]
  };

  $scope.ageSlider = {
    currentAge: 20,  //currentAge
    targetAge: 80,  //targetAge
    options: {
      floor: 18, //minAge
      ceil: 80  //max
    }
  };

  $scope.setHomeSize = function(newValue) {
    if (newValue > 6000) newValue = 6000;
    if (newValue < 200) newValue = 200;
    $scope.data.homeSize = newValue;
  };

  $scope.homeSizeUp = function() {
    $scope.setHomeSize($scope.data.homeSize + 200);

  };
  $scope.homeSizeDown = function() {
    $scope.setHomeSize($scope.data.homeSize - 200);
  };

  $scope.setBedRooms = function(newValue) {
    if (newValue > 10) newValue = 10;
    if (newValue < 1) newValue = 1;
    $scope.data.bedRooms = newValue;
  };

  $scope.bedRoomsUp = function() {
    $scope.setBedRooms($scope.data.bedRooms + 1);

  };
  $scope.bedRoomsDown = function() {
    $scope.setBedRooms($scope.data.bedRooms - 1);
  };

  $scope.inflationUp = function() {
    if ($scope.data.inflation < 10) $scope.data.inflation++;    
  };
  $scope.inflationDown = function() {
    if ($scope.data.inflation > 0) $scope.data.inflation--;
  };

  // Logic
  $scope.setCalculateNeed = function() {
    var yearForSaving = $scope.ageSlider.targetAge - $scope.ageSlider.currentAge + 1;
    yearForSaving = 1;
    var totalNeeded = -1;
    var chartMax = 0;
    switch ($scope.data.calcType) {
      case $scope.tabs[0].id:
        totalNeeded = $scope.data.downPayment;// * (1 + $scope.data.inflation / 100);
        chartMax = $scope.data.chartMax[0];
        break;
      case $scope.tabs[1].id:
        var pricePerFeet = 10000;
        totalNeeded = pricePerFeet * $scope.data.homeSize
                      * (1 + $scope.data.bedRooms/100)
                      * $scope.data.homeType.rate
                      * $scope.data.district.rate
                      * (1 + $scope.data.inflation / 100);
        chartMax = $scope.data.chartMax[1];
        break;
      default:
        break;
    }
    if (totalNeeded > 0) {
      var neededPerYear = Math.floor(totalNeeded / yearForSaving);// * 12;
      neededPerYear = (neededPerYear > chartMax) ? chartMax : neededPerYear;
      $rootScope.$broadcast('goal-chart-update', {
        index: 1,
        targetAge: $scope.ageSlider.targetAge,
        neededPerYear: neededPerYear,
        chartMax: chartMax,
        series1Color: "#006aa9"
      });
    }
  };

  $scope.$watch('ageSlider.currentAge', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('ageSlider.targetAge', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('data.calcType', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('data.downPayment', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('data.inflation', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('data.homeType', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('data.homeSize', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('data.bedRooms', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });
  $scope.$watch('data.district', function(newVal, oldVal) {
    $scope.setCalculateNeed();
  });

}]);
