'use strict';

app.controller("edisclosure-tracker-ctrl", ['$scope', '$document', function ($scope, $document) {
  //Image map
  $scope.initImageMap = function() {
    angular.element('img[usemap]').rwdImageMaps();

    angular.element( "#1" ).on( "click", function(e) {
        e.preventDefault();
        $scope.goToPage("edisclosure-basic-info.html");
    });

    angular.element( "#2" ).on( "click", function(e) {
        e.preventDefault();
        $scope.goToPage("edisclosure-family-history.html");
    });

    angular.element( "#3" ).on( "click", function(e) {
        e.preventDefault();
        $scope.goToPage("edisclosure-personal-medical-history.html");
    });
  };


}]);
