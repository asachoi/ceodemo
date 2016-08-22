'use strict';

app.controller("edisclosure-basic-info-ctrl", ['$scope', '$document', function ($scope, $document) {
  //percent of the slider
  $scope.body = {
    height: 76,
    heightUnit: 1,
    displayHeight: 0,
    weight: 64,
    weightUnit: 1,
    displayWeight: 0,
  };

  $scope.visualMan = {
    minWidth: 50,
    maxWidth: 75,
    minHeight: 30,
    maxHeight: 300,
  };

  $scope.units = {
    height: [
      {
        name: "Inches",
        max: 95
      },
      {
        name: "cm",
        max: 241.3
      }
    ],
    weight: [
      {
        name: "Lbs",
        max: 280
      },
      {
        name: "Kg",
        max: 127.006
      }
    ],
  };

  // Slider
  $scope.sliderOption = {
    options: {
      floor: 0,
      ceil: 100,
      showSelectionBar: true
    }
  };

  $scope.updateView = function() {
    var height = $scope.visualMan.minHeight + $scope.visualMan.maxHeight * $scope.body.height / 100;
    var weight = $scope.visualMan.minWidth + $scope.visualMan.maxWidth * $scope.body.weight / 100;
    $document.find("#visualMan").css({width: weight + 'px', height: height + 'px'});
  };

  $scope.$watch('body.heightUnit', function(newVal, oldVal) {
    $scope.body.displayHeight = $scope.units.height[$scope.body.heightUnit].max * $scope.body.height /100;
    $scope.updateView();
  });
  $scope.$watch('body.height', function(newVal, oldVal) {
    $scope.body.displayHeight = $scope.units.height[$scope.body.heightUnit].max * $scope.body.height /100;
    $scope.updateView();
  });
  $scope.$watch('body.weightUnit', function(newVal, oldVal) {
    $scope.body.displayWeight = $scope.units.weight[$scope.body.weightUnit].max * $scope.body.weight /100;
    $scope.updateView();
  });
  $scope.$watch('body.weight', function(newVal, oldVal) {
    $scope.body.displayWeight = $scope.units.weight[$scope.body.weightUnit].max * $scope.body.weight /100;
    $scope.updateView();
  });


}]);
