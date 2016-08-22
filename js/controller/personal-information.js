'use strict';

app.controller('personal-information-ctrl', ['$scope', function ($scope) {
    
    $scope.selectedTab = 0;

    $scope.setSelectedTab = function(newVal) {
        $scope.selectedTab = newVal;
    }

}]);
