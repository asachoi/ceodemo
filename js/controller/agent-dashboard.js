'use strict';

app.controller('delightMeterController', ['$scope', '$timeout', function ($scope, $timeout) {
    // performance meter
    $scope.initVal = 0;
    $scope.delightScore = 0;
    $timeout(function(){$scope.delightScore=$scope.initVal;}, 1000);

    // Notification tab
    $scope.activeNotificationTab = 0;
    $scope.changeNotificationTab = function(newVal) {
    	$scope.activeNotificationTab = newVal;
    }
    $scope.isActiveNotificationTab = function(val) {
    	return $scope.activeNotificationTab == val;
    }
}]);
