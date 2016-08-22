'use strict';

app.controller("proposalDetails-ctrl", ['$scope', '$controller', function ($scope, $controller) {

  $controller('tab-ctrl', { $scope: $scope });

  $scope.tabs = [
    { name: "About Insured", page: "../components/_proposal-details-about-insured.html"},
    { name: "Solution Information", page: "../components/_proposal-details-solution-information.html"}
  ];

}]);
